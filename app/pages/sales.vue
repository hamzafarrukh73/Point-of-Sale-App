<script setup lang="ts">
definePageMeta({
    layout: 'dash'
})

const salesStore = useSalesStore();
salesStore.fetchItems();

const { getItems: sales } = storeToRefs(salesStore);

const orderingOptions = salesStore.orderingOptions ? Object.keys(salesStore.orderingOptions) : [];
const ordering = ref(orderingOptions[0] || '');
const sortItems = async () => {
    salesStore.sortItems(ordering.value);
}

const filters = ref({
    search: '',
})
const filterItems = async () => {
    salesStore.filterItems(filters.value);
}

const deleteItem = async (id: any) => {
    await salesStore.deleteItem(id);
}

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
            <UCard variant="subtle" >
            <UTable :data="sales" :columnVisibility="columnVisibility" :hoverable="true" class="w-full">
                <UTableColumn label="Token" field="token" sortable />
                <UTableColumn label="Total Amount" field="total_amount" sortable />
                <UTableColumn label="Date" field="created_on" sortable />
                <UTableColumn label="Actions">
                    <template #default="{ row }">
                        <UButton icon="i-fa-trash" color="error" variant="subtle" size="md" @click="deleteItem(row.id)" />
                    </template>
                </UTableColumn>
            </UTable>
            </UCard>
        </UPageBody>
    </UPage>
</template>