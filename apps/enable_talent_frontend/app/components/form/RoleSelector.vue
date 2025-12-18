<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div class="flex space-x-3">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex-1 cursor-pointer border rounded-lg p-2 text-center transition hover:bg-blue-50"
        :class="
          internalValue === option.value
            ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold'
            : 'border-gray-300'
        "
      >
        <input type="radio" :value="option.value" v-model="internalValue" class="hidden" />
        {{ option.label }}
      </label>
    </div>
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
</script>
