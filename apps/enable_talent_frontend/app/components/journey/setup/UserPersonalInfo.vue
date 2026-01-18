<template>
  <div class="space-y-6">
    <!-- Current Role with Autocomplete -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Current Role
      </label>
      <ComboboxRoot
        v-model="formData.currentRole"
        v-model:search-term="searchTerm"
        v-model:open="isOpen"
        :filter-function="filterRoles"
        class="relative"
      >
        <ComboboxAnchor
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
          @click="isOpen = true"
        >
          <ComboboxInput
            placeholder="e.g., Junior Developer, Product Manager, Startup Founder"
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
            No roles found
          </ComboboxEmpty>

          <ComboboxItem
            v-for="role in COMMON_ROLES"
            :key="role"
            :value="role"
            class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-900/20 data-[highlighted]:text-blue-900 dark:data-[highlighted]:text-blue-200"
          >
            {{ role }}
          </ComboboxItem>
        </ComboboxContent>
      </ComboboxRoot>
    </div>

    <!-- Years of Experience -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Years of Experience <span class="font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
      </label>
      <select
        v-model="formData.experience"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select your experience level</option>
        <option value="0-1">0-1 years (Just starting)</option>
        <option value="1-3">1-3 years</option>
        <option value="3-5">3-5 years</option>
        <option value="5-10">5-10 years</option>
        <option value="10+">10+ years</option>
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
import { COMMON_ROLES } from '~/composables/useRoleSuggestions';

interface PersonalInfoData {
  currentRole: string;
  experience: string;
}

const props = defineProps<{
  formData: PersonalInfoData;
}>();

const searchTerm = ref('');
const isOpen = ref(false);

const filterRoles = (roles: string[], term: string) => {
  if (!term) return roles;
  const lowerTerm = term.toLowerCase();
  return roles.filter((role) => role.toLowerCase().includes(lowerTerm));
};

// Two-way bound validation error model
const validationError = defineModel<string>('validationError', { default: '' });

// Validation function
const validate = (): boolean => {
  validationError.value = '';

  if (!props.formData.currentRole.trim()) {
    validationError.value = 'Please enter your current role.';
    return false;
  }

  return true;
};

// Expose validate method to parent
defineExpose({ validate });

// Watch for changes to clear errors when user corrects input
watch(
  () => props.formData.currentRole,
  () => {
    if (validationError.value) {
      validate();
    }
  }
);
</script>
