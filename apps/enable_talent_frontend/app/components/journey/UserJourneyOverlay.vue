<template>
  <BaseJourneyOverlay
    v-model="show"
    :current-step="currentStep - 1"
    :total-steps="totalSteps"
    :step-labels="stepLabels"
    :is-loading="isLoading"
    :validation-error="validationError"
    :show-back-button="currentStep > 1"
    title="Complete Your Profile"
    subtitle="Tell us about yourself so we can find the perfect mentors for you"
    color="blue"
    complete-button-text="Find My Mentors"
    @close="handleClose"
    @next="nextStep"
    @previous="previousStep"
    @complete="completeJourney"
  >
    <template #default="{ currentStep: displayStep }">
      <div v-show="displayStep === 0" class="space-y-6">
        <UserPersonalInfo
          ref="step1Ref"
          :form-data="formData"
          v-model:validationError="validationError"
        />
      </div>

      <div v-show="displayStep === 1" class="space-y-6">
        <UserCareerGoals
          ref="step2Ref"
          :form-data="formData"
          v-model:validationError="validationError"
        />
      </div>

      <div v-show="displayStep === 2" class="space-y-6">
        <UserSkills
          ref="step3Ref"
          :form-data="formData"
          v-model:validationError="validationError"
        />
      </div>

      <div v-show="displayStep === 3" class="space-y-6">
        <UserPreferences
          ref="step4Ref"
          :form-data="formData"
          v-model:validationError="validationError"
        />
      </div>

      <div v-show="displayStep === 4" class="space-y-6">
        <UserReview
          ref="step5Ref"
          :form-data="formData"
          v-model:validationError="validationError"
        />
      </div>
    </template>

    <template #footer-actions>
      <button
        @click="skipJourney"
        :disabled="isLoading"
        class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Skip for now
      </button>
      <span class="text-gray-400">•</span>
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
import type { UserJourneyData } from '~/types/journey';

import BaseJourneyOverlay from './BaseJourneyOverlay.vue';
import UserPersonalInfo from './setup/UserPersonalInfo.vue';
import UserCareerGoals from './setup/UserCareerGoals.vue';
import UserSkills from './setup/UserSkills.vue';
import UserPreferences from './setup/UserPreferences.vue';
import UserReview from './setup/UserReview.vue';

const show = defineModel<boolean>({ required: true });

const props = defineProps<{
  onComplete: (journeyData?: UserJourneyData) => Promise<void>;
}>();

const emit = defineEmits<{
  close: [];
}>();

const currentStep = ref(1);
const validationError = ref('');
const isLoading = ref(false);

const totalSteps = 5;
const stepLabels = ['Personal Info', 'Career Goals', 'Skills & Learning', 'Preferences', 'Review'];

const formData = reactive<UserJourneyData>({
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

const step1Ref = ref();
const step2Ref = ref();
const step3Ref = ref();
const step4Ref = ref();
const step5Ref = ref();

const stepRefs = [step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];

const validateStep = (step: number): boolean => {
  const componentRef = stepRefs[step - 1];
  if (!componentRef?.value || typeof componentRef.value.validate !== 'function') return true;
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

const handleClose = () => {
  show.value = false;
  emit('close');
};

const completeJourney = async () => {
  if (!validateStep(currentStep.value)) return;
  validationError.value = '';
  show.value = false;
  await props.onComplete(formData);
  emit('close');
};

const skipJourney = async () => {
  show.value = false;
  await props.onComplete();
  emit('close');
};
</script>
