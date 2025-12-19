<template>
  <div
    class="min-h-screen bg-linear-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4"
  >
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          to="/signup"
          class="inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mb-4"
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
        <!-- Validation Error Message -->
        <div
          v-if="validationError"
          class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg"
        >
          {{ validationError }}
        </div>

        <!-- Step 1: Personal Info -->
        <div v-show="currentStep === 1" class="space-y-6">
          <JourneySetupUserPersonalInfo
            ref="step1Ref"
            :form-data="formData"
            v-model:validationError="validationError"
          />
        </div>

        <!-- Step 2: Career Goals -->
        <div v-show="currentStep === 2" class="space-y-6">
          <JourneySetupUserCareerGoals
            ref="step2Ref"
            :form-data="formData"
            v-model:validationError="validationError"
          />
        </div>

        <!-- Step 3: Skills & Learning -->
        <div v-show="currentStep === 3" class="space-y-6">
          <JourneySetupUserSkills
            ref="step3Ref"
            :form-data="formData"
            v-model:validationError="validationError"
          />
        </div>

        <!-- Step 4: Preferences -->
        <div v-show="currentStep === 4" class="space-y-6">
          <JourneySetupUserPreferences
            ref="step4Ref"
            :form-data="formData"
            v-model:validationError="validationError"
          />
        </div>

        <!-- Step 5: Confirmation -->
        <div v-show="currentStep === 5" class="space-y-6">
          <JourneySetupUserReview
            ref="step5Ref"
            :form-data="formData"
            v-model:validationError="validationError"
          />
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
            class="ml-auto px-8 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            Continue
          </button>

          <button
            v-else
            @click="completeSetup"
            class="ml-auto px-8 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition font-medium"
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
import type JourneySetupUserPersonalInfo from '~/components/journey/setup/JourneySetupUserPersonalInfo.vue';
import type JourneySetupUserCareerGoals from '~/components/journey/setup/JourneySetupUserCareerGoals.vue';
import type JourneySetupUserSkills from '~/components/journey/setup/JourneySetupUserSkills.vue';
import type JourneySetupUserPreferences from '~/components/journey/setup/JourneySetupUserPreferences.vue';
import type JourneySetupUserReview from '~/components/journey/setup/JourneySetupUserReview.vue';

const currentStep = ref(1);
const totalSteps = 5;
const validationError = ref('');

const formData = reactive({
  currentRole: '',
  experience: '',
  location: '',
  goals: '',
  interests: [],
  skills: [],
  learningStyle: '',
  timezone: '',
  budget: '',
  frequency: '',
});

// Template refs for each step component
const step1Ref = ref<InstanceType<typeof JourneySetupUserPersonalInfo>>();
const step2Ref = ref<InstanceType<typeof JourneySetupUserCareerGoals>>();
const step3Ref = ref<InstanceType<typeof JourneySetupUserSkills>>();
const step4Ref = ref<InstanceType<typeof JourneySetupUserPreferences>>();
const step5Ref = ref<InstanceType<typeof JourneySetupUserReview>>();

// Simplified validation - delegates to component
const validateStep = (step: number): boolean => {
  const refs = [step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];
  const componentRef = refs[step - 1];

  if (!componentRef?.value) return true;
  return componentRef.value.validate();
};

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < totalSteps) {
      currentStep.value++;
      validationError.value = '';
    }
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    validationError.value = '';
  }
};

const completeSetup = async () => {
  // TODO: Save user profile data to backend
  // Redirect to dashboard
  await navigateTo('/dashboard');
};
</script>
