<template>
  <div class="bg-white rounded-xl shadow-2xl p-4 max-w-sm w-full">
    <div class="flex items-start space-x-3">
      <div
        class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        :class="iconBgClass"
      >
        <span class="text-xl">{{ icon }}</span>
      </div>
      <div class="flex-1 pt-1">
        <h3 v-if="alert.title" class="text-base font-semibold text-gray-900 mb-0.5">
          {{ alert.title }}
        </h3>
        <p class="text-sm text-gray-600">{{ alert.message }}</p>
      </div>
      <button
        @click="emit('close')"
        class="shrink-0 text-gray-400 hover:text-gray-600 transition"
      >
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
</template>

<script setup lang="ts">
import { ALERT_TYPE } from '~/constants';
import type { Alert } from '~/types/alert';

interface Props {
  alert: Alert;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const iconMap = {
  [ALERT_TYPE.INFO]: '💬',
  [ALERT_TYPE.WARNING]: '⚠️',
  [ALERT_TYPE.ERROR]: '❌',
  [ALERT_TYPE.SUCCESS]: '✅',
};

const iconBgMap = {
  [ALERT_TYPE.INFO]: 'bg-blue-100',
  [ALERT_TYPE.WARNING]: 'bg-amber-100',
  [ALERT_TYPE.ERROR]: 'bg-red-100',
  [ALERT_TYPE.SUCCESS]: 'bg-green-100',
};

const icon = computed(() => iconMap[props.alert.type]);
const iconBgClass = computed(() => iconBgMap[props.alert.type]);
</script>
