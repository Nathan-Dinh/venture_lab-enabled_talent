<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold">Book a Mentor</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Find and book your perfect mentor for a 1-on-1 session
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Booking Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Step 1: Select Mentor -->
          <div
            class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold"
              >
                1
              </div>
              <h2 class="text-xl font-semibold">Select Mentor</h2>
            </div>

            <div class="space-y-3">
              <div
                v-for="mentor in availableMentors"
                :key="mentor.id"
                @click="selectMentor(mentor)"
                :class="[
                  'p-4 rounded-lg border-2 cursor-pointer transition-all',
                  selectedMentor?.id === mentor.id
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                ]"
              >
                <div class="flex items-start gap-4">
                  <img
                    :src="mentor.avatar"
                    :alt="mentor.name"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex-1">
                    <h3 class="font-semibold">{{ mentor.name }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ mentor.role }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-sm font-medium">{{ mentor.rating }}</span>
                      <span class="text-sm text-gray-500 dark:text-gray-400"
                        >({{ mentor.reviews }} reviews)</span
                      >
                      <span class="text-sm font-medium text-orange-500"
                        >${{ mentor.hourlyRate }}/hr</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Select Date & Time -->
          <div
            v-if="selectedMentor"
            class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold"
              >
                2
              </div>
              <h2 class="text-xl font-semibold">Choose Date & Time</h2>
            </div>

            <!-- Date Picker -->
            <div class="mb-6">
              <label class="block text-sm font-semibold mb-3">Preferred Date</label>
              <input
                v-model="selectedDate"
                type="date"
                :min="minDate"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <!-- Available Time Slots -->
            <div v-if="selectedDate">
              <label class="block text-sm font-semibold mb-3">Available Time Slots</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  v-for="slot in availableTimeSlots"
                  :key="slot"
                  @click="selectedTime = slot"
                  :class="[
                    'py-2 px-3 rounded-lg border-2 font-medium transition-all text-sm',
                    selectedTime === slot
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500',
                  ]"
                >
                  {{ slot }}
                </button>
              </div>
              <p
                v-if="availableTimeSlots.length === 0"
                class="text-sm text-gray-500 dark:text-gray-400 mt-3"
              >
                No available time slots for this date. Please select another date.
              </p>
            </div>
          </div>

          <!-- Step 3: Session Details -->
          <div
            v-if="selectedMentor && selectedDate && selectedTime"
            class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold"
              >
                3
              </div>
              <h2 class="text-xl font-semibold">Session Details</h2>
            </div>

            <div class="space-y-4">
              <!-- Session Topic -->
              <div>
                <label class="block text-sm font-semibold mb-2">Topic (Optional)</label>
                <input
                  v-model="sessionTopic"
                  type="text"
                  placeholder="e.g., Vue 3 Composition API, React Hooks, etc."
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <!-- Session Duration -->
              <div>
                <label class="block text-sm font-semibold mb-2">Duration</label>
                <select
                  v-model.number="sessionDuration"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option :value="30">30 minutes</option>
                  <option :value="60">1 hour</option>
                  <option :value="90">1.5 hours</option>
                  <option :value="120">2 hours</option>
                </select>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-semibold mb-2">Notes for Mentor</label>
                <textarea
                  v-model="sessionNotes"
                  placeholder="Share any specific topics, challenges, or background information..."
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <!-- Preferred Communication -->
              <div>
                <label class="block text-sm font-semibold mb-3">Preferred Communication</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      v-model="communicationMethod"
                      type="radio"
                      value="video"
                      class="w-4 h-4"
                    />
                    <span class="text-sm">Video Call</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      v-model="communicationMethod"
                      type="radio"
                      value="voice"
                      class="w-4 h-4"
                    />
                    <span class="text-sm">Voice Call</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      v-model="communicationMethod"
                      type="radio"
                      value="chat"
                      class="w-4 h-4"
                    />
                    <span class="text-sm">Text Chat</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Summary Sidebar -->
        <div class="lg:col-span-1">
          <div
            class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-6"
          >
            <h3 class="text-lg font-semibold mb-6">Booking Summary</h3>

            <div v-if="!selectedMentor" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                Select a mentor to see booking details
              </p>
            </div>

            <div v-else class="space-y-4">
              <!-- Mentor Summary -->
              <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
                <h4 class="font-semibold text-sm mb-2">{{ selectedMentor.name }}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ selectedMentor.role }}</p>
              </div>

              <!-- Date & Time -->
              <div v-if="selectedDate && selectedTime" class="space-y-3">
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Date</p>
                  <p class="font-semibold">{{ formatDate(selectedDate) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Time</p>
                  <p class="font-semibold">{{ selectedTime }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                  <p class="font-semibold">{{ sessionDuration }} minutes</p>
                </div>
              </div>

              <!-- Price Calculation -->
              <div
                v-if="selectedDate && selectedTime"
                class="py-4 border-t border-gray-200 dark:border-gray-700 space-y-2"
              >
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Rate</span>
                  <span>${{ selectedMentor.hourlyRate }}/hr</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Duration</span>
                  <span>{{ (sessionDuration / 60).toFixed(1) }} hours</span>
                </div>
                <div
                  class="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700"
                >
                  <span>Total</span>
                  <span class="text-orange-600 dark:text-orange-400"
                    >${{ totalPrice.toFixed(2) }}</span
                  >
                </div>
              </div>

              <!-- Book Button -->
              <button
                @click="confirmBooking"
                :disabled="!canBook"
                :class="[
                  'w-full py-3 rounded-lg font-semibold transition-colors',
                  canBook
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50',
                ]"
              >
                Confirm Booking
              </button>

              <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                You will receive a confirmation email with meeting details
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <transition name="modal">
        <div
          v-if="showConfirmation"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div class="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-8 text-center">
            <div
              class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-2">Booking Confirmed!</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Your session with {{ selectedMentor?.name }} is booked for
              {{ formatDate(selectedDate) }} at {{ selectedTime }}
            </p>
            <button
              @click="resetBooking"
              class="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'dashboard',
});

