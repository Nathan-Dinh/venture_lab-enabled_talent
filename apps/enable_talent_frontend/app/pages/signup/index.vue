<template>
  <ClientOnly>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <JourneyUserJourneyOverlay
        v-if="role === 'user'"
        v-model="showOverlay"
        :onComplete="handleUserJourneyComplete"
        @close="handleOverlayClose"
      />

      <JourneyMentorJourneyOverlay
        v-else-if="role === 'mentor'"
        v-model="showOverlay"
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

        <form @submit.prevent="handleSignup" class="space-y-5">
          <FormRoleSelector v-model="role" label="Register as" />

          <FormTextInput
            id="firstName"
            v-model="firstName"
            type="text"
            label="First Name"
            placeholder="Jane"
            required
          />

          <FormTextInput
            id="lastName"
            v-model="lastName"
            type="text"
            label="Last Name"
            placeholder="Doe"
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
            :disabled="isLoading || hasFormErrors"
            :class="buttonClasses"
            class="w-full text-white py-2.5 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ buttonText }}
          </button>

          <p class="text-center text-gray-600 text-sm mt-4">
            Already have an account?
            <NuxtLink to="/login" class="text-orange-600 hover:underline">Login</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import type {
  UserSignupRequest,
  MentorSignupRequest,
  UserJourneyData,
  MentorJourneyData,
} from '~/types/models';

import { ERROR_MESSAGES } from '~/constants';

import { useAlert } from '~/composables/useAlert';

definePageMeta({
  ssr: false,
});

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('user');

const isLoading = ref(false);
const error = ref('');

const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

const showOverlay = ref(false);
const hasFormErrors = computed(
  () => !!emailError.value || !!passwordError.value || !!confirmPasswordError.value
);

const buttonClasses = computed(() =>
  role.value === 'mentor'
    ? 'bg-orange-500 hover:bg-orange-600'
    : 'bg-blue-600 hover:bg-blue-700'
);

const buttonText = computed(() => {
  if (isLoading.value) return 'Creating Account...';
  return role.value === 'mentor' ? 'Sign Up as Mentor' : 'Sign Up as User';
});

const validatePasswordMatch = () => {
  confirmPasswordError.value =
    confirmPassword.value && password.value !== confirmPassword.value
      ? 'Passwords do not match'
      : '';
};

watch([password, confirmPassword], validatePasswordMatch);

const handleSignup = () => {
  error.value = '';
  if (hasFormErrors.value) {
    error.value = 'Please fix the errors before submitting.';
    return;
  }
  showOverlay.value = true;
};

const handleOverlayClose = () => {
  showOverlay.value = false;
  useAlert().warning('Please complete the signup process to create your account.', {
    title: 'Registration Cancelled',
  });
};

const handleError = (err: Record<string, any> | null, roleType: string) => {
  console.error(`${roleType} signup error:`, err);

  const status = err?.status || err?.statusCode;

  if (!navigator.onLine) {
    error.value = 'No internet connection. Please check your network and try again.';
  } else {
    error.value =
      ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] ||
      err?.data?.error ||
      'An unexpected error occurred. Please try again.';
  }
};

const handleUserJourneyComplete = async (journeyData?: UserJourneyData) => {
  error.value = '';
  isLoading.value = true;

  try {
    const signupPayload: UserSignupRequest = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      ...(journeyData ? { journeyData } : {}),
    };

    const { data, error: signupError } = await useCoreAuth().userSignup(signupPayload);

    if (signupError) {
      handleError(signupError, 'user');
      return;
    }

    showOverlay.value = false;
    useAlert().success(data?.message || 'Account created successfully!', {
      title: 'Success',
      autoDismiss: false,
    });

    setTimeout(() => {
      navigateTo('/login');
    }, 2000);
  } catch (err: any) {
    handleError(err, 'user');
  } finally {
    isLoading.value = false;
  }
};

const handleMentorJourneyComplete = async (journeyData?: MentorJourneyData) => {
  error.value = '';
  isLoading.value = true;

  try {
    const signupPayload: MentorSignupRequest = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      ...(journeyData ? { journeyData } : {}),
    };

    const { data, error: signupError } = await useCoreAuth().mentorSignup(signupPayload);

    if (signupError) {
      handleError(signupError, 'mentor');
      return;
    }

    showOverlay.value = false;
    useAlert().success(data?.message || 'Mentor account created successfully!', {
      title: 'Success',
      autoDismiss: false,
    });

    setTimeout(() => {
      navigateTo('/login');
    }, 2000);
  } catch (err: any) {
    handleError(err, 'mentor');
  } finally {
    isLoading.value = false;
  }
};
</script>
