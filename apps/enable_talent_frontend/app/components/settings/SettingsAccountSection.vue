<template>
  <section class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>

      <!-- Email Setting -->
      <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Email Address</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ email }}
            </p>
          </div>
          <button
            v-if="!editingEmail"
            @click="editingEmail = true"
            class="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
          >
            Change
          </button>
        </div>

        <div v-if="editingEmail" class="space-y-3">
          <input
            v-model="tempEmail"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter new email"
          />
          <div class="flex gap-2">
            <button
              @click="saveEmail"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
            >
              Save
            </button>
            <button
              @click="editingEmail = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Password Setting -->
      <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Password</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Last changed 3 months ago
            </p>
          </div>
          <button
            v-if="!editingPassword"
            @click="editingPassword = true"
            class="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
          >
            Change
          </button>
        </div>

        <div v-if="editingPassword" class="space-y-3 mt-4">
          <input
            v-model="passwordForm.current"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Current password"
          />
          <input
            v-model="passwordForm.new"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="New password"
          />
          <input
            v-model="passwordForm.confirm"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Confirm new password"
          />
          <div class="flex gap-2">
            <button
              @click="savePassword"
              :disabled="!passwordForm.new || passwordForm.new !== passwordForm.confirm"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                passwordForm.new && passwordForm.new === passwordForm.confirm
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed',
              ]"
            >
              Save
            </button>
            <button
              @click="
                editingPassword = false;
                resetPasswordForm();
              "
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Two-Factor Authentication -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">
            Two-Factor Authentication
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="twoFactorEnabled" type="checkbox" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 dark:peer-checked:bg-orange-500"
          />
        </label>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const emit = defineEmits<{
  notify: [message: string];
}>();

const email = ref('john.doe@example.com');
const editingEmail = ref(false);
const tempEmail = ref('');
const editingPassword = ref(false);
const twoFactorEnabled = ref(false);

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: '',
});

const saveEmail = () => {
  email.value = tempEmail.value;
  editingEmail.value = false;
  emit('notify', 'Email updated successfully');
};

const savePassword = () => {
  editingPassword.value = false;
  resetPasswordForm();
  emit('notify', 'Password changed successfully');
};

const resetPasswordForm = () => {
  passwordForm.current = '';
  passwordForm.new = '';
  passwordForm.confirm = '';
};
</script>
