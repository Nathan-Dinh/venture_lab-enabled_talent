<template>
  <div class="space-y-6">
    <!-- Time Zone -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Time Zone
      </label>
      <select
        v-model="formData.timezone"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

    <!-- Available Days & Hours -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Available Days & Hours
      </label>
      <div class="space-y-2">
        <div
          v-for="day in Object.keys(formData.availability)"
          :key="day"
          class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <div class="flex items-center gap-3 mb-3">
            <input
              v-model="formData.availability[day]!.enabled"
              type="checkbox"
              :id="`day-${day}`"
              class="w-4 h-4 rounded cursor-pointer"
            />
            <label
              :for="`day-${day}`"
              class="text-sm font-semibold text-gray-900 dark:text-white capitalize cursor-pointer flex-1"
            >
              {{ day }}
            </label>
          </div>

          <div v-if="formData.availability[day]!.enabled" class="flex gap-3 ml-7">
            <div class="flex-1">
              <label class="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                Start Time
              </label>
              <input
                v-model="formData.availability[day]!.startTime"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
            <div class="flex-1">
              <label class="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                End Time
              </label>
              <input
                v-model="formData.availability[day]!.endTime"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AvailabilitySlot {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface AvailabilityData {
  timezone: string;
  availability: Record<string, AvailabilitySlot>;
}

defineProps<{
  formData: AvailabilityData;
}>();
</script>
