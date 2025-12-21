<template>
  <div class="w-full">
    <div class="mb-4">
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full transition-all duration-300 ease-out"
          :class="progressBarClass"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <div v-if="showStepIndicators" class="flex justify-between items-start">
      <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center flex-1">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 mb-2"
          :class="[
            index < currentStep
              ? 'bg-green-600 text-white'
              : index === currentStep
                ? currentStepClass
                : 'bg-gray-300 text-gray-600',
          ]"
        >
          <CheckIcon v-if="index < currentStep" class="w-4 h-4" />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <p
          class="text-xs font-medium text-center"
          :class="[index <= currentStep ? 'text-gray-900' : 'text-gray-500']"
        >
          {{ step }}
        </p>
      </div>
    </div>

    <!-- Simple text progress -->
    <div v-else class="text-sm text-gray-600 text-center">
      Step {{ currentStep + 1 }} of {{ totalSteps }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CheckIcon } from 'lucide-vue-next';

interface Props {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
  color?: 'blue' | 'orange';
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [],
  color: 'orange',
});

const progress = computed(() => {
  return ((props.currentStep + 1) / props.totalSteps) * 100;
});

const showStepIndicators = computed(() => {
  return props.steps.length > 0;
});

const progressBarClass = computed(() => {
  return props.color === 'blue' ? 'bg-blue-600' : 'bg-orange-600';
});

const currentStepClass = computed(() => {
  return props.color === 'blue'
    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
    : 'bg-orange-600 text-white ring-2 ring-orange-300';
});
</script>
