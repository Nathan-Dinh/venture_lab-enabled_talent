<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

      <!-- Error message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Role Selector -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Login as</label>
          <div class="flex space-x-3">
            <label
              class="flex-1 cursor-pointer border rounded-lg p-2 text-center transition hover:bg-blue-50"
              :class="
                role === 'user'
                  ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold'
                  : 'border-gray-300'
              "
            >
              <input type="radio" value="user" v-model="role" class="hidden" />
              User
            </label>
            <label
              class="flex-1 cursor-pointer border rounded-lg p-2 text-center transition hover:bg-blue-50"
              :class="
                role === 'mentor'
                  ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold'
                  : 'border-gray-300'
              "
            >
              <input type="radio" value="mentor" v-model="role" class="hidden" />
              Mentor
            </label>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="you@example.com"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>

        <p class="text-center text-gray-600 text-sm mt-4">
          Don’t have an account?
          <NuxtLink to="/signup" class="text-blue-600 hover:underline">Sign up</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

/**
 * Login Page Component
 *
 * Handles user authentication with email, password, and role selection.
 *
 * Backend API Call:
 * - Endpoint: POST /api/auth/login
 * - Expected Request Body:
 *   {
 *     email: string,
 *     password: string,
 *     role: 'User' | 'Mentor'
 *   }
 * - Expected Response:
 *   {
 *     success: boolean,
 *     data: {
 *       token: string,
 *       user: { ... }
 *     },
 *     error?: string
 *   }
 *
 * TODO: Add email validation before submission
 * TODO: Add password strength indicator
 * TODO: Implement "Remember Me" functionality
 * TODO: Add "Forgot Password" link
 */

const { $apiRequestHandler } = useNuxtApp();

const email = ref('');
const password = ref('');
const role = ref('user'); // Default selection

const isLoading = ref(false);
const error = ref('');

/**
 * Handles login form submission
 *
 * Flow:
 * 1. Send credentials to backend /api/auth/login
 * 2. Backend validates credentials
 * 3. Backend returns JWT token on success
 * 4. Store token in cookie for subsequent requests
 * 5. Redirect to dashboard
 *
 * TODO: Add validation before API call
 * TODO: Handle network errors gracefully
 * TODO: Add success message before redirect
 */
const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';

  // Call login API endpoint
  // BUG FIX: Added .base() to properly call the API handler
  const res = await $apiRequestHandler('/api/auth/login', {
    body: {
      email: email.value,
      password: password.value,
      // Backend expects capitalized role ('User' or 'Mentor')
      role: role.value === 'mentor' ? 'Mentor' : 'User',
    },
  }).base().post();

  isLoading.value = false;

  // Handle API error response
  if (res.error) {
    error.value = res.error.data?.error || 'Login failed. Please try again.';
    return;
  }

  // Handle successful login
  if (res.data?.success && res.data?.data?.token) {
    // Store JWT token in cookie for authentication
    const tokenCookie = useCookie('token');
    tokenCookie.value = res.data.data.token;

    // Redirect to dashboard
    navigateTo('/dashboard');
  } else {
    // Handle unexpected response format
    error.value = res.data?.error || 'Login failed. Please try again.';
  }
};
</script>
