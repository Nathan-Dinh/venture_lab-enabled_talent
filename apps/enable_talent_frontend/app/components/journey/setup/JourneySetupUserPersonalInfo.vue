<template>
  <div class="space-y-6">
    <!-- Current Role -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Current Role
      </label>
      <input
        v-model="formData.currentRole"
        type="text"
        placeholder="e.g., Junior Developer, Product Manager, Startup Founder"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>

    <!-- Years of Experience -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Years of Experience
      </label>
      <select
        v-model="formData.experience"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      >
        <option value="">Select your experience level</option>
        <option value="0-1">0-1 years (Just starting)</option>
        <option value="1-3">1-3 years</option>
        <option value="3-5">3-5 years</option>
        <option value="5-10">5-10 years</option>
        <option value="10+">10+ years</option>
      </select>
    </div>

    <!-- Location -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Location
      </label>
      <input
        v-model="formData.location"
        type="text"
        placeholder="City, Country"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface PersonalInfoData {
  currentRole: string;
  experience: string;
  location: string;
}

const props = defineProps<{
  formData: PersonalInfoData;
}>();

// Two-way bound validation error model
const validationError = defineModel<string>('validationError', { default: '' });

// Validation function
const validate = (): boolean => {
  validationError.value = '';

  if (!props.formData.currentRole.trim()) {
    validationError.value = 'Please enter your current role.';
    return false;
  }
  if (!props.formData.experience) {
    validationError.value = 'Please select your years of experience.';
    return false;
  }
  if (!props.formData.location.trim()) {
    validationError.value = 'Please enter your location.';
    return false;
  }

  return true;
};

// Expose validate method to parent
defineExpose({ validate });

// Watch for changes to clear errors when user corrects input
watch(
  () => [props.formData.currentRole, props.formData.experience, props.formData.location],
  () => {
    if (validationError.value) {
      validate();
    }
  }
);
</script>
