<template>
  <div class="space-y-6">
    <!-- Review Summary -->
    <div
      class="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-6"
    >
      <h3 class="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4">
        Review Your Profile
      </h3>

      <div class="space-y-4 text-sm">
        <!-- Professional Info -->
        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Headline</p>
          <p class="text-orange-700 dark:text-orange-300">{{ formData.headline }}</p>
        </div>

        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Experience</p>
          <p class="text-orange-700 dark:text-orange-300">{{ formData.experience }}</p>
        </div>

        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Bio</p>
          <p class="text-orange-700 dark:text-orange-300">{{ formData.bio }}</p>
        </div>

        <!-- Skills -->
        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Skills</p>
          <p class="text-orange-700 dark:text-orange-300">
            {{ formData.skills.join(', ') || 'No skills added' }}
          </p>
        </div>

        <!-- Pricing -->
        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Hourly Rate</p>
          <p class="text-orange-700 dark:text-orange-300">
            {{ formData.hourlyRate ? `$${formData.hourlyRate}/hr` : 'Not set' }}
          </p>
        </div>

        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Session Tiers</p>
          <div class="text-orange-700 dark:text-orange-300 space-y-1">
            <div v-for="(tier, idx) in formData.tiers" :key="idx" class="text-sm">
              <span class="font-medium">{{ tier.name }}</span> - {{ tier.duration }} min @ ${{
                tier.rate
              }}
            </div>
            <div v-if="formData.tiers.length === 0" class="text-sm italic">No tiers added</div>
          </div>
        </div>

        <!-- Availability -->
        <div>
          <p class="text-orange-800 dark:text-orange-200 font-semibold">Time Zone</p>
          <p class="text-orange-700 dark:text-orange-300">{{ formData.timezone || 'Not set' }}</p>
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

    <!-- Success Message -->
    <div
      class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6"
    >
      <h3 class="font-bold text-blue-900 dark:text-blue-100 mb-2">You're all set! 🎉</h3>
      <p class="text-blue-700 dark:text-blue-300">
        Your mentor profile is ready to go. You'll start appearing in our mentor directory and can
        begin receiving booking requests from mentees.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
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

interface MentorFormData {
  headline: string;
  experience: string;
  bio: string;
  skills: string[];
  expertise: string[];
  hourlyRate: number | null;
  tiers: SessionTier[];
  timezone: string;
  availability: Record<string, AvailabilitySlot>;
}

defineProps<{
  formData: MentorFormData;
}>();
</script>
