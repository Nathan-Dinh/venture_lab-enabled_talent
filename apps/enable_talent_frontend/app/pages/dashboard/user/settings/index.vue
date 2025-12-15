<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Manage your account preferences and privacy settings
      </p>
    </div>

    <!-- Settings Container -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Navigation -->
      <div class="lg:col-span-1">
        <nav class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-2 sticky top-4">
          <button
            v-for="item in navigationItems"
            :key="item.id"
            @click="activeSection = item.id"
            :class="[
              'w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3',
              activeSection === item.id
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-semibold'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50',
            ]"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </button>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-3">
        <SettingsAccountSection v-show="activeSection === 'account'" @notify="showNotification" />
        <SettingsNotificationsSection v-show="activeSection === 'notifications'" />
        <SettingsPrivacySection v-show="activeSection === 'privacy'" />
        <SettingsSessionsSection v-show="activeSection === 'sessions'" />

        <!-- Save Settings Button (at the bottom) -->
        <div class="mt-8 flex gap-3">
          <button
            @click="saveSettings"
            class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
          >
            Save Changes
          </button>
          <button
            @click="resetSettings"
            class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Success Notification Toast -->
    <transition
      name="fade"
      @enter="
        (el) => {
          el.style.opacity = '0';
        }
      "
      @after-enter="
        (el) => {
          el.style.opacity = '1';
          el.style.transition = 'opacity 0.3s';
        }
      "
      @leave="
        (el) => {
          el.style.opacity = '1';
          el.style.transition = 'opacity 0.3s';
          setTimeout(() => {
            el.style.opacity = '0';
          }, 10);
        }
      "
    >
      <div
        v-if="showSuccessNotification"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2"
      >
        <span>✓</span>
        {{ successMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Settings, Bell, Lock, LogOut } from 'lucide-vue-next';
import SettingsAccountSection from '~/components/settings/SettingsAccountSection.vue';
import SettingsNotificationsSection from '~/components/settings/SettingsNotificationsSection.vue';
import SettingsPrivacySection from '~/components/settings/SettingsPrivacySection.vue';
import SettingsSessionsSection from '~/components/settings/SettingsSessionsSection.vue';

definePageMeta({
  layout: 'dashboard',
});

const activeSection = ref('account');
const showSuccessNotification = ref(false);
const successMessage = ref('');

const navigationItems = [
  { id: 'account', label: 'Account', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'sessions', label: 'Sessions', icon: LogOut },
];

const saveSettings = () => {
  showNotification('All settings saved successfully');
};

const resetSettings = () => {
  showNotification('Settings reset to default values');
};

const showNotification = (message: string) => {
  successMessage.value = message;
  showSuccessNotification.value = true;
  setTimeout(() => {
    showSuccessNotification.value = false;
  }, 3000);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
