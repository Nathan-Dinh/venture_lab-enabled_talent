<template>
  <div>
    <Label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </Label>
    <Input
      :id="id"
      v-model="internalValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none',
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
      ]"
      @blur="handleBlur"
    />
    <ClientOnly>
      <p v-if="error" class="mt-1 text-sm text-red-600">
        {{ error }}
      </p>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  id?: string;
  modelValue: string;
  label?: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  error: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'blur': [];
}>();

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value as string),
});

const handleBlur = () => {
  emit('blur');
};
</script>
