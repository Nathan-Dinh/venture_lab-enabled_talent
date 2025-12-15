<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4"
  >
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          to="/signup"
          class="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
        >
          ← Back to Signup
        </NuxtLink>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Profile</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Tell us about yourself so we can find the perfect mentors for you.
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <JourneySetupProgressBar
          :currentStep="currentStep"
          :totalSteps="totalSteps"
          :steps="['Personal Info', 'Career Goals', 'Skills & Learning', 'Preferences', 'Review']"
        />
      </div>

      <!-- Steps Container -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <!-- Step 1: Personal Info -->
        <div v-show="currentStep === 1" class="space-y-6">
          <JourneySetupUserPersonalInfo :form-data="formData" />
        </div>

        <!-- Step 2: Career Goals -->
        <div v-show="currentStep === 2" class="space-y-6">
          <JourneySetupUserCareerGoals :form-data="formData" />
        </div>

        <!-- Step 3: Skills & Learning -->
        <div v-show="currentStep === 3" class="space-y-6">
          <JourneySetupUserSkills :form-data="formData" />
        </div>

        <!-- Step 4: Preferences -->
        <div v-show="currentStep === 4" class="space-y-6">
          <JourneySetupUserPreferences :form-data="formData" />
        </div>

        <!-- Step 5: Confirmation -->
        <div v-show="currentStep === 5" class="space-y-6">
          <JourneySetupUserReview :form-data="formData" />
        </div>

        <!-- Navigation Buttons -->
        <div class="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            v-if="currentStep > 1"
            @click="previousStep"
            class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
          >
            Back
          </button>

          <button
            v-if="currentStep < totalSteps"
            @click="nextStep"
            class="ml-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            Continue
          </button>

          <button
            v-else
            @click="completeSetup"
            class="ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            Find My Mentors
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentStep = ref(1);
const totalSteps = 5;

const formData = reactive({
  currentRole: '',
  experience: '',
  location: '',
  goals: '',
  interests: [] as string[],
  skills: [] as string[],
  learningStyle: '',
  timezone: '',
  budget: '',
  frequency: '',
});

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const completeSetup = async () => {
  // TODO: Save user profile data to backend
  // Redirect to dashboard
  await router.push('/dashboard');
};
</script>
