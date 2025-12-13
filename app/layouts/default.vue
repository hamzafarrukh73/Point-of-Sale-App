<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = computed<NavigationMenuItem[]>(() => [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-fa-home' },
  { label: 'Products', to: '/products', icon: 'i-fa-folder-open' },
  { label: 'Inventory', to: '/inventory', icon: 'i-fa-cubes' },
  { label: 'Checkout', to: '/checkout', icon: 'i-fa-shopping-cart' },
  { label: 'History', to: '/history', icon: 'i-fa-history' },
  { label: 'Settings', to: '/dashboard', icon: 'i-fa-cog' }
])
</script>

<template>
  <UHeader mode="slideover" toggleSide="left" :menu="{ side: 'left' }">
    <template #title>
      <h3 class="font-bold">POS System</h3>
    </template>

    <template #default> </template>

    <template #right>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" variant="pill" />
    </template>
  </UHeader>

  <UMain>
    <slot />
  </UMain>
</template>
