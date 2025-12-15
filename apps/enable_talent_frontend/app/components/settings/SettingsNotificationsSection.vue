<template>
  <section class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Notification Preferences
      </h2>

      <!-- Email Notifications -->
      <div class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Email Notifications</h3>
        <div class="space-y-4">
          <div
            v-for="notif in emailNotifications"
            :key="notif.id"
            class="flex items-start gap-4"
          >
            <label class="relative inline-flex items-center cursor-pointer mt-1">
              <input v-model="notif.enabled" type="checkbox" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 dark:peer-checked:bg-orange-500"
              />
            </label>
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">
                {{ notif.title }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ notif.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- In-App Notifications -->
      <div class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">In-App Notifications</h3>
        <div class="space-y-4">
          <div
            v-for="notif in inAppNotifications"
            :key="notif.id"
            class="flex items-start gap-4"
          >
            <label class="relative inline-flex items-center cursor-pointer mt-1">
              <input v-model="notif.enabled" type="checkbox" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 dark:peer-checked:bg-orange-500"
              />
            </label>
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">
                {{ notif.title }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ notif.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Frequency -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
          Notification Frequency
        </h3>
        <select
          v-model="notificationFrequency"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="instant">Instant</option>
          <option value="daily">Daily Digest</option>
          <option value="weekly">Weekly Digest</option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const notificationFrequency = ref('daily');

const emailNotifications = reactive([
  {
    id: 1,
    title: 'Booking Requests',
    description: 'Receive email when someone books a session',
    enabled: true,
  },
  {
    id: 2,
    title: 'Session Reminders',
    description: 'Get reminders before your scheduled sessions',
    enabled: true,
  },
  {
    id: 3,
    title: 'Messages',
    description: 'Receive email notifications for new messages',
    enabled: false,
  },
  {
    id: 4,
    title: 'Weekly Digest',
    description: 'Get a weekly summary of your activity',
    enabled: true,
  },
]);

const inAppNotifications = reactive([
  {
    id: 1,
    title: 'Booking Requests',
    description: 'Show notification for booking requests',
    enabled: true,
  },
  { id: 2, title: 'Messages', description: 'Show notification for new messages', enabled: true },
  {
    id: 3,
    title: 'Availability Updates',
    description: 'Notify when mentor availability changes',
    enabled: false,
  },
]);
</script>
