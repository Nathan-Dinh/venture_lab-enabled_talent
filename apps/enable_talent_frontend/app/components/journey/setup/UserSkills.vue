<template>
  <div class="space-y-6">
    <!-- Skills to Learn -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Skills you want to learn
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Add skills you'd like to develop (press Enter to add)
      </p>
      <div class="flex gap-2 mb-3">
        <input
          v-model="skillInput"
          @keypress.enter="addSkill"
          type="text"
          placeholder="e.g., React, Project Management, Public Speaking"
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          @click="addSkill"
          class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
        >
          Add
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(skill, idx) in formData.skills"
          :key="idx"
          class="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm flex items-center gap-2"
        >
          {{ skill }}
          <button
            @click="removeSkill(idx)"
            class="text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-100"
          >
            ✕
          </button>
        </span>
      </div>
    </div>

    <!-- Learning Style -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Learning Style
      </label>
      <select
        v-model="formData.learningStyle"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      >
        <option value="">How do you prefer to learn?</option>
        <option value="1-on-1">One-on-one mentoring</option>
        <option value="structured">Structured courses</option>
        <option value="discussion">Discussion & feedback</option>
        <option value="practical">Hands-on projects</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface SkillsData {
  skills: string[];
  learningStyle: string;
}

const props = defineProps<{
  formData: SkillsData;
}>();

// Two-way bound validation error model
const validationError = defineModel<string>('validationError', { default: '' });

const skillInput = ref('');

const addSkill = () => {
  if (skillInput.value.trim() && !props.formData.skills.includes(skillInput.value.trim())) {
    props.formData.skills.push(skillInput.value.trim());
    skillInput.value = '';
  }
};

const removeSkill = (index: number) => {
  props.formData.skills.splice(index, 1);
};

// Validation function
const validate = (): boolean => {
  validationError.value = '';

  if (props.formData.skills.length === 0) {
    validationError.value = 'Please add at least one skill you want to learn.';
    return false;
  }
  if (!props.formData.learningStyle) {
    validationError.value = 'Please select your preferred learning style.';
    return false;
  }

  return true;
};

// Expose validate method to parent
defineExpose({ validate });

// Watch for changes to clear errors when user corrects input
watch(
  () => [props.formData.skills.length, props.formData.learningStyle],
  () => {
    if (validationError.value) {
      validate();
    }
  }
);
</script>
