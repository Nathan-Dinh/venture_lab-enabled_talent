<template>
  <div class="space-y-6">
    <div class="text-center">
      <div
        class="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-100 to-amber-100 rounded-full mb-4"
      >
        <span class="text-4xl">🎓</span>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome, Future Mentor!</h3>
      <p class="text-gray-600 dark:text-gray-400">
        Thank you for choosing to share your expertise and help others grow in their careers.
      </p>
    </div>

    <div
      class="bg-linear-to-r from-purple-50 to-amber-50 dark:from-purple-900/20 dark:to-amber-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6"
    >
      <h4 class="font-semibold text-purple-900 dark:text-purple-300 mb-3">
        What You'll Do as a Mentor
      </h4>
      <ul class="space-y-3">
        <li class="flex items-start">
          <span class="text-green-500 mr-3 mt-0.5">✓</span>
          <div>
            <span class="font-medium text-gray-900 dark:text-white">Guide & Inspire:</span>
            <span class="text-gray-700 dark:text-gray-300">
              Share your knowledge and experience with aspiring professionals</span
            >
          </div>
        </li>
        <li class="flex items-start">
          <span class="text-green-500 mr-3 mt-0.5">✓</span>
          <div>
            <span class="font-medium text-gray-900 dark:text-white">Set Your Schedule:</span>
            <span class="text-gray-700 dark:text-gray-300">
              Choose when you're available and work on your own terms</span
            >
          </div>
        </li>
        <li class="flex items-start">
          <span class="text-green-500 mr-3 mt-0.5">✓</span>
          <div>
            <span class="font-medium text-gray-900 dark:text-white">Earn While You Help:</span>
            <span class="text-gray-700 dark:text-gray-300">
              Set your own rates and get paid for your mentorship sessions</span
            >
          </div>
        </li>
        <li class="flex items-start">
          <span class="text-green-500 mr-3 mt-0.5">✓</span>
          <div>
            <span class="font-medium text-gray-900 dark:text-white">Make an Impact:</span>
            <span class="text-gray-700 dark:text-gray-300">
              Help shape careers and make a lasting difference in people's lives</span
            >
          </div>
        </li>
      </ul>
    </div>

    <div
      class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5"
    >
      <h4 class="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        What We'll Set Up
      </h4>
      <p class="text-sm text-blue-800 dark:text-blue-300">
        In the next few steps, we'll help you create your mentor profile by gathering:
      </p>
      <ul class="mt-3 space-y-2 text-sm text-blue-700 dark:text-blue-400">
        <li class="flex items-center">
          <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
          Your professional background and expertise
        </li>
        <li class="flex items-center">
          <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
          Skills and areas you can mentor in
        </li>
        <li class="flex items-center">
          <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
          Pricing and session structure
        </li>
        <li class="flex items-center">
          <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
          Your availability and timezone
        </li>
      </ul>
    </div>

    <div class="text-center text-sm text-gray-600 dark:text-gray-400">
      <p>This should only take about 5 minutes to complete.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component doesn't need validation as it's just informational
defineExpose({
  validate: () => true, // Always valid since it's just informational
});
</script>
