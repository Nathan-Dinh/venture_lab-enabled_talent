import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  devServer: {
    port: 7005,
    host: '0.0.0.0',
  },
  modules: ['shadcn-nuxt', '@pinia/nuxt', '@nuxtjs/supabase'],
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8005',
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
