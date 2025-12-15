import { defineStore } from 'pinia';

export const useSignUpJourneyStore = defineStore('SignUpJourney', {
  state: () => ({
    type: '',
    name: '',
    email: '',
    password: '',
  }),
  actions: {
    resetSignUpJourney() {
      this.$reset();
    },
  },
});
