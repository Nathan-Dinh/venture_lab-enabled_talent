<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
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
          class="w-full bg-orange-600 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
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
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('user');

const isLoading = ref(false);
const error = ref('');
const successMessage = ref('');

const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// Watch for password confirmation match
watch(confirmPassword, (newValue) => {
  if (newValue && password.value && newValue !== password.value) {
    confirmPasswordError.value = 'Passwords do not match';
  } else {
    confirmPasswordError.value = '';
  }
});

watch(password, (newValue) => {
  if (confirmPassword.value && newValue !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match';
  } else if (confirmPassword.value) {
    confirmPasswordError.value = '';
  }
});

const handleSignup = async () => {
  error.value = '';
  successMessage.value = '';

  // Validate fields before submission
  if (emailError.value || passwordError.value || confirmPasswordError.value) {
    error.value = 'Please fix the errors before submitting.';
    return;
  }

  // Check if passwords match
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match';
    error.value = 'Please fix the errors before submitting.';
    return;
  }

  isLoading.value = true;

  try {
    const { data: res, error: fetchError } = await useFetch('/api/auth/signup', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
        role: role.value === 'mentor' ? 'Mentor' : 'User',
      },
    });

    isLoading.value = false;

    if (fetchError.value) {
      const status = fetchError.value.statusCode;

      const errorMessages = {
        409: 'An account with this email already exists.',
        400: 'Invalid signup information. Please check your details.',
        429: 'Too many signup attempts. Please try again later.',
        500: 'Server error. Please try again later.',
      };

      if (!navigator.onLine) {
        error.value = 'No internet connection. Please check your network.';
      } else {
        error.value = errorMessages[status] || fetchError.value.data?.error || 'Signup failed. Please try again.';
      }
      return;
    }

    // Handle successful signup
    if (res.value?.success && res.value?.data?.token) {
      const tokenCookie = useCookie('token', {
        maxAge: 60 * 60 * 24, // 1 day
      });

      tokenCookie.value = res.value.data.token;
      successMessage.value = 'Account created successfully! Redirecting...';

      setTimeout(() => {
        navigateTo('/dashboard');
      }, 1000);
    } else {
      error.value = res.value?.error || 'Signup failed. Please try again.';
    }
  } catch (err) {
    isLoading.value = false;
    console.error('Signup error:', err);

    if (!navigator.onLine) {
      error.value = 'No internet connection. Please check your network and try again.';
    } else {
      error.value = 'An unexpected error occurred. Please try again.';
    }
  }
};
</script>
