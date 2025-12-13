// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',

  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],

  devtools: {
    enabled: false
  },

  ssr: false,

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  }
})
