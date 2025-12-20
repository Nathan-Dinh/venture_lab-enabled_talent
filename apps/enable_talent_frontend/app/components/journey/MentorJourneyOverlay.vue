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
            class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <!-- Header -->
            <div class="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4 relative">
              <button
                @click="handleClose"
                class="absolute top-4 right-4 text-white hover:text-orange-100 transition-colors p-1 rounded-full hover:bg-white/10"
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
              <h2 class="text-2xl font-bold text-white pr-10">Complete Your Mentor Profile</h2>
              <p class="text-orange-100 text-sm mt-1">Let's get you set up as a mentor</p>
            </div>

            <!-- Progress Bar -->
            <div class="px-6 pt-4 pb-2">
              <ProgressBar
                :currentStep="currentStep"
                :totalSteps="totalSteps"
                :steps="stepLabels"
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

              <!-- Mentor Journey Steps -->
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
                  class="ml-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>

                <button
                  v-else
                  @click="completeJourney"
                  :disabled="isLoading"
                  class="ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? 'Saving...' : 'Complete Setup' }}
                </button>
              </div>

              <!-- Cancel link -->
              <div class="mt-3 text-center">
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
import type { MentorJourneyData } from '~/types/journey';

// Import journey components
import ProgressBar from './setup/ProgressBar.vue';
import MentorProfessionalInfo from './setup/MentorProfessionalInfo.vue';
import MentorSkills from './setup/MentorSkills.vue';
import MentorPricing from './setup/MentorPricing.vue';
import MentorAvailability from './setup/MentorAvailability.vue';
import MentorReview from './setup/MentorReview.vue';

// Props
const props = defineProps<{
  show: boolean;
  onComplete: (journeyData: MentorJourneyData) => Promise<void>;
}>();

// Emits
const emit = defineEmits<{
  close: [];
}>();

// Reactive state
const currentStep = ref(1);
const validationError = ref('');
const isLoading = ref(false);

// Computed properties
const showOverlay = computed(() => props.show);
const totalSteps = 5;
const stepLabels = ['Professional Info', 'Skills', 'Pricing', 'Availability', 'Review'];

// Form data
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

// Template refs for validation
const step1Ref = ref();
const step2Ref = ref();
const step3Ref = ref();
const step4Ref = ref();
const step5Ref = ref();

// Validation
const validateStep = (step: number): boolean => {
  const refs = [step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];
  const componentRef = refs[step - 1];

  if (!componentRef?.value) return true;

  // Call the component's validate method if it exists
  if (typeof componentRef.value.validate === 'function') {
    return componentRef.value.validate();
  }

  return true;
};

// Navigation
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

// Close handling
const handleClose = () => {
  emit('close');
};

const handleBackdropClick = () => {
  // Allow closing by clicking backdrop
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

// Prevent accidental navigation away
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (currentStep.value > 1) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
};

// Watch for overlay changes
watch(showOverlay, (newValue) => {
  console.log('Mentor overlay visibility changed:', newValue);
});

// Lifecycle
onMounted(() => {
  console.log('MentorJourneyOverlay mounted');
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
