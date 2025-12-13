<script setup lang="ts">
definePageMeta({
  layout: 'dash'
})

const toast = useToast()

const inventoryStore = useInventoryStore()
inventoryStore.fetchItems()

const { getItems: inventory } = storeToRefs(inventoryStore)

const categoryStore = useCategoriesStore()
categoryStore.fetchItems()

const { getItems: categories } = storeToRefs(categoryStore)

const checkoutStore = useCheckoutStore()

checkoutStore.clearCart()
const { getItems: sale } = storeToRefs(checkoutStore)
const { itemsCount: itemsCount } = storeToRefs(checkoutStore)

const categoryOptions = computed(() => {
  const categoriesNames = categories.value.map((category) => category.name)
  return [[categoriesNames], ['All', ...categoriesNames]]
})

const orderingOptions = inventoryStore.orderingOptions
  ? Object.keys(inventoryStore.orderingOptions)
  : []
const ordering = ref(orderingOptions[0] || '')
const sortItems = async () => {
  inventoryStore.sortItems(ordering.value)
}

const filters = ref({
  search: '',
  category: '',
  min_stock: '',
  max_stock: ''
})
const filterItems = async () => {
  if (filters.value.category === 'All') {
    filters.value.category = ''
  }
  if (filters.value.min_stock === 0 || filters.value.max_stock < filters.value.min_stock) {
    filters.value.max_stock = ''
  }
  inventoryStore.filterItems(filters.value)
}

const show = computed(() => {
  if (itemsCount.value > 0) {
    return true
  } else {
    return false
  }
})

const addToCart = async (product) => {
  checkoutStore.addToCart(product)
}
const removeFromCart = async (product_id) => {
  checkoutStore.removeFromCart(product_id)
}
const checkout = async () => {
  await checkoutStore.createItem()
  inventoryStore.fetchItems()
}
const clearCart = async () => {
  checkoutStore.clearCart()
}
</script>

