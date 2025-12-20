<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id">
      {{ label }}
    </Label>
    <div class="relative">
      <Input
        :id="id"
        v-model="passwordInput"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="
          cn(
            'pr-10',
            error &&
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          )
        "
        :aria-invalid="!!error"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        @click="togglePasswordVisibility"
        class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        <Eye v-if="!showPassword" class="h-4 w-4" />
        <EyeOff v-else class="h-4 w-4" />
      </Button>
    </div>

    <!-- Password Strength Indicator -->
    <ClientOnly>
      <div v-if="showStrength && passwordInput" class="space-y-1">
        <div class="flex gap-1">
          <div
            v-for="i in 3"
            :key="i"
            :class="cn('h-1 flex-1 rounded-full transition-colors', getStrengthColor(i) as string)"
          />
        </div>
        <p :class="cn('text-xs', getStrengthTextClass())">Password strength: {{ strengthLabel }}</p>
      </div>

      <p v-if="showError && error" class="text-sm font-medium text-destructive">
        {{ error }}
      </p>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Eye, EyeOff } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const { validatePassword } = usePasswordValidation();

interface Props {
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  showStrength?: boolean;
  showError?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  placeholder: '••••••••',
  error: '',
  showStrength: false,
  showError: false,
});

const value = defineModel('value');
const error = defineModel('error');

const showPassword = ref(false);
const passwordInput = ref('');
const passwordStrength = ref<'weak' | 'medium' | 'strong' | null>(null);
const showPasswordStrength = ref(false);

watch(passwordInput, (password: string) => {
  const result = validatePassword(password);
  value.value = password;
  error.value = result.isValid ? '' : result.error;
  passwordStrength.value = result.strength;
  showPasswordStrength.value = true;
});

const strengthLabel = computed(() => {
  if (!passwordStrength.value) return '';
  return passwordStrength.value.charAt(0).toUpperCase() + passwordStrength.value.slice(1);
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const getStrengthColor = (index: number): string => {
  if (!passwordStrength.value) return 'bg-muted';

  const strengthLevels = {
    weak: 1,
    medium: 2,
    strong: 3,
  };

  const level = strengthLevels[passwordStrength.value];

  if (index <= level) {
    if (passwordStrength.value === 'weak') return 'bg-destructive';
    if (passwordStrength.value === 'medium') return 'bg-yellow-500 dark:bg-yellow-600';
    if (passwordStrength.value === 'strong') return 'bg-green-500 dark:bg-green-600';
  }

  return 'bg-muted';
};

const getStrengthTextClass = (): string => {
  if (passwordStrength.value === 'weak') return 'text-destructive';
  if (passwordStrength.value === 'medium') return 'text-yellow-600 dark:text-yellow-500';
  if (passwordStrength.value === 'strong') return 'text-green-600 dark:text-green-500';
  return 'text-muted-foreground';
};
</script>
