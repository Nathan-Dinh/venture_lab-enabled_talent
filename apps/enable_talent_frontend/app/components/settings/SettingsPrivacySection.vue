<template>
  <section class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Privacy & Visibility
      </h2>

      <!-- Profile Visibility -->
      <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Profile Visibility</h3>
        <div class="space-y-3">
          <label
            class="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <input
              v-model="profileVisibility"
              type="radio"
              value="public"
              class="w-4 h-4 text-orange-600 dark:text-orange-400"
            />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Public</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Anyone can find and view your profile
              </p>
            </div>
          </label>
          <label
            class="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <input
              v-model="profileVisibility"
              type="radio"
              value="private"
              class="w-4 h-4 text-orange-600 dark:text-orange-400"
            />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Private</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Only people you follow can see your profile
              </p>
            </div>
          </label>
        </div>
      </div>

      <!-- Show Online Status -->
      <div
        class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Online Status</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Show when you are online
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="showOnlineStatus" type="checkbox" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 dark:peer-checked:bg-orange-500"
          />
        </label>
      </div>

      <!-- Search Indexing -->
      <div
        class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Search Engine Indexing</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Allow your profile to appear in search results
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="searchIndexing" type="checkbox" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 dark:peer-checked:bg-orange-500"
          />
        </label>
      </div>

      <!-- Blocked Users -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Blocked Users</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ blockedUsers.length }} user(s) blocked
        </p>
        <div v-if="blockedUsers.length > 0" class="space-y-2">
          <div
            v-for="user in blockedUsers"
            :key="user"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <span class="text-gray-700 dark:text-gray-300">{{ user }}</span>
            <button
              @click="unblockUser(user)"
              class="text-sm text-orange-600 dark:text-orange-400 hover:underline font-medium"
            >
              Unblock
            </button>
          </div>
        </div>
        <p v-else class="text-gray-600 dark:text-gray-400">No blocked users</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const profileVisibility = ref('public');
const showOnlineStatus = ref(true);
const searchIndexing = ref(true);

const blockedUsers = reactive(['spam_user_1', 'unknown_account']);

const unblockUser = (user: string) => {
  const index = blockedUsers.indexOf(user);
  if (index > -1) {
    blockedUsers.splice(index, 1);
  }
};
</script>
