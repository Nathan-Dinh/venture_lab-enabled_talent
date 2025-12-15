<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
    <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
      Welcome to <span class="text-orange-600">Enabled Talent</span>
    </h1>
    <p class="text-gray-700 max-w-lg mb-8 text-lg md:text-xl">
      Connect with mentors, gain personalized guidance, and book your first session with ease.
    </p>
    <div class="flex flex-col sm:flex-row gap-4">
      <NuxtLink
        to="/signup"
        class="px-8 py-4 bg-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-orange-700 transition transform hover:-translate-y-1"
      >
        Become a member
      </NuxtLink>
      <NuxtLink
        to="/login"
        class="px-8 py-4 bg-gray-200 text-gray-800 font-semibold rounded-2xl hover:bg-gray-300 transition transform hover:-translate-y-1"
      >
        Login
      </NuxtLink>
    </div>
    <p class="text-gray-500 mt-6 text-sm">
      Empowering your learning journey, one session at a time.
    </p>
  </div>
</template>

<script setup>
// Nothing needed for now
</script>

<style scoped>
/* You can customize transitions or add local styles here */
</style>