<template>
  <UPage>
    <UPageHeader>
      <UContainer class="flex w-full max-w-full col-span-3 gap-3 p-0! m-0! justify-between">
        <UForm class="w-1/2" @submit="filterItems">
          <UFieldGroup class="flex w-full">
            <UInput
              type="search"
              placeholder="Search"
              class="grow"
              color="primary"
              size="lg"
              v-model="filters.search"
            />
            <UButton
              type="submit"
              icon="i-fa-search"
              class="w-fit"
              color="primary"
              variant="subtle"
              size="md"
            />
          </UFieldGroup>
        </UForm>

        <UContainer class="flex w-fit justify-end items-center gap-3 p-0! m-0!">
          <USlideover title="Cart">
            <UChip :text="itemsCount" color="error" size="3xl" :show="show">
              <UButton icon="i-fa-shopping-cart" class="shrink-0" />
            </UChip>
            <template #body>
              <div class="flex flex-col gap-3 h-full w-full justify-between">
                <div class="flex flex-col gap-3 h-4/10">
                  <h5 class="font-semibold">Cart Items</h5>
                  <USeparator orientation="horizontal" />
                  <div class="flex flex-col overflow-auto w-full grow">
                    <div
                      class="flex flex-col grow gap-3 w-full justify-center"
                      v-if="itemsCount === 0"
                    >
                      <p class="text-muted text-center">No items in cart.</p>
                    </div>
                    <div
                      v-else="itemsCount > 0"
                      v-for="item in sale.items"
                      :key="item.product_id"
                      class="flex flex-col w-full"
                    >
                      <div class="flex w-full justify-between pe-3">
                        <p>{{ item.name_at_sale }}</p>
                        <div class="flex gap-2 items-center justify-end w-fit">
                          <UInputNumber
                            v-model="item.quantity"
                            min="1"
                            :max="inventory.find((inv) => inv.id === item.product_id)?.stock_qty"
                            class="w-30"
                          />
                          <UButton
                            icon="i-fa-trash"
                            color="error"
                            size="md"
                            @click="removeFromCart(item.product_id)"
                          />
                        </div>
                      </div>
                      <p class="text-muted">
                        ${{ (item.price_at_sale * item.quantity).toFixed(2) }}
                      </p>
                    </div>
                  </div>
                  <USeparator orientation="horizontal" />
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex flex-row w-full gap-3">
                <div class="flex w-full justify-start items-center">
                  <h5 class="font-semibold">${{ checkoutStore.totalPrice }}</h5>
                </div>
                <div class="flex flex-row gap-3">
                  <UButton label="Clear" color="error" size="lg" class="w-fit" @click="clearCart" />
                  <UButton
                    label="Checkout"
                    color="success"
                    size="lg"
                    class="w-fit"
                    @click="checkout"
                    :disabled="itemsCount === 0"
                  />
                </div>
              </div>
            </template>
          </USlideover>
          <UForm class="w-fit">
            <USelectMenu
              placeholder="Sort by"
              :items="orderingOptions"
              @change="sortItems"
              v-model="ordering"
              arrow
              variant="soft"
              color="primary"
              size="md"
              class="w-fit"
              :ui="{ content: 'min-w-fit' }"
            />
          </UForm>
          <USlideover title="Filters">
            <UButton icon="i-fa-filter" class="shrink" />

            <template #body>
              <div class="flex h-full w-full">
                <UForm
                  class="flex flex-col gap-3 w-full"
                  id="filter-inventory-form"
                  @submit="filterItems"
                >
                  <UFormField label="Category" class="w-full">
                    <USelectMenu
                      placeholder="Select Category"
                      arrow
                      :items="categoryOptions[1]"
                      v-model="filters.category"
                      class="w-full"
                      :ui="{ content: 'min-w-fit' }"
                    />
                  </UFormField>
                  <UContainer class="flex flex-row m-0! p-0! gap-3">
                    <UFormField label="Min Stock" class="w-1/2">
                      <UInputNumber
                        placeholder="Min Stock"
                        v-model="filters.min_stock"
                        min="0"
                        class="w-full"
                      />
                    </UFormField>
                    <UFormField label="Max Stock" class="w-1/2">
                      <UInputNumber
                        placeholder="Max Stock"
                        v-model="filters.max_stock"
                        min="0"
                        class="w-full"
                      />
                    </UFormField>
                  </UContainer>
                </UForm>
              </div>
            </template>
            <template #footer>
              <div class="flex w-full justify-end">
                <UButton
                  type="submit"
                  label="Apply"
                  size="lg"
                  class="shrink"
                  form="filter-inventory-form"
                />
              </div>
            </template>
          </USlideover>
        </UContainer>
      </UContainer>
    </UPageHeader>

    <UPageBody>
      <UPageGrid>
        <UCard v-for="product in inventory" variant="soft" :key="product.id" class="col-span-1">
          <template #header>
            <UContainer class="grid grid-cols-4 w-full justify-between items-center p-0! m-0!">
              <div class="col-span-2 flex flex-col">
                <h5 class="font-semibold truncate w-full">{{ product.name }}</h5>
              </div>
              <div></div>
              <h6 class="text-muted text-end">{{ product.stock_qty }}</h6>
            </UContainer>
          </template>
          <template #footer>
            <UContainer class="w-full m-0! p-0! flex justify-between items-center">
              <h5 class="text-muted">${{ product.price }}</h5>
              <UContainer class="flex flex-row col-span-1 gap-3 p-0! m-0! justify-end">
                <UButton label="Add" @click="addToCart(product)" v-if="product.stock_qty > 0" />
                <UButton
                  label="Remove"
                  @click="removeFromCart(product.id)"
                  v-if="product.stock_qty > 0"
                  color="error"
                />
                <UButton
                  label="No Stock"
                  color="error"
                  variant="outline"
                  v-else="product.stock_qty <= 0"
                />
              </UContainer>
            </UContainer>
          </template>
        </UCard>
      </UPageGrid>
    </UPageBody>
    <!-- <template #right> -->
    <!-- <UPageAside> -->
    <!-- <div class="border rounded" style="height: 80vh">
            </div> -->
    <!-- </UPageAside> -->
    <!-- </template> -->
  </UPage>
</template>