interface Mentor {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  availability: Record<string, string[]>; // day -> array of time slots
}

const availableMentors: Mentor[] = [
  {
    id: 1,
    name: 'Jane Smith',
    role: 'Full-Stack Developer & Vue/Nuxt Mentor',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.8,
    reviews: 120,
    hourlyRate: 75,
    availability: {
      Monday: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      Tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      Wednesday: ['10:00', '11:00', '14:00', '15:00'],
      Thursday: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      Friday: ['09:00', '10:00', '11:00', '15:00', '16:00'],
    },
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Backend Engineer & Node.js Specialist',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.9,
    reviews: 156,
    hourlyRate: 85,
    availability: {
      Monday: ['14:00', '15:00', '16:00'],
      Wednesday: ['09:00', '10:00', '11:00', '15:00'],
      Thursday: ['09:00', '10:00', '14:00', '15:00'],
      Friday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
    },
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Product Designer & UI/UX Expert',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 4.7,
    reviews: 98,
    hourlyRate: 65,
    availability: {
      Tuesday: ['10:00', '11:00', '14:00', '15:00'],
      Wednesday: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      Thursday: ['10:00', '11:00', '14:00', '15:00'],
      Friday: ['09:00', '10:00', '11:00', '15:00', '16:00'],
    },
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'DevOps Engineer & Cloud Architect',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    rating: 4.6,
    reviews: 87,
    hourlyRate: 80,
    availability: {
      Monday: ['09:00', '10:00', '11:00', '15:00'],
      Tuesday: ['14:00', '15:00', '16:00'],
      Wednesday: ['09:00', '10:00', '14:00', '15:00'],
      Thursday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
      Friday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    },
  },
];

const selectedMentor = ref<Mentor | null>(null);
const selectedDate = ref('');
const selectedTime = ref('');
const sessionTopic = ref('');
const sessionDuration = ref(60);
const sessionNotes = ref('');
const communicationMethod = ref('video');
const showConfirmation = ref(false);

const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
});

const getDayName = (dateString: string) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString);
  return days[date.getDay()];
};

const availableTimeSlots = computed(() => {
  if (!selectedMentor.value || !selectedDate.value) return [];
  const dayName = getDayName(selectedDate.value);
  return selectedMentor.value.availability[dayName] || [];
});

const totalPrice = computed(() => {
  if (!selectedMentor.value) return 0;
  return (sessionDuration.value / 60) * selectedMentor.value.hourlyRate;
});

const canBook = computed(() => {
  return selectedMentor.value && selectedDate.value && selectedTime.value;
});

const selectMentor = (mentor: Mentor) => {
  selectedMentor.value = mentor;
  selectedDate.value = '';
  selectedTime.value = '';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const confirmBooking = () => {
  if (!canBook.value) return;

  // TODO: Send booking confirmation to backend API
  showConfirmation.value = true;
};

const resetBooking = () => {
  showConfirmation.value = false;
  selectedMentor.value = null;
  selectedDate.value = '';
  selectedTime.value = '';
  sessionTopic.value = '';
  sessionDuration.value = 60;
  sessionNotes.value = '';
  communicationMethod.value = 'video';
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
