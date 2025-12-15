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
        <div class="flex justify-between mb-2">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >Step {{ currentStep }} of {{ totalSteps }}</span
          >
          <span class="text-sm font-semibold text-orange-600 dark:text-orange-400"
            >{{ Math.round((currentStep / totalSteps) * 100) }}%</span
          >
        </div>
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
            :style="{ width: (currentStep / totalSteps) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- Steps Container -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <!-- Step 1: Professional Info -->
        <div v-show="currentStep === 1" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Professional Headline</label
            >
            <input
              v-model="formData.headline"
              type="text"
              placeholder="e.g., Senior Software Engineer & Full Stack Developer"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              What's your job title and specialty?
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Years of Experience</label
            >
            <select
              v-model="formData.experience"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select experience level</option>
              <option value="1-2">1-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Bio</label
            >
            <textarea
              v-model="formData.bio"
              rows="4"
              placeholder="Tell mentees about yourself, your experience, and what you're passionate about teaching..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>

        <!-- Step 2: Skills -->
        <div v-show="currentStep === 2" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Key Skills</label
            >
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Add skills you can mentor in (press Enter to add)
            </p>
            <div class="flex gap-2 mb-3">
              <input
                v-model="skillInput"
                @keypress.enter="addSkill"
                type="text"
                placeholder="e.g., React, TypeScript, Node.js"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                @click="addSkill"
                class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
              >
                Add
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(skill, idx) in formData.skills"
                :key="idx"
                class="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm flex items-center gap-2"
              >
                {{ skill }}
                <button
                  @click="removeSkill(idx)"
                  class="text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-100"
                >
                  ✕
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Step 3: Pricing -->
        <div v-show="currentStep === 3" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Hourly Rate</label
            >
            <div class="flex items-center gap-2 mb-3">
              <span class="text-gray-600 dark:text-gray-400">$</span>
              <input
                v-model.number="formData.hourlyRate"
                type="number"
                placeholder="50"
                class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span class="text-gray-600 dark:text-gray-400">/hr</span>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-semibold text-gray-900 dark:text-white"
                >Session Tiers</label
              >
              <button
                @click="addTier"
                class="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition font-medium"
              >
                + Add Tier
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="(tier, idx) in formData.tiers"
                :key="idx"
                class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <div class="flex gap-3 mb-2">
                  <input
                    v-model="tier.name"
                    type="text"
                    placeholder="Tier name (e.g., Quick Chat)"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                  />
                  <input
                    v-model.number="tier.duration"
                    type="number"
                    placeholder="30"
                    class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                  />
                  <span class="text-gray-600 dark:text-gray-400 text-sm">min</span>
                </div>
                <div class="flex gap-2 items-center">
                  <span class="text-gray-600 dark:text-gray-400 text-sm">$</span>
                  <input
                    v-model.number="tier.rate"
                    type="number"
                    placeholder="25"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                  />
                  <button
                    v-if="formData.tiers.length > 1"
                    @click="removeTier(idx)"
                    class="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Availability -->
        <div v-show="currentStep === 4" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Time Zone</label
            >
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

          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3"
              >Available Days & Hours</label
            >
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

        <!-- Step 5: Confirmation -->
        <div v-show="currentStep === 5" class="space-y-6">
          <div
            class="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-6"
          >
            <h3 class="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4">
              Review Your Profile
            </h3>

            <div class="space-y-4 text-sm">
              <div>
                <p class="text-orange-800 dark:text-orange-200 font-semibold">Headline</p>
                <p class="text-orange-700 dark:text-orange-300">{{ formData.headline }}</p>
              </div>
              <div>
                <p class="text-orange-800 dark:text-orange-200 font-semibold">Skills</p>
                <p class="text-orange-700 dark:text-orange-300">
                  {{ formData.skills.join(', ') }}
                </p>
              </div>
              <div>
                <p class="text-orange-800 dark:text-orange-200 font-semibold">Hourly Rate</p>
                <p class="text-orange-700 dark:text-orange-300">${{ formData.hourlyRate }}/hr</p>
              </div>
              <div>
                <p class="text-orange-800 dark:text-orange-200 font-semibold">Session Tiers</p>
                <div class="text-orange-700 dark:text-orange-300 space-y-1">
                  <div v-for="(tier, idx) in formData.tiers" :key="idx" class="text-sm">
                    <span class="font-medium">{{ tier.name }}</span> - {{ tier.duration }} min @ ${{
                      tier.rate
                    }}
                  </div>
                </div>
              </div>
              <div>
                <p class="text-orange-800 dark:text-orange-200 font-semibold">Time Zone</p>
                <p class="text-orange-700 dark:text-orange-300">{{ formData.timezone }}</p>
              </div>
              <div>
                <p class="text-orange-800 dark:text-orange-200 font-semibold">Availability</p>
                <div class="text-orange-700 dark:text-orange-300 space-y-1">
                  <div
                    v-for="(dayData, day) in formData.availability"
                    :key="day"
                    v-show="dayData.enabled"
                    class="text-sm"
                  >
                    <span class="capitalize font-medium">{{ day }}:</span>
                    {{ dayData.startTime }} - {{ dayData.endTime }}
                  </div>
                  <div
                    v-if="!Object.values(formData.availability).some((d) => d.enabled)"
                    class="text-sm italic"
                  >
                    No availability set
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6"
          >
            <h3 class="font-bold text-blue-900 dark:text-blue-100 mb-2">You're all set! 🎉</h3>
            <p class="text-blue-700 dark:text-blue-300">
              Your mentor profile is ready to go. You'll start appearing in our mentor directory and
              can begin receiving booking requests from mentees.
            </p>
          </div>
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
  // TODO: Save mentor profile data to backend
  console.log('Setup complete:', formData);
  // Redirect to dashboard
  await router.push('/dashboard');
};
</script>
