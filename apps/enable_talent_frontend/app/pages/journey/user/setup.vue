<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4"
  >
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          to="/signup"
          class="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
        >
          ← Back to Signup
        </NuxtLink>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Profile</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Tell us about yourself so we can find the perfect mentors for you.
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >Step {{ currentStep }} of {{ totalSteps }}</span
          >
          <span class="text-sm font-semibold text-blue-600 dark:text-blue-400"
            >{{ Math.round((currentStep / totalSteps) * 100) }}%</span
          >
        </div>
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            :style="{ width: (currentStep / totalSteps) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- Steps Container -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <!-- Step 1: Personal Info -->
        <div v-show="currentStep === 1" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Current Role</label
            >
            <input
              v-model="formData.currentRole"
              type="text"
              placeholder="e.g., Junior Developer, Product Manager, Startup Founder"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Years of Experience</label
            >
            <select
              v-model="formData.experience"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your experience level</option>
              <option value="0-1">0-1 years (Just starting)</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Location</label
            >
            <input
              v-model="formData.location"
              type="text"
              placeholder="City, Country"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Step 2: Career Goals -->
        <div v-show="currentStep === 2" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >What are your career goals?</label
            >
            <textarea
              v-model="formData.goals"
              rows="4"
              placeholder="Tell us what you want to achieve in your career. What skills do you want to develop?"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3"
              >Areas of Interest</label
            >
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Select topics you're interested in learning about
            </p>
            <div class="space-y-2">
              <label
                class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  v-model="formData.interests"
                  value="Technical Skills"
                  class="w-4 h-4"
                />
                <span class="text-gray-900 dark:text-white font-medium">Technical Skills</span>
              </label>
              <label
                class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  v-model="formData.interests"
                  value="Career Strategy"
                  class="w-4 h-4"
                />
                <span class="text-gray-900 dark:text-white font-medium">Career Strategy</span>
              </label>
              <label
                class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  v-model="formData.interests"
                  value="Leadership"
                  class="w-4 h-4"
                />
                <span class="text-gray-900 dark:text-white font-medium"
                  >Leadership & Management</span
                >
              </label>
              <label
                class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  v-model="formData.interests"
                  value="Entrepreneurship"
                  class="w-4 h-4"
                />
                <span class="text-gray-900 dark:text-white font-medium">Entrepreneurship</span>
              </label>
              <label
                class="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  v-model="formData.interests"
                  value="Work-Life Balance"
                  class="w-4 h-4"
                />
                <span class="text-gray-900 dark:text-white font-medium">Work-Life Balance</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 3: Skills & Learning -->
        <div v-show="currentStep === 3" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Skills you want to learn</label
            >
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Add skills you'd like to develop (press Enter to add)
            </p>
            <div class="flex gap-2 mb-3">
              <input
                v-model="skillInput"
                @keypress.enter="addSkill"
                type="text"
                placeholder="e.g., React, Project Management, Public Speaking"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                @click="addSkill"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                Add
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(skill, idx) in formData.skills"
                :key="idx"
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
              >
                {{ skill }}
                <button
                  @click="removeSkill(idx)"
                  class="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                >
                  ✕
                </button>
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Learning Style</label
            >
            <select
              v-model="formData.learningStyle"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">How do you prefer to learn?</option>
              <option value="1-on-1">One-on-one mentoring</option>
              <option value="structured">Structured courses</option>
              <option value="discussion">Discussion & feedback</option>
              <option value="practical">Hands-on projects</option>
            </select>
          </div>
        </div>

        <!-- Step 4: Preferences -->
        <div v-show="currentStep === 4" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Time Zone</label
            >
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

          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >Budget per session</label
            >
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

          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3"
              >Preferred session frequency</label
            >
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

        <!-- Step 5: Confirmation -->
        <div v-show="currentStep === 5" class="space-y-6">
          <div
            class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6"
          >
            <h3 class="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
              Review Your Profile
            </h3>

            <div class="space-y-4 text-sm">
              <div>
                <p class="text-blue-800 dark:text-blue-200 font-semibold">Current Role</p>
                <p class="text-blue-700 dark:text-blue-300">{{ formData.currentRole }}</p>
              </div>
              <div>
                <p class="text-blue-800 dark:text-blue-200 font-semibold">Goals</p>
                <p class="text-blue-700 dark:text-blue-300">
                  {{ formData.goals.substring(0, 150)
                  }}{{ formData.goals.length > 150 ? '...' : '' }}
                </p>
              </div>
              <div>
                <p class="text-blue-800 dark:text-blue-200 font-semibold">Skills to Learn</p>
                <p class="text-blue-700 dark:text-blue-300">{{ formData.skills.join(', ') }}</p>
              </div>
              <div>
                <p class="text-blue-800 dark:text-blue-200 font-semibold">Learning Style</p>
                <p class="text-blue-700 dark:text-blue-300">{{ formData.learningStyle }}</p>
              </div>
              <div>
                <p class="text-blue-800 dark:text-blue-200 font-semibold">Frequency</p>
                <p class="text-blue-700 dark:text-blue-300">{{ formData.frequency }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6"
          >
            <h3 class="font-bold text-green-900 dark:text-green-100 mb-2">You're all set! 🎉</h3>
            <p class="text-green-700 dark:text-green-300">
              Your profile is complete. We'll now match you with mentors who can help you achieve
              your goals. Let's find your perfect mentor!
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
            class="ml-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            Continue
          </button>

          <button
            v-else
            @click="completeSetup"
            class="ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            Find My Mentors
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

const formData = reactive({
  currentRole: '',
  experience: '',
  location: '',
  goals: '',
  interests: [] as string[],
  skills: [] as string[],
  learningStyle: '',
  timezone: '',
  budget: '',
  frequency: '',
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
  // TODO: Save user profile data to backend
  console.log('Setup complete:', formData);
  // Redirect to dashboard
  await router.push('/dashboard');
};
</script>
