<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Pricing Management</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Manage your mentoring session rates and pricing tiers
      </p>
    </div>

    <!-- Mentor Profile Card -->
    <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
      <div class="flex items-center gap-6">
        <div
          class="w-24 h-24 rounded-full bg-white flex items-center justify-center font-bold text-4xl text-orange-600"
        >
          JS
        </div>
        <div class="flex-1">
          <h2 class="text-3xl font-bold">Jane Smith</h2>
          <p class="text-orange-100 mt-1">Full-Stack Developer & Vue/Nuxt Mentor</p>
          <div class="flex gap-6 mt-4">
            <div>
              <p class="text-orange-100 text-sm">Rating</p>
              <p class="font-bold text-xl">4.8/5</p>
            </div>
            <div>
              <p class="text-orange-100 text-sm">Sessions Completed</p>
              <p class="font-bold text-xl">342</p>
            </div>
            <div>
              <p class="text-orange-100 text-sm">Monthly Earnings</p>
              <p class="font-bold text-xl">$12,450</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Base Rate -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <h3 class="font-semibold text-gray-600 dark:text-gray-400 mb-2">Base Hourly Rate</h3>
        <p class="text-4xl font-bold text-orange-600 dark:text-orange-400">$75</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Standard 1-hour session</p>
      </div>

      <!-- Total Revenue This Month -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <h3 class="font-semibold text-gray-600 dark:text-gray-400 mb-2">Revenue (This Month)</h3>
        <p class="text-4xl font-bold text-green-600 dark:text-green-400">$12,450</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">166 hours booked</p>
      </div>

      <!-- Average Session Value -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <h3 class="font-semibold text-gray-600 dark:text-gray-400 mb-2">Avg Session Value</h3>
        <p class="text-4xl font-bold text-blue-600 dark:text-blue-400">$89</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Including package discounts</p>
      </div>
    </div>

    <!-- Pricing Tiers -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Pricing Packages</h2>
        <button
          @click="editingTier = editingTier ? null : -1"
          class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          {{ editingTier !== null ? 'Cancel' : 'Edit Pricing' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="(tier, index) in pricingTiers"
          :key="index"
          :class="[
            'p-6 rounded-lg border-2 transition',
            editingTier === index
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800',
          ]"
        >
          <div v-if="editingTier !== index" class="space-y-3">
            <h3 class="font-bold text-lg">{{ tier.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ tier.duration }}</p>
            <div class="border-t border-gray-300 dark:border-gray-600 pt-3">
              <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">
                ${{ tier.price }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ tier.pricePerHour }}/hour
              </p>
            </div>
            <div class="space-y-2">
              <p class="text-sm">
                <span class="font-semibold">Discount:</span> {{ tier.discount }}
              </p>
              <p class="text-sm">
                <span class="font-semibold">Sessions/Month:</span> {{ tier.avgSessions }}
              </p>
            </div>
            <button
              @click="startEditTier(index)"
              class="w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm font-medium"
            >
              Edit
            </button>
          </div>

          <div v-else class="space-y-3">
            <input
              v-model="tier.name"
              type="text"
              placeholder="Tier name"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              v-model.number="tier.price"
              type="number"
              placeholder="Price"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              v-model="tier.duration"
              type="text"
              placeholder="Duration"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              v-model="tier.discount"
              type="text"
              placeholder="Discount"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              @click="saveTier(index)"
              class="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Discounts -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Bulk Discounts</h2>
        <button
          @click="editingDiscounts = !editingDiscounts"
          class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
        >
          {{ editingDiscounts ? 'Done' : 'Edit' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="(discount, index) in bulkDiscounts"
          :key="index"
          :class="[
            'p-4 rounded-lg border transition',
            editingDiscounts
              ? 'border-orange-300 dark:border-orange-700'
              : 'border-gray-200 dark:border-gray-700',
          ]"
        >
          <div v-if="!editingDiscounts" class="space-y-2">
            <p class="font-semibold">{{ discount.sessions }} Sessions</p>
            <p class="text-lg font-bold text-orange-600 dark:text-orange-400">
              {{ discount.discount }}% OFF
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Save ${{ discount.savings }}</p>
          </div>
          <div v-else class="space-y-2">
            <input
              v-model.number="discount.sessions"
              type="number"
              placeholder="Sessions"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              v-model.number="discount.discount"
              type="number"
              placeholder="Discount %"
              class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
    >
      <h2 class="text-2xl font-bold mb-6">Payment Methods</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl"
            >
              $
            </div>
            <div>
              <p class="font-semibold">Bank Account</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">****1234</p>
            </div>
          </div>
          <span class="text-green-600 dark:text-green-400 font-semibold">Active</span>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold"
            >
              P
            </div>
            <div>
              <p class="font-semibold">PayPal</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">jane.smith@email.com</p>
            </div>
          </div>
          <button
            class="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            Remove
          </button>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold"
            >
              S
            </div>
            <div>
              <p class="font-semibold">Stripe</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">****5678</p>
            </div>
          </div>
          <span class="text-green-600 dark:text-green-400 font-semibold">Active</span>
        </div>
      </div>
    </div>

    <!-- Pricing History -->
    <div
      class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
    >
      <h2 class="text-2xl font-bold mb-6">Pricing History</h2>
      <div class="space-y-3">
        <div
          v-for="(history, index) in pricingHistory"
          :key="index"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div>
            <p class="font-semibold">{{ history.change }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ history.date }}</p>
          </div>
          <div class="text-right">
            <p
              :class="[
                'font-bold',
                history.type === 'increase'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-blue-600 dark:text-blue-400',
              ]"
            >
              {{ history.type === 'increase' ? '+' : '' }}${{ history.amount }}/hr
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ history.reason }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex gap-4 justify-end">
      <button
        class="px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
      >
        Cancel Changes
      </button>
      <button
        class="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium shadow-sm"
      >
        Save All Changes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'dashboard',
});

