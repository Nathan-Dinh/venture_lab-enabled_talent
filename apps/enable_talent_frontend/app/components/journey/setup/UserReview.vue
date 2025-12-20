<template>
  <div class="space-y-6">
    <!-- Review Summary -->
    <div
      class="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-6"
    >
      <h3 class="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4">
        Review Your Profile
      </h3>

      <div class="space-y-4 text-sm">
        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Current Role</p>
          <p class="text-orange-700 dark:text-orange-300">{{ formData.currentRole }}</p>
        </div>
        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Goals</p>
          <p class="text-orange-700 dark:text-orange-300">
            {{ formData.goals.substring(0, 150)
            }}{{ formData.goals.length > 150 ? '...' : '' }}
          </p>
        </div>
        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Skills to Learn</p>
          <p class="text-orange-700 dark:text-orange-300">{{ formData.skills.join(', ') }}</p>
        </div>
        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Learning Style</p>
          <p class="text-orange-700 dark:text-orange-300">{{ formData.learningStyle }}</p>
        </div>
        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Frequency</p>
          <p class="text-orange-700 dark:text-orange-300">{{ formData.frequency }}</p>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div
      class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6"
    >
      <h3 class="font-bold text-green-900 dark:text-green-100 mb-2">You're all set!</h3>
      <p class="text-green-700 dark:text-green-300">
        Your profile is complete. We'll now match you with mentors who can help you achieve
        your goals. Let's find your perfect mentor!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ReviewData {
  currentRole: string;
  goals: string;
  skills: string[];
  learningStyle: string;
  frequency: string;
}

defineProps<{
  formData: ReviewData;
}>();

// Two-way bound validation error model (for consistency)
const validationError = defineModel<string>('validationError', { default: '' });

// Validation function - Review step has no validation requirements
const validate = (): boolean => {
  validationError.value = '';
  return true;
};

// Expose validate method to parent
defineExpose({ validate });
</script>
