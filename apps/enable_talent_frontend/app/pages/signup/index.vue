<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <CustomAlert
      :show="showAlert"
      :message="alertMessage"
      :title="alertTitle"
      :type="alertType"
      @close="showAlert = false"
    />

    <JourneyUserJourneyOverlay
      v-if="journeyType === 'user'"
      :show="showOverlay"
      :onComplete="handleUserJourneyComplete"
      @close="handleOverlayClose"
    />

    <JourneyMentorJourneyOverlay
      v-else-if="journeyType === 'mentor'"
      :show="showOverlay"
      :onComplete="handleMentorJourneyComplete"
      @close="handleOverlayClose"
    />

    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
      >
        {{ error }}
      </div>

      <div
        v-if="successMessage"
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4"
      >
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleSignup" class="space-y-5">
        <FormRoleSelector v-model="role" label="Register as" />

        <FormTextInput
          id="name"
          v-model="name"
          type="text"
          label="Full Name"
          placeholder="Jane Doe"
          required
        />

        <FormEmailInput
          id="email"
          v-model:value="email"
          v-model:error="emailError"
          label="Email"
          placeholder="you@example.com"
          required
        />

        <FormPasswordInput
          id="password"
          v-model:value="password"
          v-model:error="passwordError"
          label="Password"
          :show-strength="true"
          :show-error="true"
          required
        />

        <FormPasswordInput
          id="confirmPassword"
          v-model:value="confirmPassword"
          v-model:error="confirmPasswordError"
          label="Confirm Password"
          :show-error="true"
          required
        />

        <button
          type="submit"
          :disabled="isLoading"
          :class="role === 'mentor'
            ? 'bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'"
          class="w-full text-white py-2.5 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Creating Account...' : (role === 'mentor' ? 'Sign Up as Mentor' : 'Sign Up as User') }}
        </button>

        <p class="text-center text-gray-600 text-sm mt-4">
          Already have an account?
          <NuxtLink to="/login" class="text-orange-600 hover:underline">Login</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
// Disable SSR for signup page to avoid hydration issues with dynamic form validation
definePageMeta({
  ssr: false,
});

// Form fields
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('user');

// Form state
const isLoading = ref(false);
const error = ref('');
const successMessage = ref('');

// Field errors
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// Journey overlay state
const showOverlay = ref(false);
const journeyType = ref('user');

// Alert state
const showAlert = ref(false);
const alertMessage = ref('');
const alertTitle = ref('');
const alertType = ref('info');

// Validate password match
const validatePasswordMatch = () => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match';
  } else {
    confirmPasswordError.value = '';
  }
};

watch(confirmPassword, validatePasswordMatch);
watch(password, validatePasswordMatch);

const handleSignup = async () => {
  error.value = '';
  successMessage.value = '';

  // Validate form
  if (emailError.value || passwordError.value || confirmPasswordError.value) {
    error.value = 'Please fix the errors before submitting.';
    return;
  }

  // Show journey overlay
  journeyType.value = role.value === 'mentor' ? 'mentor' : 'user';
  showOverlay.value = true;
};

const handleOverlayClose = () => {
  showOverlay.value = false;
  alertTitle.value = 'Registration Cancelled';
  alertMessage.value = 'Please complete the signup process to create your account.';
  alertType.value = 'warning';
  showAlert.value = true;
};

const handleUserJourneyComplete = async (journeyData) => {
  error.value = '';
  isLoading.value = true;

  try {
    const res = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
        role: 'User',
        journeyData,
      },
    });

    if (res?.success && res?.data?.token) {
      showOverlay.value = false;
      await navigateTo('/dashboard');
    } else {
      error.value = res?.error || 'Signup failed. Please try again.';
    }
  } catch (err) {
    console.error('User signup error:', err);

    const status = err?.status || err?.statusCode;
    const errorMessages = {
      409: 'An account with this email already exists.',
      400: 'Invalid signup information. Please check your details.',
      429: 'Too many signup attempts. Please try again later.',
      500: 'Server error. Please try again later.',
    };

    if (!navigator.onLine) {
      error.value = 'No internet connection. Please check your network and try again.';
    } else {
      error.value =
        errorMessages[status] ||
        err?.data?.error ||
        'An unexpected error occurred. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};

const handleMentorJourneyComplete = async (journeyData) => {
  error.value = '';
  isLoading.value = true;

  try {
    const res = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
        role: 'Mentor',
        journeyData,
      },
    });

    if (res?.success && res?.data?.token) {
      showOverlay.value = false;
      await navigateTo('/dashboard');
    } else {
      error.value = res?.error || 'Signup failed. Please try again.';
    }
  } catch (err) {
    console.error('Mentor signup error:', err);

    const status = err?.status || err?.statusCode;
    const errorMessages = {
      409: 'An account with this email already exists.',
      400: 'Invalid signup information. Please check your details.',
      429: 'Too many signup attempts. Please try again later.',
      500: 'Server error. Please try again later.',
    };

    if (!navigator.onLine) {
      error.value = 'No internet connection. Please check your network and try again.';
    } else {
      error.value =
        errorMessages[status] ||
        err?.data?.error ||
        'An unexpected error occurred. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
