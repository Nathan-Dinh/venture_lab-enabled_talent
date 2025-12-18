<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-2">Forgot Password</h2>
      <p class="text-center text-gray-600 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

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

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <FormTextInput
          id="email"
          v-model="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
          :error="emailError"
          @blur="validateEmailField"
        />

        <button
          type="submit"
          :disabled="isLoading || emailSent"
          class="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Sending...' : emailSent ? 'Email Sent' : 'Send Reset Link' }}
        </button>

        <div class="text-center">
          <NuxtLink to="/login" class="text-sm text-blue-600 hover:underline">
            Back to Login
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useEmailValidation } from '@/composables/useFormValidation';

/**
 * Forgot Password Page Component
 *
 * Allows users to request a password reset link via email.
 *
 * Backend API Call:
 * - Endpoint: POST /api/auth/forgot-password
 * - Expected Request Body:
 *   {
 *     email: string
 *   }
 * - Expected Response:
 *   {
 *     success: boolean,
 *     message: string,
 *     error?: string
 *   }
 *
 * Flow:
 * 1. User enters email address
 * 2. Validate email format
 * 3. Send request to backend
 * 4. Backend sends password reset email (if account exists)
 * 5. Show success message (always, for security - don't reveal if email exists)
 * 6. User receives email with reset link
 *
 * Security Notes:
 * - Always show success message, even if email doesn't exist (prevents email enumeration)
 * - Reset tokens should expire after a short time (e.g., 1 hour)
 * - Rate limit requests to prevent abuse
 */

const { $apiRequestHandler } = useNuxtApp();
const { validateEmail } = useEmailValidation();

const email = ref('');
const isLoading = ref(false);
const error = ref('');
const successMessage = ref('');
const emailError = ref('');
const emailSent = ref(false);

/**
 * Validates email field on blur
 */
const validateEmailField = () => {
  const result = validateEmail(email.value);
  emailError.value = result.isValid ? '' : result.error;
};

/**
 * Handles forgot password form submission
 */
const handleSubmit = async () => {
  error.value = '';
  successMessage.value = '';

  // Validate email before submission
  validateEmailField();

  if (emailError.value) {
    error.value = 'Please enter a valid email address.';
    return;
  }

  isLoading.value = true;

  try {
    // Call forgot password API endpoint
    const res = await $apiRequestHandler('/api/auth/forgot-password', {
      body: {
        email: email.value,
      },
    })
      .base()
      .post();

    isLoading.value = false;

    // Handle errors
    if (res.error) {
      const status = res.error.statusCode;

      if (status === 429) {
        error.value = 'Too many requests. Please try again later.';
      } else if (status === 500) {
        error.value = 'Server error. Please try again later.';
      } else if (!navigator.onLine) {
        error.value = 'No internet connection. Please check your network.';
      } else {
        error.value = res.error.data?.error || 'Failed to send reset link. Please try again.';
      }
      return;
    }

    // Show success message (always show for security, even if email doesn't exist)
    if (res.data?.success) {
      successMessage.value = 'If an account exists with this email, you will receive a password reset link shortly.';
      emailSent.value = true;
      email.value = ''; // Clear the email field
    } else {
      error.value = res.data?.error || 'Failed to send reset link. Please try again.';
    }
  } catch (err) {
    isLoading.value = false;
    console.error('Forgot password error:', err);

    if (!navigator.onLine) {
      error.value = 'No internet connection. Please check your network and try again.';
    } else {
      error.value = 'An unexpected error occurred. Please try again.';
    }
  }
};
</script>
