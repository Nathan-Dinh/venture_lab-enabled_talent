<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-600">Loading mentor details...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      {{ error }}
    </div>

    <!-- Mentor detail -->
    <div v-else>
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6"
      >
        <!-- Profile info -->
        <div class="flex items-start space-x-6">
          <img
            :src="user.avatar"
            alt="Profile"
            class="w-24 h-24 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
          />
          <div class="flex-1">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ user.name }}</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mt-1">{{ user.headline }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-2">
              <span>📍</span> {{ user.location }}
            </p>

            <!-- Rating -->
            <div class="flex items-center gap-2 mt-3">
              <span class="text-yellow-500">★★★★★</span>
              <span class="text-gray-600 dark:text-gray-400">{{ user.rating }} ({{ user.reviews }} reviews)</span>
            </div>

            <!-- Tags/Skills -->
            <div class="flex flex-wrap gap-2 mt-4">
              <span
                v-for="(tag, index) in user.tags"
                :key="index"
                class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col space-y-2">
            <button class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
              Book Session
            </button>
            <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 transition">
              Follow
            </button>
            <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 transition">
              Message
            </button>
          </div>
        </div>
      </div>

      <!-- About section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-3">About</h3>
        <p class="text-gray-700 dark:text-gray-300">{{ user.about }}</p>
      </div>

      <!-- Stats section -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p class="text-2xl font-bold text-orange-500">{{ user.sessions }}</p>
          <p class="text-gray-600 dark:text-gray-400 text-sm mt-2">Sessions Completed</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p class="text-2xl font-bold text-orange-500">{{ user.connections }}</p>
          <p class="text-gray-600 dark:text-gray-400 text-sm mt-2">Connections</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p class="text-2xl font-bold text-orange-500">{{ user.experience }}</p>
          <p class="text-gray-600 dark:text-gray-400 text-sm mt-2">Years Experience</p>
        </div>
      </div>

      <!-- Pricing section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Pricing</h3>
          <div v-if="pricing.hourly_rate" class="text-2xl font-bold text-orange-500">
            ${{ pricing.hourly_rate }}<span class="text-sm text-gray-600 dark:text-gray-400">/hr</span>
          </div>
        </div>

        <!-- Pricing tiers -->
        <div v-if="pricing.tiers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="tier in pricing.tiers"
            :key="tier.pricing_id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
          >
            <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ tier.tier_name }}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ Math.floor(tier.duration_minutes / 60) }}{{ tier.duration_minutes % 60 ? 'h ' + (tier.duration_minutes % 60) + 'm' : 'h' }}
            </p>
            <p class="text-2xl font-bold text-orange-500 mt-3">${{ tier.rate }}</p>
            <p v-if="tier.description" class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {{ tier.description }}
            </p>
            <button
              class="w-full mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
            >
              Book This
            </button>
          </div>
        </div>

        <!-- No tiers available -->
        <div v-else class="text-center py-8">
          <p class="text-gray-500">No pricing tiers available</p>
          <p class="text-sm text-gray-400 mt-1">Contact mentor for custom pricing</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'dashboard',
});

interface PricingTier {
  pricing_id: number;
  tier_name: string;
  duration_minutes: number;
  rate: number;
  description?: string;
}

interface Pricing {
  hourly_rate?: number;
  currency: string;
  tiers: PricingTier[];
}

interface User {
  name: string;
  headline: string;
  location: string;
  avatar: string;
  tags: string[];
  about: string;
  rating: number;
  reviews: number;
  sessions: number;
  connections: number;
  experience: number;
}

const route = useRoute();
const { $apiRequestHandler } = useNuxtApp();
const isLoading = ref(true);
const error = ref('');

// Default user with fallback data
const user = ref<User>({
  name: 'Loading...',
  headline: 'Mentor',
  location: 'Unknown',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  tags: [],
  about: '',
  rating: 0,
  reviews: 0,
  sessions: 0,
  connections: 0,
  experience: 0,
});

// Default pricing with fallback data
const pricing = ref<Pricing>({
  hourly_rate: undefined,
  currency: 'USD',
  tiers: [],
});

/**
 * Fetch mentor details on component mount
 *
 * Backend API Call:
 * - Endpoint: GET /api/mentors/:id
 * - Expected Response:
 *   {
 *     success: boolean,
 *     data: {
 *       name: string,
 *       headline: string,
 *       location: string,
 *       profile_image_url: string,
 *       skills: string[],
 *       bio: string,
 *       rating: number,
 *       review_count: number,
 *       session_count: number,
 *       pricing: {
 *         hourly_rate: number,
 *         currency: string,
 *         tiers: Array<{ pricing_id, tier_name, duration_minutes, rate, description }>
 *       }
 *     }
 *   }
 *
 * TODO: Add loading skeleton
 * TODO: Add 404 handling for non-existent mentors
 */
onMounted(async () => {
  try {
    const mentorId = route.params.id;
    // BUG FIX: Added .base() to properly call the API handler
    const res = await $apiRequestHandler(`/api/mentors/${mentorId}`).base().get();

    if (res.error) {
      error.value = 'Failed to load mentor details';
      return;
    }

    if (res.data?.success && res.data?.data) {
      const data = res.data.data;
      user.value = {
        name: data.name || 'Unknown',
        headline: data.headline || 'Mentor',
        location: data.location || 'Unknown',
        avatar: data.profile_image_url || 'https://randomuser.me/api/portraits/men/32.jpg',
        tags: data.skills || [],
        about: data.bio || '',
        rating: data.rating || 0,
        reviews: data.review_count || 0,
        sessions: data.session_count || 0,
        connections: 0,
        experience: 5, // Default placeholder
      };

      // Set pricing information
      if (data.pricing) {
        pricing.value = {
          hourly_rate: data.pricing.hourly_rate,
          currency: data.pricing.currency || 'USD',
          tiers: data.pricing.tiers || [],
        };
      }
    }
  } catch (err) {
    error.value = 'Error loading mentor details';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Optional: hover effect for buttons */
button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
