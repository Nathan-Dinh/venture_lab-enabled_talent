<template>
  <div class="space-y-6">
    <!-- Professional Headline -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Professional Headline
      </label>
      <input
        v-model="formData.headline"
        type="text"
        placeholder="e.g., Senior Software Engineer & Full Stack Developer"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        What's your job title and specialty?
      </p>
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
        <option value="">Select experience level</option>
        <option value="1-2">1-2 years</option>
        <option value="3-5">3-5 years</option>
        <option value="5-10">5-10 years</option>
        <option value="10+">10+ years</option>
      </select>
    </div>

    <!-- Bio -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Bio
      </label>
      <textarea
        v-model="formData.bio"
        rows="4"
        placeholder="Tell mentees about yourself, your experience, and what you're passionate about teaching..."
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProfessionalInfoData {
  headline: string;
  experience: string;
  bio: string;
}

const props = defineProps<{
  formData: ProfessionalInfoData;
}>();

// Two-way bound validation error model
const validationError = defineModel<string>('validationError', { default: '' });

// Validation function
const validate = (): boolean => {
  validationError.value = '';

  if (!props.formData.headline.trim()) {
    validationError.value = 'Please enter your professional headline.';
    return false;
  }
  if (!props.formData.experience) {
    validationError.value = 'Please select your years of experience.';
    return false;
  }
  if (!props.formData.bio.trim()) {
    validationError.value = 'Please write a bio about yourself.';
    return false;
  }
  if (props.formData.bio.trim().length < 50) {
    validationError.value = 'Your bio should be at least 50 characters long.';
    return false;
  }

  return true;
};

// Expose validate method to parent
defineExpose({ validate });

// Watch for changes to clear errors when user corrects input
watch(
  () => [props.formData.headline, props.formData.experience, props.formData.bio],
  () => {
    if (validationError.value) {
      validate();
    }
  }
);
</script>
