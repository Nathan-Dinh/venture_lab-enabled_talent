<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

      <!-- Error message -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
      >
        {{ error }}
      </div>

      <form @submit.prevent="handleSignup" class="space-y-5">
        <div>
          <Label>Register as</Label>
          <div class="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              class="flex-1"
              :class="
                role === 'user' ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold' : ''
              "
              @click="role = 'user'"
            >
              User
            </Button>
            <Button
              type="button"
              variant="outline"
              class="flex-1"
              :class="
                role === 'mentor' ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold' : ''
              "
              @click="role = 'mentor'"
            >
              Mentor
            </Button>
          </div>
        </div>

        <div>
          <Label for="name">Full Name</Label>
          <Input id="name" type="text" placeholder="Jane Doe" v-model="name" required />
          <p v-if="nameState === 'invalid'" class="text-red-500 text-sm mt-1">{{ nameErrMsg }}</p>
        </div>

        <div>
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" v-model="email" required />
          <p v-if="emailState === 'invalid'" class="text-red-500 text-sm mt-1">{{ emailErrMsg }}</p>
        </div>

        <div>
          <Label for="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" v-model="password" required />
          <p v-if="passwordState === 'invalid'" class="text-red-500 text-sm mt-1">
            {{ passwordErrMsg }}
          </p>
        </div>
        <div v-if="role === 'mentor'" class="space-y-4"></div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="w-full bg-blue-600 text-white hover:bg-blue-700"
          :disabled="!formState || isLoading"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </Button>

        <!-- Login Link -->
        <p class="text-center text-sm text-gray-600 mt-4">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-600 hover:underline">Login</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const store = useSignUpJourneyStore();

const name = ref('');
const email = ref('');
const password = ref('');
const nameErrMsg = ref('');
const emailErrMsg = ref('');
const passwordErrMsg = ref('');
const role = ref<'user' | 'mentor'>('user');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const nameState = computed<'valid' | 'invalid' | ''>(() => {
  if (name.value === '') return '';
  return name.value ? 'valid' : 'invalid';
});

const emailState = computed<'valid' | 'invalid' | ''>(() => {
  if (email.value === '') return '';
  if (!emailRegex.test(email.value)) {
    emailErrMsg.value = 'Please enter a valid email address.';
    return 'invalid';
  }
  return 'valid';
});

const passwordState = computed<'valid' | 'invalid' | ''>(() => {
  if (password.value === '') return '';
  if (password.value.length < 8) {
    passwordErrMsg.value = 'Password must be at least 8 characters long.';
    return 'invalid';
  }
  if (!/[A-Za-z]/.test(password.value)) {
    passwordErrMsg.value = 'Password must include at least one letter.';
    return 'invalid';
  }
  if (!/\d/.test(password.value)) {
    passwordErrMsg.value = 'Password must include at least one number.';
    return 'invalid';
  }
  if (!/[A-Z]/.test(password.value)) {
    passwordErrMsg.value = 'Password must include at least one captilized letter.';
    return 'invalid';
  }
  return 'valid';
});

const formState = computed(() => {
  if (
    nameState.value === 'valid' &&
    emailState.value === 'valid' &&
    passwordState.value === 'valid'
  )
    return true;
  else return false;
});

const isLoading = ref(false);
const error = ref('');

const handleSignup = () => {
  isLoading.value = true;

  if (formState.value) {
    if (role.value === 'mentor') {
      store.type = 'mentor';
      store.name = 'John Doe';
      store.email = 'john@example.com';
      store.pass = 'password123';
      navigateTo('/journey/setup/mentor');
    } else {
      navigateTo('/journey/setup/user');
    }
  }

  isLoading.value = false;
};
</script>
