<template>
  <div class="space-y-6">
    <!-- Skills to Learn -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Skills you want to learn
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Search and select skills you'd like to develop
      </p>

      <ComboboxRoot
        v-model="selectedSkill"
        v-model:search-term="searchTerm"
        v-model:open="isOpen"
        :filter-function="filterSkills"
        class="relative mb-3"
        @update:model-value="onSkillSelected"
      >
        <ComboboxAnchor
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
          @click="isOpen = true"
        >
          <ComboboxInput
            placeholder="e.g., React, Project Management, Public Speaking"
            class="w-full bg-transparent outline-none dark:text-white placeholder-gray-400"
          />
          <ComboboxTrigger class="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <ChevronDown class="h-4 w-4" />
          </ComboboxTrigger>
        </ComboboxAnchor>

        <ComboboxContent
          class="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg"
        >
          <ComboboxEmpty class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
            No skills found
          </ComboboxEmpty>

          <ComboboxItem
            v-for="skill in COMMON_SKILLS"
            :key="skill"
            :value="skill"
            :disabled="formData.skills.includes(skill)"
            class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-900/20 data-[highlighted]:text-blue-900 dark:data-[highlighted]:text-blue-200 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
          >
            {{ skill }}
            <span v-if="formData.skills.includes(skill)" class="text-xs text-gray-400 ml-2">(added)</span>
          </ComboboxItem>
        </ComboboxContent>
      </ComboboxRoot>

      <!-- Selected Skills Tags -->
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(skill, idx) in formData.skills"
          :key="idx"
          class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
        >
          {{ skill }}
          <button
            @click="removeSkill(idx)"
            class="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
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
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
import {
  ComboboxRoot,
  ComboboxAnchor,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
} from 'reka-ui';
import { ChevronDown } from 'lucide-vue-next';
import { COMMON_SKILLS } from '~/composables/useSkillSuggestions';

interface SkillsData {
  skills: string[];
  learningStyle: string;
}

const props = defineProps<{
  formData: SkillsData;
}>();

// Two-way bound validation error model
const validationError = defineModel<string>('validationError', { default: '' });

const searchTerm = ref('');
const selectedSkill = ref('');
const isOpen = ref(false);

const filterSkills = (skills: string[], term: string) => {
  if (!term) return skills;
  const lowerTerm = term.toLowerCase();
  return skills.filter((skill) => skill.toLowerCase().includes(lowerTerm));
};

const onSkillSelected = (skill: string) => {
  if (skill && !props.formData.skills.includes(skill)) {
    props.formData.skills.push(skill);
  }
  // Reset for next selection
  nextTick(() => {
    selectedSkill.value = '';
    searchTerm.value = '';
  });
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
