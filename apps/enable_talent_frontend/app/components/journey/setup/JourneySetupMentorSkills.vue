<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Key Skills
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Add skills you can mentor in (press Enter to add)
      </p>
      <div class="flex gap-2 mb-3">
        <input
          v-model="skillInput"
          @keypress.enter="addSkill"
          type="text"
          placeholder="e.g., React, TypeScript, Node.js"
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
            
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface SkillsData {
  skills: string[];
}

const props = defineProps<{
  formData: SkillsData;
}>();

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
</script>