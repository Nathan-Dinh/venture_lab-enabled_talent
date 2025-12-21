<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-full"
  >
    <div
      v-if="show"
      class="fixed bottom-6 right-6 z-50 bg-white rounded-xl shadow-2xl p-4 max-w-sm w-full"
    >
      <div class="flex items-start space-x-3">
        <div
          class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
          :class="iconBgClass"
        >
          <span class="text-xl">{{ icon }}</span>
        </div>
        <div class="flex-1 pt-1">
          <h3 v-if="title" class="text-base font-semibold text-gray-900 mb-0.5">
            {{ title }}
          </h3>
          <p class="text-sm text-gray-600">{{ message }}</p>
        </div>
        <button @click="handleClose" class="shrink-0 text-gray-400 hover:text-gray-600 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue';

interface Props {
  show: boolean;
  message: string;
  title?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  duration?: number; // Auto-dismiss duration in milliseconds
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 4000, // Default 4 seconds
});

const emit = defineEmits<{
  close: [];
}>();

const iconMap = {
  info: '💬',
  warning: '⚠️',
  error: '❌',
  success: '✅',
};

const iconBgMap = {
  info: 'bg-blue-100',
  warning: 'bg-amber-100',
  error: 'bg-red-100',
  success: 'bg-green-100',
};

const icon = computed(() => iconMap[props.type]);
const iconBgClass = computed(() => iconBgMap[props.type]);

const handleClose = () => {
  emit('close');
};

// Auto-dismiss after duration
let timeoutId: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Set new timeout to auto-dismiss
      timeoutId = setTimeout(() => {
        handleClose();
      }, props.duration);
    }
  }
);

// Cleanup timeout on unmount
onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>
