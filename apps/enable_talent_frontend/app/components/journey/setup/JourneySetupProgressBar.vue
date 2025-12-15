<template>
  <ProgressBar
    :currentStep="props.currentStep - 1"
    :totalSteps="props.totalSteps"
    :steps="props.steps"
  />
</template>

<script setup lang="ts">
import ProgressBar from '../ProgressBar.vue';

interface Props {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => ['Professional Info', 'Skills', 'Pricing', 'Availability', 'Review'],
});
</script>
