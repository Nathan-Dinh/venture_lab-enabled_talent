<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <FormEmailInput
          id="email"
          v-model:value="email"
          v-model:error="emailError"
          label="Email"
          placeholder="you@example.com"
          required
        />

        <FormTextInput id="password" v-model="password" type="password" label="Password" required />

        <div class="flex items-center justify-between">
          <FormCheckbox id="remember-me" v-model="rememberMe" label="Remember me" />

          <NuxtLink to="/forgot-password" class="text-sm text-orange-600 hover:underline">
            Forgot password?
          </NuxtLink>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-orange-600 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>

        <p class="text-center text-gray-600 text-sm mt-4">
          Don't have an account?
          <NuxtLink to="/signup" class="text-orange-600 hover:underline">Sign up</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginRequest } from '~/types';

const route = useRoute();

const email = ref<string>('');
const password = ref<string>('');
const rememberMe = ref(false);

const isLoading = ref(false);
const emailError = ref('');

const { login } = useSupabaseAuth();
const alert = useAlert();

onMounted(() => {
  if (route.query.registered === 'true') {
    alert.success('Account created successfully! Please login to continue.');
  }
});

const handleLogin = async () => {
  if (emailError.value) {
    alert.error('Please fix the errors before submitting.');
    return;
  }

  isLoading.value = true;

  try {
    const loginDto: LoginRequest = {
      email: email.value,
      password: password.value,
    };

    const { data, error: loginError } = await login(loginDto);

    isLoading.value = false;

    if (loginError) {
      if (!navigator.onLine) {
        alert.error('No internet connection. Please check your network.');
      } else {
        alert.error(loginError.message || 'Login failed. Please try again.');
      }
      return;
    }

    if (data) {
      alert.success('Login successful! Redirecting...');
      setTimeout(() => {
        navigateTo('/dashboard');
      }, 1000);
    } else {
      alert.error('Login failed. Please try again.');
    }
  } catch (err) {
    isLoading.value = false;
    console.error('Login error:', err);

    if (!navigator.onLine) {
      alert.error('No internet connection. Please check your network and try again.');
    } else {
      alert.error('An unexpected error occurred. Please try again.');
    }
  }
};
</script>
