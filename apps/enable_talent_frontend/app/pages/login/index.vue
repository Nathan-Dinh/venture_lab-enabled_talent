<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

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

      <form @submit.prevent="handleLogin" class="space-y-5">
        <FormRoleSelector v-model="role" label="Login as" />

        <FormEmailInput
          id="email"
          v-model:value="email"
          v-model:error="emailError"
          label="Email"
          placeholder="you@example.com"
          required
        />

        <FormTextInput
          id="password"
          v-model="password"
          type="password"
          label="Password"
          required
        />

        <div class="flex items-center justify-between">
          <FormCheckbox id="remember-me" v-model="rememberMe" label="Remember me" />

          <NuxtLink to="/forgot-password" class="text-sm text-blue-600 hover:underline">
            Forgot password?
          </NuxtLink>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>

        <p class="text-center text-gray-600 text-sm mt-4">
          Don't have an account?
          <NuxtLink to="/signup" class="text-blue-600 hover:underline">Sign up</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const role = ref('user');
const rememberMe = ref(false);

const isLoading = ref(false);
const error = ref('');
const successMessage = ref('');

const emailError = ref('');

const handleLogin = async () => {
  error.value = '';
  successMessage.value = '';

  // Validate fields before submission
  if (emailError.value) {
    error.value = 'Please fix the errors before submitting.';
    return;
  }

  isLoading.value = true;

  try {
    const { data: res, error: fetchError } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        role: role.value === 'mentor' ? 'Mentor' : 'User',
        rememberMe: rememberMe.value,
      },
    });

    isLoading.value = false;

    if (fetchError.value) {
      const status = fetchError.value.statusCode;

      const errorMessages = {
        401: 'Invalid email or password. Please try again.',
        429: 'Too many login attempts. Please try again later.',
        500: 'Server error. Please try again later.',
      };

      if (!navigator.onLine) {
        error.value = 'No internet connection. Please check your network.';
      } else {
        error.value = errorMessages[status] || fetchError.value.data?.error || 'Login failed. Please try again.';
      }
      return;
    }

    // Handle successful login
    if (res.value?.success && res.value?.data?.token) {
      const tokenCookie = useCookie('token', {
        maxAge: rememberMe.value ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
      });

      tokenCookie.value = res.value.data.token;
      successMessage.value = 'Login successful! Redirecting...';

      setTimeout(() => {
        navigateTo('/dashboard');
      }, 1000);
    } else {
      error.value = res.value?.error || 'Login failed. Please try again.';
    }
  } catch (err) {
    isLoading.value = false;
    console.error('Login error:', err);

    if (!navigator.onLine) {
      error.value = 'No internet connection. Please check your network and try again.';
    } else {
      error.value = 'An unexpected error occurred. Please try again.';
    }
  }
};
</script>
