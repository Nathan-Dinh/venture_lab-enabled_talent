<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Manage Availability</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Set your availability for mentoring sessions
      </p>
    </div>

    <!-- Timezone Selector -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
    >
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <label class="block text-sm font-semibold mb-2">Timezone</label>
          <select
            v-model="selectedTimezone"
            class="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
          </select>
        </div>
        <div class="pt-8">
          <p class="text-xs text-gray-500 dark:text-gray-400">Current time: {{ currentTime }}</p>
        </div>
      </div>
    </div>

    <!-- Weekly Schedule -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <!-- Tabs for day view -->
      <div class="border-b border-gray-200 dark:border-gray-800">
        <div class="flex overflow-x-auto">
          <button
            v-for="day in daysOfWeek"
            :key="day"
            @click="selectedDay = day"
            :class="[
              'px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap',
              selectedDay === day
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
            ]"
          >
            {{ day }}
          </button>
        </div>
      </div>

      <!-- Day Schedule Editor -->
      <div class="p-6 space-y-6">
        <!-- Enable/Disable Toggle -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">{{ selectedDay }} Schedule</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add available time slots for {{ selectedDay }}
            </p>
          </div>
          <label class="flex items-center gap-3 cursor-pointer">
            <span class="text-sm font-medium">Available</span>
            <input
              type="checkbox"
              :checked="dayAvailability[selectedDay].enabled"
              @change="toggleDayAvailability"
              class="w-5 h-5 rounded border-gray-300 cursor-pointer"
            />
          </label>
        </div>

        <!-- Time Slots -->
        <div v-if="dayAvailability[selectedDay].enabled" class="space-y-4">
          <!-- Existing Time Slots -->
          <div
            v-for="(slot, index) in dayAvailability[selectedDay].slots"
            :key="index"
            class="flex gap-3 items-end"
          >
            <!-- Start Time -->
            <div class="flex-1">
              <label class="block text-sm font-medium mb-2">Start Time</label>
              <input
                :value="slot.start"
                @input="updateSlotStart(index, ($event.target as HTMLInputElement).value)"
                type="time"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <!-- End Time -->
            <div class="flex-1">
              <label class="block text-sm font-medium mb-2">End Time</label>
              <input
                :value="slot.end"
                @input="updateSlotEnd(index, ($event.target as HTMLInputElement).value)"
                type="time"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <!-- Delete Button -->
            <button
              @click="removeSlot(index)"
              class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Add Slot Button -->
          <button
            @click="addSlot"
            class="w-full py-3 border-2 border-dashed border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition font-medium"
          >
            + Add Time Slot
          </button>
        </div>

        <!-- Disabled State -->
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">Not available on {{ selectedDay }}</p>
        </div>
      </div>
    </div>

    <!-- Weekly Overview -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
    >
      <h3 class="text-lg font-semibold mb-6">Weekly Overview</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
          :class="
            dayAvailability[day].enabled
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-gray-50 dark:bg-gray-800'
          "
        >
          <h4 class="font-semibold text-sm mb-3">{{ day }}</h4>
          <div v-if="dayAvailability[day].enabled" class="space-y-2">
            <div v-for="(slot, idx) in dayAvailability[day].slots" :key="idx" class="text-sm">
              <p class="text-gray-700 dark:text-gray-300">
                {{ formatTime(slot.start) }} - {{ formatTime(slot.end) }}
              </p>
            </div>
            <div
              class="text-xs text-green-600 dark:text-green-400 pt-2 border-t border-green-200 dark:border-green-800"
            >
              Available
            </div>
          </div>
          <div v-else class="text-xs text-gray-500 dark:text-gray-400">Not available</div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 justify-end">
      <button
        @click="resetChanges"
        class="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
      >
        Reset
      </button>
      <button
        @click="saveAvailability"
        class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium shadow-sm"
      >
        Save Availability
      </button>
    </div>

    <!-- Success Message -->
    <transition name="fade">
      <div
        v-if="showSuccessMessage"
        class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Availability saved successfully!</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'dashboard',
});

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const selectedDay = ref('Monday');
const selectedTimezone = ref('America/Toronto');
const showSuccessMessage = ref(false);

const timezones = [
  'America/New_York',
  'America/Toronto',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Australia/Sydney',
  'Pacific/Auckland',
];

const dayAvailability = ref<Record<string, DaySchedule>>({
  Monday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  Tuesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  Wednesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  Thursday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  Friday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
  Saturday: { enabled: false, slots: [{ start: '10:00', end: '14:00' }] },
  Sunday: { enabled: false, slots: [] },
});

const currentTime = computed(() => {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
});

const toggleDayAvailability = () => {
  dayAvailability.value[selectedDay.value].enabled =
    !dayAvailability.value[selectedDay.value].enabled;
};

const updateSlotStart = (index: number, value: string) => {
  dayAvailability.value[selectedDay.value].slots[index].start = value;
};

const updateSlotEnd = (index: number, value: string) => {
  dayAvailability.value[selectedDay.value].slots[index].end = value;
};

const addSlot = () => {
  dayAvailability.value[selectedDay.value].slots.push({
    start: '09:00',
    end: '17:00',
  });
};

const removeSlot = (index: number) => {
  dayAvailability.value[selectedDay.value].slots.splice(index, 1);
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const saveAvailability = () => {
  // TODO: Send availability data to backend API
  showSuccessMessage.value = true;
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
};

const resetChanges = () => {
  dayAvailability.value = {
    Monday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    Tuesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    Wednesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    Thursday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    Friday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    Saturday: { enabled: false, slots: [{ start: '10:00', end: '14:00' }] },
    Sunday: { enabled: false, slots: [] },
  };
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
