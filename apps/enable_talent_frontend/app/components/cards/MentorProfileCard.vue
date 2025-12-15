<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-3xl border-1 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
  >
    <div class="flex items-start md:items-center gap-4 w-full md:w-auto">
      <img
        :src="user.avatar"
        alt="Profile picture of {{ user.name }}"
        class="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover shadow-md"
      />
      <div class="flex flex-col justify-center flex-1">
        <h3 class="text-lg md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {{ user.name }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ user.role }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ user.location }}</p>
        <div class="flex flex-wrap gap-3 mt-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <span class="font-semibold">{{ user.rating }}</span> Rating
          </div>
          <div>
            <span class="font-semibold">{{ user.reviews }}</span> Reviews
          </div>
          <div>
            <span class="font-semibold">{{ user.sessions }}</span> Sessions
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="(tag, index) in user.tags"
            :key="index"
            class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-1 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row sm:gap-2 gap-2 w-full md:w-auto mt-4 md:mt-0">
      <button
        class="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
        @click="bookNow(user.id)"
      >
        Book Now
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  reviews: number;
  sessions: number;
  tags: string[];
}

interface Props {
  user: User;
}

defineProps<Props>();

const bookNow = (id: number) => {
  navigateTo('/dashboard/mentors/booking/' + id);
};
</script>
