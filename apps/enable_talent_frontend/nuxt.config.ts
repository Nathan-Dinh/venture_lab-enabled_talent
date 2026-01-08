import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  devServer: {
    port: 7005,
    host: '0.0.0.0',
  },
  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:7001',
    public: {},
  },
  modules: ['@pinia/nuxt', 'shadcn-nuxt', '@nuxtjs/supabase'],
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/signup', '/login', '/api/**'], // Exclude public routes from auth checks
      cookieRedirect: false,
    },
  },
  nitro: {
    devProxy: {
      '/core/backend/api': {
        target: process.env.API_BASE_URL || 'http://localhost:7001',
        changeOrigin: true,
      },
    },
  },
  css: ['~/assets/css/tailwind.css'],
  imports: {
    dirs: ['composables/**'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
});

