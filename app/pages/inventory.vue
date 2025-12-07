<script setup lang="ts">
definePageMeta({
    layout: 'dash'
})

const inventoryStore = useInventoryStore();
inventoryStore.fetchItems();

const { getItems: inventory } = storeToRefs(inventoryStore);

const categoryStore = useCategoriesStore();
categoryStore.fetchItems();

const { getItems: categories } = storeToRefs(categoryStore);

const categoryOptions = computed(() => {
    const categoriesNames = categories.value.map(category => category.name);
    return [[categoriesNames], ['All', ...categoriesNames]];
});

const updateItem = async (newValues: object) => {
    categories.value.find(cat => {
        if (cat.name === newValues.category) {
            newValues.category_id = cat.id;
        }
    });
    await inventoryStore.updateItem(newValues);
}

const deleteItem = async (id: any) => {
    await inventoryStore.deleteItem(id);
}

const orderingOptions = inventoryStore.orderingOptions ? Object.keys(inventoryStore.orderingOptions) : [];
const ordering = ref(orderingOptions[0] || '');
const sortItems = async () => {
    inventoryStore.sortItems(ordering.value);
}

const filters = ref({
    search: '',
    category: '',
    min_stock: '',
    max_stock: '',
})
const filterItems = async () => {
    if (filters.value.category === 'All') {
        filters.value.category = '';
    }
    if (filters.value.min_stock === 0 || filters.value.max_stock < filters.value.min_stock) {
        filters.value.max_stock = '';
    }
    inventoryStore.filterItems(filters.value);
}
</script>

<template>
    <UPage>
        <UPageHeader>
            <UContainer class="flex w-full max-w-full col-span-3 gap-3 p-0! m-0! justify-between ">
                <UForm class="w-1/2" @submit="filterItems">
                    <UFieldGroup class="flex w-full">
                        <UInput type="search" placeholder="Search" class="grow" color="primary" size="lg" v-model="filters.search" />
                        <UButton type="submit" icon="i-fa-search" class="w-fit" color="primary" variant="subtle" size="md" />
                    </UFieldGroup>
                </UForm>

                <UContainer class="flex w-fit justify-end items-center gap-3 p-0! m-0!">
                    <UForm class="w-fit">
                        <USelectMenu placeholder="Sort by" :items="orderingOptions" @change="sortItems" v-model="ordering" arrow
                            variant="soft" color="primary" size="md" class="w-fit" :ui="{ content: 'min-w-fit' }" />
                    </UForm>
                    <USlideover title="Filters">
                        <UButton icon="i-fa-filter" class="shrink"/>

                        <template #body>
                            <div class="flex h-full w-full">
                                <UForm class='flex flex-col gap-3 w-full' id="filter-inventory-form" @submit="filterItems" >
                                    <UFormField label="Category" class="w-full">
                                        <USelectMenu placeholder="Select Category" arrow :items="categoryOptions[1]" v-model="filters.category" class="w-full" :ui="{ content: 'min-w-fit' }" />
                                    </UFormField>
                                    <UContainer class="flex flex-row m-0! p-0! gap-3">
                                        <UFormField label="Min Stock" class="w-1/2">
                                            <UInputNumber placeholder="Min Stock" v-model="filters.min_stock" min="0" class="w-full" />
                                        </UFormField>
                                        <UFormField label="Max Stock" class="w-1/2">
                                            <UInputNumber placeholder="Max Stock" v-model="filters.max_stock" min="0" class="w-full" />
                                        </UFormField>
                                    </UContainer>
                                </UForm>
                            </div>
                        </template>
                        <template #footer>
                            <div class="flex w-full justify-end">
                                <UButton type="submit" label="Apply" size="lg" class="shrink" form="filter-inventory-form" />
                            </div>
                        </template>
                    </USlideover>
                </UContainer>
            </UContainer>
        </UPageHeader>

        <UPageBody>
            <UPageGrid>
                <UCard v-for="product in inventory" variant="soft" :key="product.id" class="col-span-1" >
                    <template #header>
                        <UContainer class="grid grid-cols-4 w-full justify-between items-center p-0! m-0!">
                            <div class="col-span-2 flex flex-col">
                                <h5 class="font-semibold truncate w-full">{{ product.name }}</h5>
                                
                            </div>
                            <div></div>
                            <h6 class="text-muted text-end">{{ product.category }}</h6>
                            
                        </UContainer>
                    </template>
                    <template #footer>
                        <UContainer class="w-full m-0! p-0! flex justify-between items-center">
                            <h5 class="text-muted">Stk:{{ product.stock_qty }}</h5>
                            <UContainer class="flex flex-row col-span-1 gap-3 p-0! m-0! justify-end">              
                                <UModal title="Edit Product">
                                    <UButton  icon="i-fa-edit" color="primary" class="shrink place-items-center"  />
                                    <template #body>
                                        <UForm id="create-product-form"
                                            @submit="updateItem(newValues={
                                                id: product.id, stock_qty: product.stock_qty
                                            })
                                        ">
                                            <UFormField label="Stock Quantity">
                                                <UInput v-model="product.stock_qty" type="number" placeholder="Enter Stock Quantity" class="w-full" required />
                                            </UFormField>
                                        </UForm>
                                    </template>

                                    <template #footer>
                                        <UContainer class="w-full flex justify-end m-0! p-0!">
                                            <UButton label="Save" type="submit" form="create-product-form" />
                                        </UContainer>

                                    </template>
                                </UModal>
                            </UContainer>
                        </UContainer>
                    </template>
                </UCard>
            </UPageGrid>
        </UPageBody>
    </UPage>
</template>