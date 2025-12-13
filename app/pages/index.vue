<script setup>
definePageMeta({
  layout: 'dash'
})

const salesStore = useSalesStore()
salesStore.fetchItems()

const { getItems: sales } = storeToRefs(salesStore)

// sales.filter( )
const salesData = [
  { id: 'card1', label: `Daily Sales`, value: 1000 },
  { id: 'card2', label: `Monthly Sales`, value: 30000 },
  { id: 'card3', label: `Annual Sales`, value: 360000 }
]

const tableData = [
  {
    token: '#4598',
    date: '2024-03-11',
    time: '10:10:00',
    amount: 276.0
  },
  {
    token: '#4599',
    date: '2024-04-10',
    time: '10:10:00',
    amount: 276.0
  },
  {
    token: '#4599',
    date: '2024-04-10',
    time: '10:10:00',
    amount: 276.0
  },
  {
    token: '#4599',
    date: '2024-04-10',
    time: '10:10:00',
    amount: 276.0
  },
  {
    token: '#4599',
    date: '2024-04-10',
    time: '10:10:00',
    amount: 276.0
  },
  {
    token: '#4599',
    date: '2024-04-10',
    time: '10:10:00',
    amount: 276.0
  }
]

const RevenueData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
]

const RevenueCategories = computed(() => ({
  desktop: {
    name: 'Desktop',
    color: '#22c55e'
  }
}))

const columnVisibility = ref({
  id: false,
  subtotal_amount: true,
  items: false,
  discount_amount: false,
  tax_amount: true,
  cashier_at_sale: false
})
</script>

<template>
  <UPage>
    <UPageHeader>
      <UPageGrid>
        <UPageCard
          :title="data.label"
          :description="data.value"
          variant="soft"
          class="col-span-1"
          v-for="data in salesData"
          :key="data.id"
          :id="data.id"
        />
      </UPageGrid>
    </UPageHeader>

    <UPageBody>
      <UPageGrid>
        <!-- <BarChart class="bg-elevated/50 ring ring-default rounded p-5 col-span-1 md:col-span-2"
                    :data="RevenueData" :categories="RevenueCategories" :y-axis="['desktop']" y-label="Amount"
                    x-label="Month" :hide-legend="false" :legend-position="LegendPosition.Top" /> -->
        <UTable
          :data="sales"
          :columnVisibility="columnVisibility"
          class="bg-elevated/50 ring ring-default rounded col-span-3"
        />
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>

<style scoped></style>
