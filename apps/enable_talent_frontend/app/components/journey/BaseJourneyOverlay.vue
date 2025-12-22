<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-300 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="
          show = false;
          emit('close');
        "
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 -translate-y-5 scale-95"
          leave-to-class="opacity-0 translate-y-2 scale-98"
        >
          <div
            v-if="show"
            class="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <!-- Header -->
            <div :class="headerClasses" class="px-6 py-4 relative">
              <button
                @click="
                  show = false;
                  emit('close');
                "
                :class="closeButtonClasses"
                class="absolute top-4 right-4 text-white transition-colors p-1 rounded-full hover:bg-white/10"
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
              <h2 class="text-2xl font-bold text-white pr-10">{{ title }}</h2>
              <p :class="subtitleClasses" class="text-sm mt-1">{{ subtitle }}</p>
            </div>

            <!-- Progress Bar -->
            <div v-if="showProgressBar" class="px-6 pt-4 pb-2">
              <ProgressBar
                :currentStep="currentStep"
                :totalSteps="totalSteps"
                :steps="stepLabels"
                :color="color"
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

              <!-- Content Slot -->
              <slot :currentStep="currentStep" />
            </div>

            <!-- Footer with Navigation -->
            <div
              class="border-t border-gray-200 dark:border-gray-700 px-6 bg-gray-50 dark:bg-gray-900"
            >
              <div class="mt-4 flex gap-3">
                <button
                  v-if="showBackButton"
                  @click="emit('previous')"
                  class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                >
                  Back
                </button>

                <button
                  v-if="showContinueButton"
                  @click="emit('next')"
                  :disabled="isLoading"
                  :class="primaryButtonClasses"
                  class="ml-auto px-8 py-3 text-white rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ continueButtonText }}
                </button>

                <button
                  v-else-if="showCompleteButton"
                  @click="emit('complete')"
                  :disabled="isLoading"
                  class="ml-auto px-8 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? 'Saving...' : completeButtonText }}
                </button>
              </div>

              <!-- Footer Actions -->
              <div
                v-if="showFooterActions"
                class="px-6 mb-4 text-center flex items-center justify-center gap-4"
              >
                <slot name="footer-actions" />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProgressBar from './ProgressBar.vue';

interface Props {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  title: string;
  subtitle: string;
  color?: 'blue' | 'orange';
  isLoading?: boolean;
  validationError?: string;
  continueButtonText?: string;
  completeButtonText?: string;
  showProgressBar?: boolean;
  showBackButton?: boolean;
  showFooterActions?: boolean;
}

const show = defineModel<boolean>({ required: true });

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  isLoading: false,
  validationError: '',
  continueButtonText: 'Continue',
  completeButtonText: 'Complete',
  showProgressBar: true,
  showBackButton: true,
  showFooterActions: true,
});

const emit = defineEmits<{
  close: [];
  next: [];
  previous: [];
  complete: [];
}>();

const headerClasses = computed(() =>
  props.color === 'blue'
    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
    : 'bg-gradient-to-r from-orange-500 to-orange-600'
);

const closeButtonClasses = computed(() =>
  props.color === 'blue' ? 'hover:text-blue-100' : 'hover:text-orange-100'
);

const subtitleClasses = computed(() =>
  props.color === 'blue' ? 'text-blue-100' : 'text-orange-100'
);

const primaryButtonClasses = computed(() =>
  props.color === 'blue'
    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
    : 'bg-gradient-to-r from-orange-500 to-orange-600'
);

const showContinueButton = computed(() => props.currentStep < props.totalSteps - 1);
const showCompleteButton = computed(() => props.currentStep === props.totalSteps - 1);
</script>
