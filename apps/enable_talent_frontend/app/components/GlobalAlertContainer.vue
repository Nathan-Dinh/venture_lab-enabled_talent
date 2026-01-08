<template>
  <Teleport to="body">
    <!-- Top Left -->
    <div class="fixed top-4 left-4 z-50 flex flex-col gap-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-full"
      >
        <AlertItem
          v-for="alert in alertsByPosition['top-left']"
          :key="alert.id"
          :alert="alert"
          @close="removeAlert(alert.id)"
        />
      </TransitionGroup>
    </div>

    <!-- Top Center -->
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-full"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-full"
      >
        <AlertItem
          v-for="alert in alertsByPosition['top-center']"
          :key="alert.id"
          :alert="alert"
          @close="removeAlert(alert.id)"
        />
      </TransitionGroup>
    </div>

    <!-- Top Right -->
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <AlertItem
          v-for="alert in alertsByPosition['top-right']"
          :key="alert.id"
          :alert="alert"
          @close="removeAlert(alert.id)"
        />
      </TransitionGroup>
    </div>

    <!-- Bottom Left -->
    <div class="fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-full"
      >
        <AlertItem
          v-for="alert in alertsByPosition['bottom-left']"
          :key="alert.id"
          :alert="alert"
          @close="removeAlert(alert.id)"
        />
      </TransitionGroup>
    </div>

    <!-- Bottom Center -->
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-full"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-full"
      >
        <AlertItem
          v-for="alert in alertsByPosition['bottom-center']"
          :key="alert.id"
          :alert="alert"
          @close="removeAlert(alert.id)"
        />
      </TransitionGroup>
    </div>

    <!-- Bottom Right -->
    <div class="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <AlertItem
          v-for="alert in alertsByPosition['bottom-right']"
          :key="alert.id"
          :alert="alert"
          @close="removeAlert(alert.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useAlertStore } from '~/stores/alert';
import { storeToRefs } from 'pinia';

const alertStore = useAlertStore();
const { alertsByPosition } = storeToRefs(alertStore);
const { removeAlert } = alertStore;
</script>
