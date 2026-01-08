import { createPinia, setActivePinia } from 'pinia';

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);
  setActivePinia(pinia);

  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      nuxtApp.payload.pinia = pinia.state.value;
    });
  } else if (nuxtApp.payload?.pinia) {
    pinia.state.value = nuxtApp.payload.pinia;
  }

  return {
    provide: {
      pinia,
    },
  };
});
