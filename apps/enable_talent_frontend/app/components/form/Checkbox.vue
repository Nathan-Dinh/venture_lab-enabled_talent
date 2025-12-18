<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
    />
    <Label
      v-if="label"
      :for="id"
      class="ml-2 text-sm text-gray-700 cursor-pointer select-none"
    >
      {{ label }}
    </Label>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label';

interface Props {
  id?: string;
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>
