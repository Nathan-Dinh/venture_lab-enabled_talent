<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div class="flex space-x-3 relative">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex-1 cursor-pointer border rounded-lg p-4 text-center transition-all duration-300 ease-out relative overflow-hidden"
        :class="getRoleClasses(option.value)"
      >
        <input type="radio" :value="option.value" v-model="internalValue" class="hidden" />

        <!-- Label -->
        <div class="relative font-semibold">{{ option.label }}</div>
      </label>
    </div>

    <!-- Informational message for mentor -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform -translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform -translate-y-2"
    >
      <div
        v-if="internalValue === 'mentor'"
        class="mt-3 p-3 bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-200 rounded-lg"
      >
        <div class="flex items-start space-x-2">
          <span class="text-lg">🎓</span>
          <div class="text-sm">
            <p class="font-semibold text-purple-900 mb-1">Welcome, Future Mentor!</p>
            <p class="text-purple-700">
              You'll guide and inspire others, share your expertise, and make a lasting impact on careers.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface RoleOption {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  label?: string;
  options?: RoleOption[];
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [
    { value: 'user', label: 'User' },
    { value: 'mentor', label: 'Mentor' },
  ],
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const getRoleClasses = (roleValue: string) => {
  const isSelected = internalValue.value === roleValue;
  const isMentor = roleValue === 'mentor';

  if (isSelected) {
    if (isMentor) {
      return 'border-purple-500 bg-gradient-to-br from-purple-50 to-amber-50 text-purple-700 font-semibold shadow-lg scale-105 ring-2 ring-purple-300';
    }
    return 'border-blue-500 bg-blue-50 text-blue-600 font-semibold shadow-md scale-105';
  }

  return 'border-gray-300 hover:border-gray-400 hover:shadow-md';
};
</script>
