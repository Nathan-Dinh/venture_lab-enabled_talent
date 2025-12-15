<template>
  <div class="bg-gray-100 min-h-screen pb-12">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-600">Loading profile...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-4">
      {{ error }}
    </div>

    <!-- Profile Content -->
    <div v-else>
      <!-- Banner -->
      <div class="relative">
        <div class="h-48 bg-gray-300">
          <img :src="profile.coverImage" alt="cover" class="w-full h-full object-cover" />
        </div>

        <!-- Avatar & Action Buttons -->
        <div
          class="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <img
            :src="profile.avatar"
            alt="Avatar"
            class="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <Button variant="default" @click="connect">Edit</Button>
            <Button variant="outline">More</Button>
          </div>
        </div>
      </div>

      <!-- Profile Info -->
      <div class="mt-20 text-center">
        <h1 class="text-3xl font-semibold">{{ profile.name }}</h1>
        <p class="text-gray-600 mt-1">{{ profile.title }}</p>
        <p class="text-gray-400 text-sm mt-1">{{ profile.location }}</p>
      </div>

      <!-- Stats -->
      <div class="mt-6 flex justify-center gap-16 text-center">
        <div>
          <p class="text-gray-900 font-bold text-lg">{{ profile.connections }}</p>
          <p class="text-gray-500 text-sm">Connections</p>
        </div>
        <div>
          <p class="text-gray-900 font-bold text-lg">{{ profile.endorsements }}</p>
          <p class="text-gray-500 text-sm">Endorsements</p>
        </div>
      </div>

      <!-- About Section -->
      <section class="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-3">About</h2>
        <p class="text-gray-700">{{ profile.about }}</p>
      </section>

      <!-- Experience Section -->
      <section class="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Experience</h2>
        <div
          v-for="exp in profile.experience"
          :key="exp.id"
          class="mb-6 pb-4 border-b border-gray-200 last:border-none"
        >
          <h3 class="font-semibold text-gray-900">{{ exp.position }}</h3>
          <p class="text-gray-500 text-sm">{{ exp.company }} • {{ exp.duration }}</p>
          <p class="text-gray-700 mt-1">{{ exp.description }}</p>
        </div>
        <p v-if="profile.experience.length === 0" class="text-gray-500">No experience added yet</p>
      </section>

      <!-- Education Section -->
      <section class="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Education</h2>
        <div v-for="edu in profile.education" :key="edu.id" class="mb-4 last:mb-0">
          <h3 class="font-semibold text-gray-900">{{ edu.degree }}</h3>
          <p class="text-gray-500 text-sm">{{ edu.school }} • {{ edu.duration }}</p>
        </div>
        <p v-if="profile.education.length === 0" class="text-gray-500">No education added yet</p>
      </section>

      <!-- Skills Section -->
      <section class="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-lg shadow mb-12">
        <h2 class="text-xl font-semibold mb-4">Skills</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in profile.skills"
            :key="skill"
            class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {{ skill }}
          </span>
        </div>
        <p v-if="profile.skills.length === 0" class="text-gray-500">No skills added yet</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Button from '@/components/ui/button/Button.vue';

definePageMeta({
  layout: 'dashboard',
});

interface Experience {
  id: number;
  position: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: number;
  degree: string;
  school: string;
  duration: string;
}

interface Profile {
  avatar: string;
  coverImage: string;
  name: string;
  title: string;
  location: string;
  connections: number;
  endorsements: number;
  about: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

const { $apiRequestHandler } = useNuxtApp();
const isLoading = ref(true);
const error = ref('');

// Default profile with fallback data
const profile = ref<Profile>({
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  coverImage: 'https://images.unsplash.com/photo-1503264116251-35a269479413',
  name: 'Loading...',
  title: 'User',
  location: 'Unknown',
  connections: 0,
  endorsements: 0,
  about: '',
  experience: [],
  education: [],
  skills: [],
});

/**
 * Fetch user profile data on component mount
 *
 * Backend API Call:
 * - Endpoint: GET /api/profile
 * - Expected Response:
 *   {
 *     success: boolean,
 *     data: {
 *       profile_image_url: string,
 *       cover_image_url: string,
 *       name: string,
 *       headline: string,
 *       location: string,
 *       connections: number,
 *       bio: string,
 *       experience: Array<{ company, position, duration }>,
 *       education: Array<{ school, degree, field, year }>,
 *       skills: string[],
 *       endorsements: number
 *     }
 *   }
 *
 * TODO: Add profile edit functionality
 * TODO: Add image upload for avatar and cover
 */
onMounted(async () => {
  try {
    // BUG FIX: Added .base() to properly call the API handler
    const res = await $apiRequestHandler('/api/profile').base().get();

    if (res.error) {
      error.value = 'Failed to load profile';
      return;
    }

    if (res.data?.success && res.data?.data) {
      const data = res.data.data;
      profile.value = {
        avatar: data.profile_image_url || 'https://randomuser.me/api/portraits/men/32.jpg',
        coverImage: data.cover_image_url || 'https://images.unsplash.com/photo-1503264116251-35a269479413',
        name: data.name || 'Unknown',
        title: data.headline || 'User',
        location: data.location || 'Unknown',
        connections: data.connections || 0,
        endorsements: data.endorsements || 0,
        about: data.bio || '',
        experience: (data.experience || []).map((exp: any, idx: number) => ({
          id: idx + 1,
          position: exp.position || '',
          company: exp.company || '',
          duration: exp.duration || '',
          description: exp.description || '',
        })),
        education: (data.education || []).map((edu: any, idx: number) => ({
          id: idx + 1,
          degree: edu.degree || '',
          school: edu.school || '',
          duration: edu.duration || '',
        })),
        skills: data.skills || [],
      };
    }
  } catch (err) {
    error.value = 'Error loading profile';
  } finally {
    isLoading.value = false;
  }
});

// Actions
</script>

<style scoped>
/* Smooth hover effect on sections */
section:hover {
  transition: transform 0.2s ease;
  transform: translateY(-2px);
}
</style>
