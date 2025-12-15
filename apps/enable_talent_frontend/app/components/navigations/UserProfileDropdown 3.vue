<template>
  <div class="relative group">
    <button
      class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <img :src="user.avatar" alt="Profile" class="w-full h-full object-cover" />
    </button>
    <transition name="fade">
      <div
        class="absolute right-0 mt-1 w-48 bg-white border-1 dark:bg-gray-800 rounded-md py-2 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200"
      >
        <a
          v-for="link in userProfileLink"
          :href="link.href"
          class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {{ link.name }}
        </a>
        <button
          @click="logout"
          class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          Logout
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface User {
  name: string;
  avatar: string;
  email?: string;
}

// Default user profile with fallback values
const user = ref<User>({
  name: 'User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
});

const userProfileLink = [
  { name: 'My Profile', href: '/dashboard/user/profile' },
  { name: 'Settings', href: '/dashboard/user/settings' },
];

/**
 * Handle user logout
 * Clears the auth token and redirects to login page
 */
const logout = async () => {
  const token = useCookie('token');
  token.value = null;
  await navigateTo('/login');
};

/**
 * Load user profile data on component mount
 */
onMounted(async () => {
  try {
    const { $apiRequestHandler } = useNuxtApp();
    const res = await $apiRequestHandler('/api/auth/me').get();

    if (res.data?.data?.data) {
      user.value = {
        name: res.data.data.data.name,
        email: res.data.data.data.email,
        avatar: res.data.data.data.profile_image_url || user.value.avatar,
      };
    }
  } catch (_error) {
    // Silently fail and use default user
  }
});
</script>
