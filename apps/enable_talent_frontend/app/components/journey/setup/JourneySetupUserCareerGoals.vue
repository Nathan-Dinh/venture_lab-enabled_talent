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
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      ></textarea>
    </div>

    <!-- Areas of Interest -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Areas of Interest
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Select topics you're interested in learning about
      </p>
      <div class="space-y-2">
        <label
          class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <input
            type="checkbox"
            v-model="formData.interests"
            value="Technical Skills"
            class="w-4 h-4"
          />
          <span class="text-gray-900 dark:text-white font-medium">Technical Skills</span>
        </label>
        <label
          class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <input
            type="checkbox"
            v-model="formData.interests"
            value="Career Strategy"
            class="w-4 h-4"
          />
          <span class="text-gray-900 dark:text-white font-medium">Career Strategy</span>
        </label>
        <label
          class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <input
            type="checkbox"
            v-model="formData.interests"
            value="Leadership"
            class="w-4 h-4"
          />
          <span class="text-gray-900 dark:text-white font-medium">Leadership & Management</span>
        </label>
        <label
          class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <input
            type="checkbox"
            v-model="formData.interests"
            value="Entrepreneurship"
            class="w-4 h-4"
          />
          <span class="text-gray-900 dark:text-white font-medium">Entrepreneurship</span>
        </label>
        <label
          class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <input
            type="checkbox"
            v-model="formData.interests"
            value="Work-Life Balance"
            class="w-4 h-4"
          />
          <span class="text-gray-900 dark:text-white font-medium">Work-Life Balance</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CareerGoalsData {
  goals: string;
  interests: string[];
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
  if (props.formData.interests.length === 0) {
    validationError.value = 'Please select at least one area of interest.';
    return false;
  }

  return true;
};

// Expose validate method to parent
defineExpose({ validate });

// Watch for changes to clear errors when user corrects input
watch(
  () => [props.formData.goals, props.formData.interests.length],
  () => {
    if (validationError.value) {
      validate();
    }
  }
);
</script>
