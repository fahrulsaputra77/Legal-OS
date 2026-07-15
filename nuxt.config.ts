import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  components: [
    {
      path: '~/components/ui',
      extensions: ['.vue'],
      prefix: ''
    }
  ],
  devtools: { enabled: false },
  compatibilityDate: '2024-04-03',
})