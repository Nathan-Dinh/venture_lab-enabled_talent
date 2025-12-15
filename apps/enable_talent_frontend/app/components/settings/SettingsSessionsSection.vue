<template>
  <section class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Session Settings</h2>

      <!-- Booking Preferences -->
      <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Booking Preferences</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                Auto-Accept Booking Requests
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Automatically accept booking requests from verified users
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="autoAcceptBookings"
                type="checkbox"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 dark:peer-checked:bg-orange-500"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Cancellation Policy -->
      <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Cancellation Policy</h3>
        <select
          v-model="cancellationPolicy"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="flexible">Flexible (free cancellation)</option>
          <option value="moderate">Moderate (48 hours notice)</option>
          <option value="strict">Strict (14 days notice)</option>
        </select>
      </div>

      <!-- Session Duration -->
      <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
          Default Session Duration
        </h3>
        <select
          v-model="defaultSessionDuration"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="90">1.5 hours</option>
          <option value="120">2 hours</option>
        </select>
      </div>

      <!-- Active Sessions -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Active Sessions</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Manage your logged-in devices
        </p>
        <div class="space-y-3">
          <div
            v-for="session in activeSessions"
            :key="session.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ session.device }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ session.location }} • Last active {{ session.lastActive }}
              </p>
            </div>
            <button
              v-if="!session.current"
              @click="logoutSession(session.id)"
              class="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              Logout
            </button>
            <span
              v-else
              class="text-xs font-semibold px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded"
            >
              Current
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const autoAcceptBookings = ref(false);
const cancellationPolicy = ref('flexible');
const defaultSessionDuration = ref('60');

const activeSessions = reactive([
  {
    id: 1,
    device: 'MacBook Pro',
    location: 'San Francisco, CA',
    lastActive: '2 minutes ago',
    current: true,
  },
  {
    id: 2,
    device: 'iPhone 14 Pro',
    location: 'San Francisco, CA',
    lastActive: '1 day ago',
    current: false,
  },
  { id: 3, device: 'Windows PC', location: 'Unknown', lastActive: '5 days ago', current: false },
]);

const logoutSession = (sessionId: number) => {
  const index = activeSessions.findIndex((s) => s.id === sessionId);
  if (index > -1) {
    activeSessions.splice(index, 1);
  }
};
</script>
