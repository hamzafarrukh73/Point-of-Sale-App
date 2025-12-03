<script setup>
const cartStore = useCartStore()
const toast = useToast()

const columns = [
  { key: 'product.name', label: 'Product' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'price', label: 'Price' },
  { key: 'total', label: 'Total' },
  { key: 'actions' }
]

const items = computed(() => cartStore.items.map(item => ({
  ...item,
  price: item.product.price,
  total: (parseFloat(item.product.price) * item.quantity).toFixed(2)
})))

async function handleCheckout() {
  if (cartStore.items.length === 0) return

  try {
    await cartStore.checkout()
    toast.add({ title: 'Success', description: 'Order placed successfully!' })
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to place order.', color: 'red' })
  }
}
</script>

<template>
  <div class="p-4 h-full flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Checkout</h1>

    <div class="flex-grow overflow-auto">
      <UTable :rows="items" :columns="columns">
        <template #product.name-data="{ row }">
            <div class="flex items-center gap-2">
                <img :src="row.product.image_url" class="w-10 h-10 rounded object-cover" />
                <span>{{ row.product.name }}</span>
            </div>
        </template>
        <template #actions-data="{ row }">
          <UButton icon="i-heroicons-trash" color="red" variant="ghost" @click="cartStore.removeFromCart(row.product.id)" />
        </template>
      </UTable>
    </div>

    <div class="border-t pt-4 flex justify-between items-center">
      <div class="text-xl font-bold">
        Total: ${{ cartStore.totalPrice }}
      </div>
      <UButton label="Place Order" size="xl" :loading="false" @click="handleCheckout" :disabled="cartStore.items.length === 0" />
    </div>
  </div>
</template>