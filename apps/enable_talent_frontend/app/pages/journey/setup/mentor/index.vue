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
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Complete Your Mentor Profile
        </h1>
        <p class="text-gray-600 dark:text-gray-400">Let's get you set up as a mentor.</p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <JourneySetupProgressBar
          :currentStep="currentStep"
          :totalSteps="totalSteps"
          :steps="['Professional Info', 'Skills', 'Pricing', 'Availability', 'Review']"
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

        <!-- Step 1: Professional Info -->
        <div v-show="currentStep === 1" class="space-y-6">
          <JourneySetupMentorProfessionalInfo ref="step1Ref" :form-data="formData" v-model:validationError="validationError" />
        </div>

        <!-- Step 2: Skills -->
        <div v-show="currentStep === 2" class="space-y-6">
          <JourneySetupMentorSkills ref="step2Ref" :form-data="formData" v-model:validationError="validationError" />
        </div>

        <!-- Step 3: Pricing -->
        <div v-show="currentStep === 3" class="space-y-6">
          <JourneySetupMentorPricing ref="step3Ref" :form-data="formData" v-model:validationError="validationError" />
        </div>

        <!-- Step 4: Availability -->
        <div v-show="currentStep === 4" class="space-y-6">
          <JourneySetupMentorAvailability ref="step4Ref" :form-data="formData" v-model:validationError="validationError" />
        </div>

        <!-- Step 5: Confirmation -->
        <div v-show="currentStep === 5" class="space-y-6">
          <JourneySetupMentorReview ref="step5Ref" :form-data="formData" v-model:validationError="validationError" />
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
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type JourneySetupMentorProfessionalInfo from '~/components/journey/setup/JourneySetupMentorProfessionalInfo.vue';
import type JourneySetupMentorSkills from '~/components/journey/setup/JourneySetupMentorSkills.vue';
import type JourneySetupMentorPricing from '~/components/journey/setup/JourneySetupMentorPricing.vue';
import type JourneySetupMentorAvailability from '~/components/journey/setup/JourneySetupMentorAvailability.vue';
import type JourneySetupMentorReview from '~/components/journey/setup/JourneySetupMentorReview.vue';

const currentStep = ref(1);
const totalSteps = 5;
const validationError = ref('');

const formData = reactive({
  headline: '',
  experience: '',
  bio: '',
  skills: [],
  expertise: [],
  hourlyRate: null,
  tiers: [
    { name: 'Quick Chat', duration: 30, rate: 25 },
    { name: '1-Hour Session', duration: 60, rate: 50 },
  ],
  timezone: '',
  availability: {
    monday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    wednesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    friday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    sunday: { enabled: false, startTime: '09:00', endTime: '17:00' },
  },
});

// Template refs for each step component
const step1Ref = ref<InstanceType<typeof JourneySetupMentorProfessionalInfo>>();
const step2Ref = ref<InstanceType<typeof JourneySetupMentorSkills>>();
const step3Ref = ref<InstanceType<typeof JourneySetupMentorPricing>>();
const step4Ref = ref<InstanceType<typeof JourneySetupMentorAvailability>>();
const step5Ref = ref<InstanceType<typeof JourneySetupMentorReview>>();

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
  await navigateTo('/dashboard');
};
</script>
