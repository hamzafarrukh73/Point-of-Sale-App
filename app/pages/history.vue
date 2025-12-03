<script setup>
const { data: orders, refresh } = await useFetch('http://localhost:8000/api/orders/')

const columns = [
  { key: 'token', label: 'Order ID' },
  { key: 'created_at', label: 'Date' },
  { key: 'total_amount', label: 'Total' },
  { key: 'items', label: 'Items' }
]

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div class="p-4 h-full flex flex-col gap-4">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Order History</h1>
        <UButton icon="i-heroicons-arrow-path" variant="ghost" @click="refresh" />
    </div>

    <div class="flex-grow overflow-auto">
      <UTable :rows="orders || []" :columns="columns">
        <template #created_at-data="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
        <template #total_amount-data="{ row }">
          ${{ row.total_amount }}
        </template>
        <template #items-data="{ row }">
          <div class="flex flex-col">
            <span v-for="item in row.items" :key="item.id" class="text-sm">
              {{ item.quantity }}x {{ item.product_name }}
            </span>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>