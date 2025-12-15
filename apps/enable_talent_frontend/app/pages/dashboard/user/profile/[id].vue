<template>
  <div class="bg-gray-100 min-h-screen pb-12 relative">
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
          <Button variant="default" @click="connect">Follow</Button>
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
    </section>

    <!-- Education Section -->
    <section class="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Education</h2>
      <div v-for="edu in profile.education" :key="edu.id" class="mb-4 last:mb-0">
        <h3 class="font-semibold text-gray-900">{{ edu.degree }}</h3>
        <p class="text-gray-500 text-sm">{{ edu.school }} • {{ edu.duration }}</p>
      </div>
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
    </section>

    <!-- Booking Button -->
    <div class="fixed bottom-8 right-8 z-50">
      <Button variant="default" class="shadow-lg bg-orange-600" @click="bookNow"> Book Now </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';

definePageMeta({
  layout: 'dashboard',
});

// Dummy Profile Data
const profile = {
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  coverImage: 'https://images.unsplash.com/photo-1503264116251-35a269479413',
  name: 'John Doe',
  title: 'Senior Software Engineer',
  location: 'San Francisco, CA',
  connections: 500,
  endorsements: 120,
  about:
    'Passionate software engineer with 10+ years of experience building scalable web applications. Skilled in Vue, Nuxt, and full-stack development.',
  experience: [
    {
      id: 1,
      position: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      duration: 'Jan 2020 – Present',
      description:
        'Leading a team of developers to build enterprise web applications using modern JS frameworks.',
    },
    {
      id: 2,
      position: 'Frontend Developer',
      company: 'WebSolutions LLC',
      duration: 'Jun 2016 – Dec 2019',
      description:
        'Worked on multiple client projects, developing responsive and performant user interfaces.',
    },
  ],
  education: [
    {
      id: 1,
      degree: 'B.Sc. Computer Science',
      school: 'University of California, Berkeley',
      duration: '2012 – 2016',
    },
  ],
  skills: ['Vue.js', 'Nuxt 4', 'TypeScript', 'Tailwind CSS', 'ShadCN UI', 'REST APIs'],
};

// Actions
</script>

<style scoped>
/* Smooth hover effect on sections */
section:hover {
  transition: transform 0.2s ease;
  transform: translateY(-2px);
}
</style>
