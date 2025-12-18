<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id">
      {{ label }}
    </Label>
    <div class="relative">
      <Input
        :id="id"
        v-model="emailInput"
        type="email"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="
          cn(
            error &&
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          )
        "
        :aria-invalid="!!error"
      />
    </div>

    <p v-if="error" class="text-sm font-medium text-destructive">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const { validateEmail } = useEmailValidation();

interface Props {
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  placeholder: 'you@example.com',
  error: '',
});

const value = defineModel('value');
const error = defineModel('error');

const emailInput = ref('');

watch(emailInput, (email: string) => {
  const result = validateEmail(email);
  value.value = email;
  error.value = result.isValid ? '' : result.error;
});
</script>
