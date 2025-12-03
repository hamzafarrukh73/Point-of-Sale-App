// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/ui',
    'nuxt-charts'
  ],
  css: [
    '~/assets/css/main.css', 
    '~/assets/css/buttons.css'
  ],
  icon: {
    customCollections: [{
      prefix: 'assets',
      dir: './app/assets/icons'
    }]
  },
  imports: {
    dirs: ['stores']
  },
  ssr: false,
  router: {
    options: {
      hashMode: false,
    },
  },
  app: {
    baseURL: './',
  },
  nitro: {
    baseURL: './',
  },
})