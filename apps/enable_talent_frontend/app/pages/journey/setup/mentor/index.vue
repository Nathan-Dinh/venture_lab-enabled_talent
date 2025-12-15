<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4"
  >
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          to="/signup"
          class="inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mb-4"
        >
          ← Back to Signup
        </NuxtLink>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Complete Your Mentor Profile
        </h1>
        <p class="text-gray-600 dark:text-gray-400">Let's get you set up as a mentor.</p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <JourneySetupProgressBar
          :currentStep="currentStep"
          :totalSteps="totalSteps"
          :steps="['Professional Info', 'Skills', 'Pricing', 'Availability', 'Review']"
        />
      </div>

      <!-- Steps Container -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <!-- Step 1: Professional Info -->
        <div v-show="currentStep === 1" class="space-y-6">
          <JourneySetupMentorProfessionalInfo :form-data="formData" />
        </div>

        <!-- Step 2: Skills -->
        <div v-show="currentStep === 2" class="space-y-6">
          <JourneySetupMentorSkills :form-data="formData" />
        </div>

        <!-- Step 3: Pricing -->
        <div v-show="currentStep === 3" class="space-y-6">
          <JourneySetupMentorPricing :form-data="formData" />
        </div>

        <!-- Step 4: Availability -->
        <div v-show="currentStep === 4" class="space-y-6">
          <JourneySetupMentorAvailability :form-data="formData" />
        </div>

        <!-- Step 5: Confirmation -->
        <div v-show="currentStep === 5" class="space-y-6">
          <JourneySetupMentorReview :form-data="formData" />
        </div>

        <!-- Navigation Buttons -->
        <div class="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            v-if="currentStep > 1"
            @click="previousStep"
            class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
          >
            Back
          </button>

          <button
            v-if="currentStep < totalSteps"
            @click="nextStep"
            class="ml-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            Continue
          </button>

          <button
            v-else
            @click="completeSetup"
            class="ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentStep = ref(1);
const totalSteps = 5;
const skillInput = ref('');

interface AvailabilitySlot {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface SessionTier {
  name: string;
  duration: number;
  rate: number;
}

const formData = reactive<{
  headline: string;
  experience: string;
  bio: string;
  skills: string[];
  expertise: string[];
  hourlyRate: number | null;
  tiers: SessionTier[];
  timezone: string;
  availability: Record<string, AvailabilitySlot>;
}>({
  headline: '',
  experience: '',
  bio: '',
  skills: [],
  expertise: [],
  hourlyRate: null,
  tiers: [
    { name: 'Quick Chat', duration: 30, rate: 25 },
    { name: '1-Hour Session', duration: 60, rate: 50 },
  ],
  timezone: '',
  availability: {
    monday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    wednesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    friday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    sunday: { enabled: false, startTime: '09:00', endTime: '17:00' },
  },
});

const addSkill = () => {
  if (skillInput.value.trim() && !formData.skills.includes(skillInput.value.trim())) {
    formData.skills.push(skillInput.value.trim());
    skillInput.value = '';
  }
};

const removeSkill = (index: number) => {
  formData.skills.splice(index, 1);
};

const addTier = () => {
  formData.tiers.push({ name: '', duration: 60, rate: 0 });
};

const removeTier = (index: number) => {
  formData.tiers.splice(index, 1);
};

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const completeSetup = async () => {
  await router.push('/dashboard');
};
</script>
