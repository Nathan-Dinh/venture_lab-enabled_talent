<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="showOverlay"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="handleBackdropClick"
      >
        <Transition name="modal">
          <div
            v-if="showOverlay"
            class="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <!-- Header -->
            <div class="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4 relative">
              <button
                @click="handleClose"
                class="absolute top-4 right-4 text-white hover:text-blue-100 transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 class="text-2xl font-bold text-white pr-10">Complete Your Profile</h2>
              <p class="text-blue-100 text-sm mt-1">
                Tell us about yourself so we can find the perfect mentors for you
              </p>
            </div>

            <!-- Progress Bar -->
            <div class="px-6 pt-4 pb-2">
              <ProgressBar
                :currentStep="currentStep"
                :totalSteps="totalSteps"
                :steps="stepLabels"
                color="blue"
              />
            </div>

            <!-- Content Area (Scrollable) -->
            <div class="flex-1 overflow-y-auto px-6 py-4">
              <!-- Validation Error Message -->
              <div
                v-if="validationError"
                class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg"
              >
                {{ validationError }}
              </div>

              <!-- User Journey Steps -->
              <div v-show="currentStep === 1" class="space-y-6">
                <UserPersonalInfo
                  ref="step1Ref"
                  :form-data="formData"
                  v-model:validationError="validationError"
                />
              </div>

              <div v-show="currentStep === 2" class="space-y-6">
                <UserCareerGoals
                  ref="step2Ref"
                  :form-data="formData"
                  v-model:validationError="validationError"
                />
              </div>

              <div v-show="currentStep === 3" class="space-y-6">
                <UserSkills
                  ref="step3Ref"
                  :form-data="formData"
                  v-model:validationError="validationError"
                />
              </div>

              <div v-show="currentStep === 4" class="space-y-6">
                <UserPreferences
                  ref="step4Ref"
                  :form-data="formData"
                  v-model:validationError="validationError"
                />
              </div>

              <div v-show="currentStep === 5" class="space-y-6">
                <UserReview
                  ref="step5Ref"
                  :form-data="formData"
                  v-model:validationError="validationError"
                />
              </div>
            </div>

            <!-- Footer with Navigation -->
            <div
              class="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900"
            >
              <div class="flex gap-3">
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
                  :disabled="isLoading"
                  class="ml-auto px-8 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>

                <button
                  v-else
                  @click="completeJourney"
                  :disabled="isLoading"
                  class="ml-auto px-8 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? 'Saving...' : 'Find My Mentors' }}
                </button>
              </div>

              <!-- Skip for now / Cancel links -->
              <div class="mt-3 text-center flex items-center justify-center gap-4">
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
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import type { UserJourneyData } from '~/types/journey';

import ProgressBar from './setup/ProgressBar.vue';
import UserPersonalInfo from './setup/UserPersonalInfo.vue';
import UserCareerGoals from './setup/UserCareerGoals.vue';
import UserSkills from './setup/UserSkills.vue';
import UserPreferences from './setup/UserPreferences.vue';
import UserReview from './setup/UserReview.vue';

const props = defineProps<{
  show: boolean;
  onComplete: (journeyData: UserJourneyData) => Promise<void>;
}>();

const emit = defineEmits<{
  close: [];
}>();

const currentStep = ref(1);
const validationError = ref('');
const isLoading = ref(false);

const showOverlay = computed(() => props.show);
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

const validateStep = (step: number): boolean => {
  const refs = [step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];
  const componentRef = refs[step - 1];

  if (!componentRef?.value) return true;

  if (typeof componentRef.value.validate === 'function') return componentRef.value.validate();

  return true;
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
  emit('close');
};

const handleBackdropClick = () => {
  handleClose();
};

// Journey completion
const completeJourney = async () => {
  if (!validateStep(currentStep.value)) return;

  isLoading.value = true;
  validationError.value = '';

  try {
    await props.onComplete(formData);
    emit('close');
  } catch (err) {
    if (!navigator.onLine) {
      validationError.value = 'No internet connection. Please check your network and try again.';
    } else {
      validationError.value = 'An unexpected error occurred. Please try again.';
    }
    isLoading.value = false;
  }
};

// Skip journey
const skipJourney = async () => {
  if (isLoading.value) return;
  emit('close');
  await navigateTo('/dashboard');
};

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (currentStep.value > 1) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
};

// Watch for overlay changes
watch(showOverlay, (newValue) => {
  console.log('User overlay visibility changed:', newValue);
});

// Lifecycle
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<style scoped>
/* Overlay transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Modal transitions */
.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
