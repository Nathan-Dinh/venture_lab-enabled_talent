<template>
  <div class="space-y-6">
    <!-- Hourly Rate -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Hourly Rate
      </label>
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

    <!-- Session Tiers -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-semibold text-gray-900 dark:text-white">
          Session Tiers
        </label>
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
</template>

<script setup lang="ts">
interface SessionTier {
  name: string;
  duration: number;
  rate: number;
}

interface PricingData {
  hourlyRate: number | null;
  tiers: SessionTier[];
}

const props = defineProps<{
  formData: PricingData;
}>();

const addTier = () => {
  props.formData.tiers.push({ name: '', duration: 60, rate: 0 });
};

const removeTier = (index: number) => {
  props.formData.tiers.splice(index, 1);
};
</script>
