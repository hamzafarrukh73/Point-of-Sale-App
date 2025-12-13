<script setup>
definePageMeta({
  layout: 'dash'
})

const toast = useToast()
const layoutStore = useLayoutStore()
const productsStore = useProductsStore()

// productsStore.generateDummyProducts();
// productsStore.generateDummyCategories();

productsStore.resetProducts()
productsStore.fetchCategories()

const { getProducts: products } = storeToRefs(productsStore)
const { getCategories: categories } = storeToRefs(productsStore)

const productsSortMenu = [
  'Name Asc',
  'Name Desc',
  'Category Asc',
  'Category Desc',
  'Price Asc',
  'Price Desc'
]
const categoriesMenu = computed(() => {
  const categoryNames = categories.value.map((category) => category.name)

  return ['All', ...categoryNames]
})

const productsOrder = ref('Name Asc')
const productsFilters = ref({
  category: 'All',
  min_price: 0,
  max_price: ''
})

const sortProducts = async () => {
  productsStore.sortProducts(productsOrder.value)
}
const filterProducts = async () => {
  productsStore.filterProducts(productsFilters.value)
}

const resetProducts = async () => {
  productsOrder.value = 'Name Asc'
  productsStore.resetProducts()
}
</script>

<template>
  <div class="layout-products">
    <div>
      <div class="actions">
        <div></div>
        <div class="flex justify-end w-3/10 gap-2">
          <!-- <manage_categories /> -->
          <UButton
            label="Categories"
            to="products/categories"
            size="sm"
            class="w-1/2 place-content-center"
          />
          <UModal title="Add Product">
            <UButton label="Add Product" size="sm" class="w-1/2 place-content-center" />
          </UModal>
        </div>
      </div>
    </div>
    <div class="container-toolkit">
      <!-- <div class="flex gap-2 flex-grow-1"> -->
      <searchbar store="products" />
      <div class="flex w-1/4 justify-end gap-2">
        <UForm class="flex-grow-1">
          <USelectMenu
            placeholder="Sort by"
            :items="productsSortMenu"
            @change="sortProducts"
            v-model="productsOrder"
            arrow
            variant="soft"
            color="primary"
            size="md"
            class="w-full"
            :ui="{ content: 'min-w-fit' }"
          />
        </UForm>

        <UButton icon="i-fa-refresh" size="sm" @click="resetProducts" class="flex-shrink-0" />
        <USlideover title="Filters">
          <UButton icon="i-fa-filter" size="sm" class="flex-shrink-0" />

          <template #body>
            <div class="flex h-full w-full">
              <UForm class="flex-col gap-3 w-full flex-grow-1">
                <UFormField label="Category">
                  <USelectMenu
                    placeholder="Category"
                    arrow
                    :items="categoriesMenu"
                    v-model="productsFilters.category"
                    class="w-1/2 m-2"
                    :ui="{ content: 'min-w-fit' }"
                  />
                </UFormField>
                <UFormField label="Min Price">
                  <UInputNumber
                    placeholder="Min Price"
                    v-model="productsFilters.min_price"
                    min="0"
                    class="w-1/2 m-2"
                  />
                </UFormField>
                <UFormField label="Max Price">
                  <UInputNumber
                    placeholder="Max Price"
                    v-model="productsFilters.max_price"
                    min="0"
                    class="w-1/2 m-2"
                  />
                </UFormField>
              </UForm>
            </div>
          </template>
          <template #footer>
            <div class="flex w-full justify-end">
              <UButton
                label="Apply Filters"
                size="lg"
                class="flex-shrink-0"
                @click="filterProducts"
              />
            </div>
          </template>
        </USlideover>
      </div>
      <!-- </div> -->
    </div>
    <div class="container-products">
      <productCard :products="products" />
    </div>
  </div>
</template>

<style scoped>
.layout-products {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: min-content min-content auto;
  grid-template-columns: 100%;
  grid-template-areas:
    'actions'
    'toolkit'
    'products';
  /* overflow-y: auto; */
}

.actions {
  grid-area: actions;
  width: 100%;
  display: flex;
  padding: 0.5rem;
  gap: 1rem;
  justify-content: space-between;
}

.container-toolkit {
  grid-area: toolkit;
  width: 100%;
  display: flex;
  padding: 0.5rem;
  gap: 1rem;
  justify-content: space-between;
}

.container-products {
  grid-area: products;
  width: 100%;
  height: 100%;
  display: grid;
  padding: 0.5rem;
  overflow-y: auto;
  /* flex-wrap: wrap; */
  grid-template-columns: repeat(5, 20%);
  justify-content: start;
}

@media (max-width: 900px) {
  .container-products {
    grid-template-columns: repeat(2, 50%);
  }
}

.container-product-card {
  width: 100%;
  height: min-content;
  padding: 0.5rem;
}

.container-product-card > div > div {
  padding: 0.7rem !important;
}

.container-categories {
  grid-area: categories;
  height: min-content;
  display: flex;

  /* wrap: nowrap; */
  overflow-x: auto;
  padding: 0.5rem;
  gap: 0.5rem;
}
</style>
