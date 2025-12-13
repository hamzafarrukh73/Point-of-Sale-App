<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()
const { getUser: user } = storeToRefs(authStore)

const items = computed<NavigationMenuItem[]>(() => [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-fa-home' },
  { label: 'Categories', to: '/categories', icon: 'i-fa-folder' },
  { label: 'Products', to: '/products', icon: 'i-fa-folder-open' },
  { label: 'Inventory', to: '/inventory', icon: 'i-fa-cubes' },
  { label: 'Checkout', to: '/checkout', icon: 'i-fa-shopping-cart' },
  { label: 'Sales Log', to: '/sales', icon: 'i-fa-history' },
  { label: 'Settings', to: 'http://localhost:8000/admin/', icon: 'i-fa-cog' }
])
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable>
      <template #header="{ collapsed }">
        <h3 v-if="!collapsed" class="font-bold">POS System</h3>
        <h3 v-else class="font-bold">PS</h3>
      </template>
      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="items"
          orientation="vertical"
          tooltip
          popover
        />
      </template>
      <template #footer="{ collapsed }">
        <UContainer>
          <UUser :label="user.username" />
        </UContainer>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar mode="slideover" toggleSide="left" :menu="{ side: 'left' }">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
          <template #title>
            <h3 class="font-bold lg:hidden">POS System</h3>
          </template>

          <template #right>
            <UDashboardSearchButton collapsed />
            <UDashboardSearch />
            <UColorModeButton />
          </template>

          <template #body>
            <UNavigationMenu :items="items" orientation="vertical" variant="pill" />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
      <!-- <template #footer>
                <h3 class="font-bold ">POS System</h3>
            </template> -->
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<style scoped></style>
