<template>
  <BaseJourneyOverlay
    v-model="show"
    :current-step="currentStep > 0 ? currentStep - 1 : 0"
    :total-steps="currentStep > 0 ? totalSteps - 1 : totalSteps"
    :step-labels="currentStep > 0 ? stepLabelsWithoutWelcome : stepLabels"
    :is-loading="isLoading"
    :validation-error="validationError"
    :show-back-button="currentStep > 0"
    :show-progress-bar="currentStep > 0"
    :continue-button-text="currentStep === 0 ? 'Get Started' : 'Continue'"
    title="Complete Your Mentor Profile"
    subtitle="Let's get you set up as a mentor"
    color="orange"
    complete-button-text="Complete Setup"
    @close="handleClose"
    @next="nextStep"
    @previous="previousStep"
    @complete="completeJourney"
  >
    <template #default>
      <div v-show="currentStep === 0" class="space-y-6">
        <MentorWelcome ref="step0Ref" />
      </div>

      <div v-show="currentStep === 1" class="space-y-6">
        <MentorProfessionalInfo
          ref="step1Ref"
          :form-data="formData"
          v-model:validationError="validationError"
        />
      </div>

      <div v-show="currentStep === 2" class="space-y-6">
        <MentorSkills
          ref="step2Ref"
          :form-data="formData"
          v-model:validationError="validationError"
        />
      </div>

      <div v-show="currentStep === 3" class="space-y-6">
        <MentorPricing
          ref="step3Ref"
          :form-data="formData"
          v-model:validationError="validationError"
        />
      </div>

      <div v-show="currentStep === 4" class="space-y-6">
        <MentorAvailability
          ref="step4Ref"
          :form-data="formData"
          v-model:validationError="validationError"
        />
      </div>

      <div v-show="currentStep === 5" class="space-y-6">
        <MentorReview
          ref="step5Ref"
          :form-data="formData"
          v-model:validationError="validationError"
        />
      </div>
    </template>

    <template #footer-actions>
      <button
        @click="handleClose"
        :disabled="isLoading"
        class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
    </template>
  </BaseJourneyOverlay>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import type { MentorJourneyData } from '~/types/journey';

import BaseJourneyOverlay from './BaseJourneyOverlay.vue';
import MentorWelcome from './setup/MentorWelcome.vue';
import MentorProfessionalInfo from './setup/MentorProfessionalInfo.vue';
import MentorSkills from './setup/MentorSkills.vue';
import MentorPricing from './setup/MentorPricing.vue';
import MentorAvailability from './setup/MentorAvailability.vue';
import MentorReview from './setup/MentorReview.vue';

const show = defineModel<boolean>({ required: true });

const props = defineProps<{
  onComplete: (journeyData: MentorJourneyData) => Promise<void>;
}>();

const emit = defineEmits<{
  close: [];
}>();

const currentStep = ref(0);
const validationError = ref('');
const isLoading = ref(false);

const totalSteps = 6;
const stepLabels = ['Welcome', 'Professional Info', 'Skills', 'Pricing', 'Availability', 'Review'];
const stepLabelsWithoutWelcome = computed(() => stepLabels.slice(1));

const formData = reactive<MentorJourneyData>({
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

const step0Ref = ref();
const step1Ref = ref();
const step2Ref = ref();
const step3Ref = ref();
const step4Ref = ref();
const step5Ref = ref();

const stepRefs = [step0Ref, step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];

const validateStep = (step: number): boolean => {
  const componentRef = stepRefs[step];

  if (!componentRef?.value || typeof componentRef.value.validate !== 'function') {
    return true;
  }

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
  if (currentStep.value > 0) {
    currentStep.value--;
    validationError.value = '';
  }
};

const handleClose = () => {
  show.value = false;
  emit('close');
};

const completeJourney = async () => {
  if (!validateStep(currentStep.value)) return;

  isLoading.value = true;
  validationError.value = '';

  try {
    await props.onComplete(formData);
    show.value = false;
    emit('close');
  } catch (err) {
    validationError.value = !navigator.onLine
      ? 'No internet connection. Please check your network and try again.'
      : 'An unexpected error occurred. Please try again.';
    isLoading.value = false;
  }
};

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (currentStep.value > 0) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
};

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>