interface PricingTier {
  name: string;
  duration: string;
  price: number;
  pricePerHour: string;
  discount: string;
  avgSessions: string;
}

interface BulkDiscount {
  sessions: number;
  discount: number;
  savings: number;
}

interface PricingHistoryItem {
  change: string;
  date: string;
  type: string;
  amount: number;
  reason: string;
}

const editingTier = ref<number | null>(null);
const editingDiscounts = ref(false);

const pricingTiers = ref<PricingTier[]>([
  {
    name: 'Quick Chat',
    duration: '30 minutes',
    price: 45,
    pricePerHour: '$90',
    discount: 'None',
    avgSessions: '8-12/month',
  },
  {
    name: 'Standard',
    duration: '1 hour',
    price: 75,
    pricePerHour: '$75',
    discount: 'None',
    avgSessions: '15-20/month',
  },
  {
    name: 'Extended',
    duration: '90 minutes',
    price: 105,
    pricePerHour: '$70',
    discount: '7% off',
    avgSessions: '5-8/month',
  },
  {
    name: 'Deep Dive',
    duration: '2 hours',
    price: 130,
    pricePerHour: '$65',
    discount: '13% off',
    avgSessions: '3-5/month',
  },
]);

const bulkDiscounts = ref<BulkDiscount[]>([
  { sessions: 5, discount: 5, savings: 19 },
  { sessions: 10, discount: 10, savings: 75 },
  { sessions: 20, discount: 15, savings: 225 },
]);

const pricingHistory = ref<PricingHistoryItem[]>([
  {
    change: 'Increased base rate',
    date: 'Oct 15, 2024',
    type: 'increase',
    amount: 5,
    reason: 'Due to high demand',
  },
  {
    change: 'Added Deep Dive package',
    date: 'Sep 28, 2024',
    type: 'add',
    amount: 130,
    reason: 'New service offering',
  },
  {
    change: 'Updated bulk discounts',
    date: 'Sep 1, 2024',
    type: 'update',
    amount: 10,
    reason: 'Incentivize bulk bookings',
  },
  {
    change: 'Reduced rate temporarily',
    date: 'Aug 10, 2024',
    type: 'decrease',
    amount: -10,
    reason: 'Promotional offer',
  },
]);

const startEditTier = (index: number) => {
  editingTier.value = index;
};

const saveTier = (index: number) => {
  editingTier.value = null;
};
</script>
