<script setup lang="ts">
definePageMeta({
    layout: 'dash'
})

const productsStore = useProductsStore();
productsStore.fetchItems();

const { getItems: products } = storeToRefs(productsStore);

const categoryStore = useCategoriesStore();
categoryStore.fetchItems();

const { getItems: categories } = storeToRefs(categoryStore);

const categoryOptions = computed(() => {
    const categoriesNames = categories.value.map(category => category.name);
    return [[categoriesNames], ['All', ...categoriesNames]];
});

const newItem = ref({
    name: '',
    barcode: '',
    price: 0,
    category: '',
    category_id: null,
});
const createItem = async () => {
    categories.value.find(cat => {
        if (cat.name === newItem.value.category) {
            newItem.value.category_id = cat.id;
        }
    });
    await productsStore.createItem(newItem.value);
    newItem.value = {
        name: '',
        barcode: '',
        price: 0,
        category: '',
        category_id: null,
    };
}

const updateItem = async (newValues: object) => {
    categories.value.find(cat => {
        if (cat.name === newValues.category) {
            newValues.category_id = cat.id;
        }
    });
    await productsStore.updateItem(newValues);
}

const deleteItem = async (id: any) => {
    await productsStore.deleteItem(id);
}

const orderingOptions = productsStore.orderingOptions ? Object.keys(productsStore.orderingOptions) : [];
const ordering = ref(orderingOptions[0] || '');
const sortItems = async () => {
    productsStore.sortItems(ordering.value);
}

const filters = ref({
    search: '',
    category: '',
    min_price: '',
    max_price: '',
})
const filterItems = async () => {
    if (filters.value.category === 'All') {
        filters.value.category = '';
    }
    if (filters.value.max_price === 0 || filters.value.max_price < filters.value.min_price) {
        filters.value.max_price = '';
    }
    productsStore.filterItems(filters.value);
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
                    <UModal title="New Product">
                        <UButton label="Add Product" />
                        <template #body>
                            <UContainer class="w-full m-0! p-0!">
                                <UForm @submit="createItem" class="flex flex-col gap-3" id="create-product-form" >
                                    <UFormField label="Product">
                                        <UInput v-model="newItem.name" placeholder="Enter Name" class="w-full" required />
                                    </UFormField>
                                    <UFormField label="Barcode">
                                        <UInput v-model="newItem.barcode" placeholder="Enter Barcode" class="w-full" required />
                                    </UFormField>
                                    <UFormField label="Category">
                                        <USelectMenu v-model="newItem.category" :items="categoryOptions[0]" placeholder="Select Category" class="w-full" required />
                                    </UFormField>
                                    <UFormField label="Price">
                                        <UInput v-model="newItem.price" type="number" placeholder="Enter Price" class="w-full" required />
                                    </UFormField>
                                </UForm>
                            </UContainer>
                        </template>

                        <template #footer>
                            <UContainer class="w-full flex justify-end m-0! p-0!">
                                <UButton label="Create" type="submit" form="create-product-form" />
                            </UContainer>

                        </template>
                    </UModal>
                    <UForm class="w-fit">
                        <USelectMenu placeholder="Sort by" :items="orderingOptions" @change="sortItems" v-model="ordering" arrow
                            variant="soft" color="primary" size="md" class="w-fit" :ui="{ content: 'min-w-fit' }" />
                    </UForm>
                    <USlideover title="Filters">
                        <UButton icon="i-fa-filter" class="shrink"/>

                        <template #body>
                            <div class="flex h-full w-full">
                                <UForm class='flex flex-col gap-3 w-full' id="filter-products-form" @submit="filterItems" >
                                    <UFormField label="Category" class="w-full">
                                        <USelectMenu placeholder="Select Category" arrow :items="categoryOptions[1]" v-model="filters.category" class="w-full" :ui="{ content: 'min-w-fit' }" />
                                    </UFormField>
                                    <UContainer class="flex flex-row m-0! p-0! gap-3">
                                        <UFormField label="Min Price" class="w-1/2">
                                            <UInputNumber placeholder="Min Price" v-model="filters.min_price" min="0" class="w-full" />
                                        </UFormField>
                                        <UFormField label="Max Price" class="w-1/2">
                                            <UInputNumber placeholder="Max Price" v-model="filters.max_price" min="0" class="w-full" />
                                        </UFormField>
                                    </UContainer>
                                </UForm>
                            </div>
                        </template>
                        <template #footer>
                            <div class="flex w-full justify-end">
                                <UButton type="submit" label="Apply" size="lg" class="shrink" form="filter-products-form" />
                            </div>
                        </template>
                    </USlideover>
                </UContainer>
            </UContainer>
        </UPageHeader>

        <UPageBody>
            <UPageGrid>
                <UCard v-for="product in products" variant="soft" :key="product.id" class="col-span-1" >
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
                            <h5 class="text-muted">${{ product.price }}</h5>
                            <UContainer class="flex flex-row col-span-1 gap-3 p-0! m-0! justify-end">              
                                <UModal title="Edit Product">
                                    <UButton  icon="i-fa-edit" color="primary" class="shrink place-items-center"  />
                                    <template #body>
                                        <UForm id="create-product-form"
                                            @submit="updateItem(newValues={
                                                id: product.id, name: product.name, barcode: product.barcode, category: product.category, price: product.price
                                            })
                                        ">
                                            <UFormField label="Product">
                                                <UInput v-model="product.name" placeholder="Enter Name" class="w-full" required />
                                            </UFormField>
                                            <UFormField label="Barcode">
                                                <UInput v-model="product.barcode" placeholder="Enter Barcode" class="w-full" required />
                                            </UFormField>
                                            <UFormField label="Category">
                                                <USelectMenu v-model="product.category" :items="categoryOptions[0]" placeholder="Select Category" class="w-full" required />
                                            </UFormField>
                                            <UFormField label="Price">
                                                <UInput v-model="product.price" type="number" placeholder="Enter Price" class="w-full" required />
                                            </UFormField>
                                        </UForm>
                                    </template>

                                    <template #footer>
                                        <UContainer class="w-full flex justify-end m-0! p-0!">
                                            <UButton label="Save" type="submit" form="create-product-form" />
                                        </UContainer>

                                    </template>
                                </UModal>

                                <UModal title="Delete Product">
                                    <UButton icon="i-fa-trash" color="error" class="shrink place-items-center" />
                                    <template #body>
                                        <UForm id="delete-product-form" @submit="deleteItem(product.id)">
                                            <h6>Are you sure you want to delete <strong>"{{ product.name }}"</strong>?</h6>
                                        </UForm>
                                    </template>

                                    <template #footer>
                                        <UContainer class="w-full flex justify-end m-0! p-0!">
                                            <UButton label="Delete" color="error" type="submit" form="delete-product-form" />
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