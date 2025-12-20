<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Set Your Pricing</h3>
      <p class="text-gray-600 dark:text-gray-400">
        Configure your rates and create session packages for your mentees.
      </p>
    </div>

    <!-- Hourly Rate -->
    <div class="bg-orange-50 dark:bg-gray-700/50 border border-orange-200 dark:border-orange-900/50 rounded-xl p-6">
      <label class="block text-base font-semibold text-gray-900 dark:text-white mb-2">
        Base Hourly Rate
      </label>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        This is your standard rate for 1-on-1 mentoring sessions.
      </p>
      <div class="flex items-center gap-3">
        <span class="text-2xl font-bold text-gray-700 dark:text-gray-300">$</span>
        <input
          v-model.number="formData.hourlyRate"
          type="number"
          min="0"
          step="5"
          placeholder="50"
          class="w-32 px-4 py-3 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
        />
        <span class="text-lg text-gray-600 dark:text-gray-400">/hour</span>
      </div>
    </div>

    <!-- Session Tiers -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <div>
          <label class="block text-base font-semibold text-gray-900 dark:text-white mb-1">
            Session Packages
          </label>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Create different pricing tiers for various session lengths.
          </p>
        </div>
        <button
          @click="addTier"
          class="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Package
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="(tier, idx) in formData.tiers"
          :key="idx"
          class="p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Package Name
              </label>
              <input
                v-model="tier.name"
                type="text"
                placeholder="e.g., Quick Chat, Deep Dive, Career Strategy"
                class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              v-if="formData.tiers.length > 1"
              @click="removeTier(idx)"
              class="ml-3 mt-6 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              title="Remove package"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Duration
              </label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="tier.duration"
                  type="number"
                  min="15"
                  step="15"
                  placeholder="30"
                  class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <span class="text-sm text-gray-600 dark:text-gray-400">minutes</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Price
              </label>
              <div class="flex items-center gap-2">
                <span class="text-lg text-gray-600 dark:text-gray-400">$</span>
                <input
                  v-model.number="tier.rate"
                  type="number"
                  min="0"
                  step="5"
                  placeholder="25"
                  class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div
            v-if="tier.duration && tier.rate"
            class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
          >
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Effective rate:
              <span class="font-semibold text-orange-600 dark:text-orange-400">
                ${{ ((tier.rate / tier.duration) * 60).toFixed(2) }}/hour
              </span>
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="formData.tiers.length === 0"
        class="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        <p class="mb-2">No session packages yet.</p>
        <p class="text-sm">Click "Add Package" to create your first pricing tier.</p>
      </div>
    </div>

    <!-- Pricing Tips -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
      <div class="flex gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="text-sm text-blue-900 dark:text-blue-100">
          <p class="font-semibold mb-1">Pricing Tips</p>
          <ul class="space-y-1 text-blue-800 dark:text-blue-200">
            <li>• Research similar mentors in your field to stay competitive</li>
            <li>• Offer different packages to accommodate various budgets</li>
            <li>• Consider volume discounts for longer sessions</li>
            <li>• You can always adjust your rates later</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PricingTier {
  name: string;
  duration: number;
  rate: number;
}

interface PricingData {
  hourlyRate: number | null;
  tiers: PricingTier[];
}

const props = defineProps<{
  formData: PricingData;
}>();

// Two-way bound validation error model
const validationError = defineModel<string>('validationError', { default: '' });

const addTier = () => {
  props.formData.tiers.push({ name: '', duration: 60, rate: 0 });
};

const removeTier = (index: number) => {
  props.formData.tiers.splice(index, 1);
};

// Validation function
const validate = (): boolean => {
  validationError.value = '';

  if (!props.formData.hourlyRate || props.formData.hourlyRate <= 0) {
    validationError.value = 'Please set your hourly rate.';
    return false;
  }
  if (props.formData.tiers.length === 0) {
    validationError.value = 'Please add at least one session package.';
    return false;
  }

  for (let i = 0; i < props.formData.tiers.length; i++) {
    const tier = props.formData.tiers[i];
    if (!tier) continue;

    if (!tier.name.trim()) {
      validationError.value = `Please enter a name for package ${i + 1}.`;
      return false;
    }
    if (!tier.duration || tier.duration <= 0) {
      validationError.value = `Please set a duration for package "${tier.name}".`;
      return false;
    }
    if (!tier.rate || tier.rate <= 0) {
      validationError.value = `Please set a price for package "${tier.name}".`;
      return false;
    }
  }

  return true;
};

// Expose validate method to parent
defineExpose({ validate });

// Watch for changes to clear errors when user corrects input
watch(
  () => [props.formData.hourlyRate, props.formData.tiers.length, props.formData.tiers],
  () => {
    if (validationError.value) {
      validate();
    }
  },
  { deep: true }
);
</script>
