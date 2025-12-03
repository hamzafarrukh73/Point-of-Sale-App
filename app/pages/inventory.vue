<script setup>
const toast = useToast();
const productsStore = useProductsStore(); // Reuse for categories

productsStore.fetchCategories();
const { getCategories: categories } = storeToRefs(productsStore);

const inventory = ref([]);
const inventorySortMenu = [
    'Name Asc', 'Name Desc', 'Stock Asc', 'Stock Desc', 'Last Updated Asc', 'Last Updated Desc'
]
const categoriesMenu = computed(() => {    
    const categoryNames = categories.value.map(category => category.name);
    return ['All', ...categoryNames];
});

const inventoryOrder = ref('Name Asc');
const inventoryFilters = ref({
    search: '',
    // category: 'All', // Backend inventory filter by category might need join, for now let's stick to search
});

const fetchInventory = async () => {
    try {
        let url = `http://localhost:8000/api/inventory/?ordering=${getOrdering(inventoryOrder.value)}`;
        if (inventoryFilters.value.search) {
            url += `&search=${inventoryFilters.value.search}`;
        }
        
        const token = localStorage.getItem('authToken');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }
        
        const { data } = await useFetch(url, {
            headers
        });
        inventory.value = data.value;
    } catch (error) {
        console.error('Failed to fetch inventory', error);
    }
}

function getOrdering(label) {
    const map = {
        'Name Asc': 'product__name',
        'Name Desc': '-product__name',
        'Stock Asc': 'quantity',
        'Stock Desc': '-quantity',
        'Last Updated Asc': 'last_updated',
        'Last Updated Desc': '-last_updated'
    };
    return map[label] || 'product__name';
}

watch([inventoryOrder, inventoryFilters], fetchInventory, { deep: true });

onMounted(fetchInventory);

</script>

<template>
    <div class="layout-products">
        <div>
            <div class="actions">
                <div></div>
                <div class="flex justify-end w-1/4 gap-2">
                     <!-- Placeholder for future actions -->
                </div>
            </div>
        </div>
        <div class="container-toolkit">
             <div class="w-full flex gap-2">
                <UInput v-model="inventoryFilters.search" icon="i-heroicons-magnifying-glass" placeholder="Search..." class="flex-grow" />
             </div>
                
                <div class="flex w-1/4 justify-end gap-2">
                    <UForm class="flex-grow-1">
                        <USelectMenu placeholder="Sort by" :items="inventorySortMenu" v-model="inventoryOrder" arrow variant="soft" color="primary" size="md" class="w-full" :ui="{ content: 'min-w-fit' }"  />
                    </UForm>
                    
                    <UButton icon="i-fa-refresh" size="sm" @click="fetchInventory" class="flex-shrink-0" />
                </div>
        </div>
        <div class="container-products">
            <inventoryCard :inventory="inventory || []" />
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
    grid-template-columns: repeat(5, 20%);
    justify-content: start
}
@media (max-width: 900px) {
    .container-products {
        grid-template-columns: repeat(2, 50%);
    }
}
</style>