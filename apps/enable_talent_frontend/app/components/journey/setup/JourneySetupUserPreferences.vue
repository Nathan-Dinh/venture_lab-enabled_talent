<template>
  <div class="space-y-6">
    <!-- Time Zone -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Time Zone
      </label>
      <select
        v-model="formData.timezone"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select your timezone</option>
        <option value="EST">EST (Eastern Standard Time)</option>
        <option value="CST">CST (Central Standard Time)</option>
        <option value="MST">MST (Mountain Standard Time)</option>
        <option value="PST">PST (Pacific Standard Time)</option>
        <option value="GMT">GMT (Greenwich Mean Time)</option>
        <option value="CET">CET (Central European Time)</option>
        <option value="IST">IST (Indian Standard Time)</option>
        <option value="JST">JST (Japan Standard Time)</option>
      </select>
    </div>

    <!-- Budget per Session -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Budget per session
      </label>
      <select
        v-model="formData.budget"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">What's your budget range?</option>
        <option value="0-50">$0-$50</option>
        <option value="50-100">$50-$100</option>
        <option value="100-200">$100-$200</option>
        <option value="200+">$200+</option>
      </select>
    </div>

    <!-- Preferred Session Frequency -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Preferred session frequency
      </label>
      <div class="space-y-2">
        <label
          class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <input type="radio" v-model="formData.frequency" value="Weekly" class="w-4 h-4" />
          <span class="text-gray-900 dark:text-white font-medium">Weekly</span>
        </label>
        <label
          class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <input
            type="radio"
            v-model="formData.frequency"
            value="Bi-weekly"
            class="w-4 h-4"
          />
          <span class="text-gray-900 dark:text-white font-medium">Bi-weekly</span>
        </label>
        <label
          class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <input type="radio" v-model="formData.frequency" value="Monthly" class="w-4 h-4" />
          <span class="text-gray-900 dark:text-white font-medium">Monthly</span>
        </label>
        <label
          class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <input
            type="radio"
            v-model="formData.frequency"
            value="As needed"
            class="w-4 h-4"
          />
          <span class="text-gray-900 dark:text-white font-medium">As needed</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PreferencesData {
  timezone: string;
  budget: string;
  frequency: string;
}

defineProps<{
  formData: PreferencesData;
}>();
</script>
