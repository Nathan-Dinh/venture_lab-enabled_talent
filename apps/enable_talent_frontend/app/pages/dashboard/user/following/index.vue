<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-600">Loading followed mentors...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      {{ error }}
    </div>

    <!-- Main content -->
    <div v-else>
      <div class="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">Filter Mentors</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Role</label>
            <input
              v-model="filters.role"
              type="text"
              placeholder="e.g., Developer"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Location</label>
            <input
              v-model="filters.location"
              type="text"
              placeholder="e.g., Toronto"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Min Rating</label>
            <select
              v-model.number="filters.minRating"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option :value="0">Any</option>
              <option :value="4">4.0+</option>
              <option :value="4.5">4.5+</option>
              <option :value="4.8">4.8+</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Skill</label>
            <input
              v-model="filters.tag"
              type="text"
              placeholder="e.g., Vue.js"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <button
          @click="resetFilters"
          class="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Reset Filters
        </button>
      </div>

      <p class="mb-4 text-gray-600 dark:text-gray-400">
        Showing {{ filteredUsers.length }} of {{ users.length }} mentors
      </p>

      <div class="space-y-4">
        <div v-for="user in filteredUsers" :key="user.id">
          <MentorProfileCard :user="user" />
        </div>
      </div>

      <div v-if="filteredUsers.length === 0" class="text-center py-8">
        <p class="text-gray-500">No mentors match your filters</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import MentorProfileCard from '~/components/cards/MentorProfileCard.vue';

definePageMeta({
  layout: 'dashboard',
});

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

const { $apiRequestHandler } = useNuxtApp();
const users = ref<User[]>([]);
const isLoading = ref(true);
const error = ref('');

/**
 * Fetch followed mentors on component mount
 *
 * Backend API Call:
 * - Endpoint: GET /api/follows
 * - Expected Response:
 *   {
 *     success: boolean,
 *     data: Array<{
 *       user_id: number,
 *       name: string,
 *       headline: string,
 *       location: string,
 *       profile_image_url: string,
 *       rating: number,
 *       session_count: number,
 *       hourly_rate: number
 *     }>
 *   }
 *
 * TODO: Add unfollow functionality
 * TODO: Add follow/unfollow animation
 */
onMounted(async () => {
  try {
    // BUG FIX: Added .base() to properly call the API handler
    const res = await $apiRequestHandler('/api/follows').base().get();

    if (res.error) {
      error.value = 'Failed to load followed mentors';
      return;
    }

    if (res.data?.success && res.data?.data) {
      // Transform API data to match UI interface
      users.value = res.data.data.map((mentor: any) => ({
        id: mentor.user_id,
        name: mentor.name,
        role: mentor.headline || 'Mentor',
        location: mentor.location || 'Unknown',
        avatar: mentor.profile_image_url || 'https://randomuser.me/api/portraits/men/1.jpg',
        rating: mentor.rating || 0,
        reviews: 0,
        sessions: mentor.session_count || 0,
        tags: [],
      }));
    }
  } catch (err) {
    error.value = 'Error loading followed mentors';
  } finally {
    isLoading.value = false;
  }
});

// Filter state
const filters = reactive({
  role: '',
  location: '',
  minRating: 0,
  tag: '',
});

// Computed filtered users
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const roleMatch = user.role.toLowerCase().includes(filters.role.toLowerCase());
    const locationMatch = user.location.toLowerCase().includes(filters.location.toLowerCase());
    const ratingMatch = user.rating >= filters.minRating;
    const tagMatch =
      filters.tag === '' ||
      user.tags.some((t) => t.toLowerCase().includes(filters.tag.toLowerCase()));

    return roleMatch && locationMatch && ratingMatch && tagMatch;
  });
});

// Reset filters
const resetFilters = () => {
  filters.role = '';
  filters.location = '';
  filters.minRating = 0;
  filters.tag = '';
};
</script>
