<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'POS System'
const description = ''

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
  //   ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  //   twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  //   twitterCard: 'summary_large_image'
})

const toaster = { position: 'top-center', duration: 2000 } as const
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
