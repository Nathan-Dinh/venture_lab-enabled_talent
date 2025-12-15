<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950 gap-0 lg:gap-4 p-4 lg:p-6">
    <!-- Sidebar - Active Sessions -->
    <div
      class="hidden lg:flex lg:w-80 flex-col bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800"
    >
      <!-- Sidebar Header -->
      <div class="p-5 border-b border-gray-200 dark:border-gray-800">
        <h3 class="font-bold text-lg">Active Sessions</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ activeSessions.filter((s) => s.online).length }} mentors online
        </p>
      </div>

      <!-- Sessions List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <div
          v-for="mentor in activeSessions"
          :key="mentor.id"
          @click="selectMentor(mentor.name)"
          :class="[
            'p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md',
            selectedMentor === mentor.name
              ? 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-2 border-orange-500 shadow-md'
              : 'bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-gray-300 dark:hover:border-gray-700',
          ]"
        >
          <div class="flex items-center gap-3">
            <!-- Avatar -->
            <div class="relative">
              <div
                class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm"
              >
                {{ mentor.name.charAt(0) }}
              </div>
              <div
                v-if="mentor.online"
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
              ></div>
            </div>

            <!-- Session Info -->
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm truncate">{{ mentor.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ mentor.status }}</p>
            </div>

            <!-- Status Badge -->
            <div v-if="mentor.online" class="flex items-center gap-1">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div
      class="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <!-- Header -->
      <div
        class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Button -->
          <button class="lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          <!-- Mentor Info -->
          <div>
            <h2 class="text-xl font-bold">{{ selectedMentor }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Session in progress</p>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center gap-2">
          <button class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
          </button>
          <button class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages Container -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950"
      >
        <!-- Date Separator -->
        <div class="flex items-center gap-3 my-4">
          <div class="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
          <span class="text-xs text-gray-500 dark:text-gray-400 px-3">Today</span>
          <div class="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
        </div>

        <!-- Messages -->
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['flex gap-3', message.sender === 'you' ? 'justify-end' : 'justify-start']"
        >
          <!-- Mentor Avatar -->
          <div v-if="message.sender === 'mentor'" class="flex-shrink-0">
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm"
            >
              {{ selectedMentor.charAt(0) }}
            </div>
          </div>

          <!-- Message Bubble -->
          <div
            :class="[
              'max-w-sm px-4 py-3 rounded-2xl',
              message.sender === 'you'
                ? 'bg-orange-500 text-white rounded-br-none shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-700',
            ]"
          >
            <p class="text-sm leading-relaxed">{{ message.text }}</p>
            <p
              :class="[
                'text-xs mt-2 opacity-70',
                message.sender === 'you' ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400',
              ]"
            >
              {{ message.time }}
            </p>
          </div>

          <!-- You Avatar -->
          <div v-if="message.sender === 'you'" class="flex-shrink-0">
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm"
            >
              U
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex gap-3">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm"
            >
              {{ selectedMentor.charAt(0) }}
            </div>
          </div>
          <div
            class="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div class="flex gap-2">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0.1s"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0.2s"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div
        class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      >
        <div class="flex gap-3">
          <button
            class="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition text-gray-600 dark:text-gray-400"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
          </button>
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type your message..."
            @keyup.enter="sendMessage"
            class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          />
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim()"
            class="flex-shrink-0 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z"
              ></path>
            </svg>
          </button>
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

interface Message {
  sender: 'you' | 'mentor';
  text: string;
  time: string;
}

interface Session {
  id: number;
  name: string;
  status: string;
  online: boolean;
}

const { $apiRequestHandler } = useNuxtApp();
const selectedMentor = ref('');
const newMessage = ref('');
const isTyping = ref(false);
const isLoading = ref(true);
const error = ref('');

const messages = ref<Message[]>([
  {
    sender: 'mentor',
    text: 'Hi! Ready to start the session?',
    time: '10:30 AM',
  },
  {
    sender: 'you',
    text: 'Yes, I have some questions about Vue 3 composition API',
    time: '10:31 AM',
  },
  {
    sender: 'mentor',
    text: "Great! Let's dive in. What's your first question?",
    time: '10:32 AM',
  },
  {
    sender: 'you',
    text: 'How do I manage state with composables?',
    time: '10:33 AM',
  },
  {
    sender: 'mentor',
    text: 'Composables are functions that encapsulate reactive logic. You can create reusable state and methods...',
    time: '10:34 AM',
  },
]);

const activeSessions = ref<Session[]>([]);

/**
 * Fetch active sessions on component mount
 *
 * Backend API Call:
 * - Endpoint: GET /api/sessions
 * - Expected Response:
 *   {
 *     success: boolean,
 *     data: Array<{
 *       id: number,
 *       name: string,
 *       status: string,
 *       online: boolean
 *     }>
 *   }
 *
 * TODO: Implement real-time session updates
 * TODO: Add session filtering
 */
onMounted(async () => {
  try {
    // BUG FIX: Added .base() to properly call the API handler
    const res = await $apiRequestHandler('/api/sessions').base().get();

    if (res.error) {
      error.value = 'Failed to load sessions';
      // Use mock data as fallback
      activeSessions.value = [
        {
          id: 1,
          name: 'Jane Smith',
          status: 'Full-Stack Developer',
          online: true,
        },
        {
          id: 2,
          name: 'Michael Chen',
          status: 'Backend Engineer',
          online: true,
        },
      ];
      return;
    }

    if (res.data?.success && res.data?.data) {
      // Transform API data to match UI interface
      activeSessions.value = res.data.data.map((session: any) => ({
        id: session.session_id,
        name: session.mentor_name || 'Unknown',
        status: session.session_type || 'Session',
        online: session.session_status === 'active',
      }));

      // Set first session as selected if available
      if (activeSessions.value.length > 0) {
        selectedMentor.value = activeSessions.value[0].name;
      }
    }
  } catch (err) {
    error.value = 'Error loading sessions';
    // Provide mock data fallback
    activeSessions.value = [
      {
        id: 1,
        name: 'Jane Smith',
        status: 'Full-Stack Developer',
        online: true,
      },
    ];
  } finally {
    isLoading.value = false;
  }
});

const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  messages.value.push({
    sender: 'you',
    text: newMessage.value,
    time: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  });

  newMessage.value = '';

  // Simulate mentor typing and responding
  isTyping.value = true;
  setTimeout(() => {
    messages.value.push({
      sender: 'mentor',
      text: "That's a great question! Let me explain...",
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
    isTyping.value = false;
  }, 2000);
};

const selectMentor = (mentorName: string) => {
  selectedMentor.value = mentorName;
  messages.value = [
    {
      sender: 'mentor',
      text: `Hi! I'm ${mentorName}. How can I help you today?`,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ];
};
</script>
