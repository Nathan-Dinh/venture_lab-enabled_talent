<template>
  <div class="space-y-6">
    <!-- Career Goals -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        What are your career goals?
      </label>
      <textarea
        v-model="formData.goals"
        rows="4"
        placeholder="Tell us what you want to achieve in your career. What skills do you want to develop?"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CareerGoalsData {
  goals: string;
}

const props = defineProps<{
  formData: CareerGoalsData;
}>();

// Two-way bound validation error model
const validationError = defineModel<string>('validationError', { default: '' });

// Validation function
const validate = (): boolean => {
  validationError.value = '';

  if (!props.formData.goals.trim()) {
    validationError.value = 'Please describe your career goals.';
    return false;
  }
  if (props.formData.goals.trim().length < 30) {
    validationError.value = 'Please provide more detail about your goals (at least 30 characters).';
    return false;
  }

  return true;
};

// Expose validate method to parent
defineExpose({ validate });

// Watch for changes to clear errors when user corrects input
watch(
  () => props.formData.goals,
  () => {
    if (validationError.value) {
      validate();
    }
  }
);
</script>
