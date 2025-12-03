<script setup>
definePageMeta({
    layout: 'dash'
})

const salesData = [
    { id: 'card1', label: `Daily Sales`, value: 1000, },
    { id: 'card2', label: `Monthly Sales`, value: 30000, },
    { id: 'card3', label: `Annual Sales`, value: 360000, },
];

const tableData = [
    {
        token: '#4598',
        date: '2024-03-11',
        time: '10:10:00',
        amount: 276.00
    },
    {
        token: '#4599',
        date: '2024-04-10',
        time: '10:10:00',
        amount: 276.00
    },
    {
        token: '#4599',
        date: '2024-04-10',
        time: '10:10:00',
        amount: 276.00
    },
    {
        token: '#4599',
        date: '2024-04-10',
        time: '10:10:00',
        amount: 276.00
    },
    {
        token: '#4599',
        date: '2024-04-10',
        time: '10:10:00',
        amount: 276.00
    },
    {
        token: '#4599',
        date: '2024-04-10',
        time: '10:10:00',
        amount: 276.00
    },
]

const RevenueData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
]

const RevenueCategories = computed(() => ({
    desktop: {
        name: 'Desktop',
        color: '#22c55e',
    },
}))

const sorting = ref([
    {
        id: 'date',
        desc: true
    }
])
</script>

<template>
    <UPage>
        <UPageHeader>
            <UPageGrid>
                <UPageCard :title="data.label" :description="data.value" variant="soft" class="col-span-1"
                    v-for="data in salesData" :key="data.id" :id="data.id" />
            </UPageGrid>
        </UPageHeader>

        <UPageBody>
            <UPageGrid>
                <BarChart class="bg-elevated/50 ring ring-default rounded p-5 col-span-1 md:col-span-2"
                    :data="RevenueData" :categories="RevenueCategories" :y-axis="['desktop']" y-label="Amount"
                    x-label="Month" :hide-legend="false" :legend-position="LegendPosition.Top" />
                <UTable :data="tableData" v-model:sorting="sorting" sticky="true"
                    class="bg-elevated/50 ring ring-default rounded col-span-1" />
            </UPageGrid>
        </UPageBody>
    </UPage>
</template>

<style scoped>
.layout-dashboard {
    height: 100%;
    display: grid;
    grid-template-rows: min-content auto;
    grid-template-columns: repeat(4, 25%);
    grid-template-areas:
        'cards cards cards cards'
        'chart chart table table';
    /* overflow-y: auto; */
}

@media (max-width: 900px) {
    .layout-dashboard {
        display: grid;
        grid-template-rows: min-content auto;
        grid-template-columns: repeat(2, 50%);
        grid-template-areas:
            'cards cards'
            'table table';
    }

    .container-dashboard-chart {
        display: none !important;
    }

    #card3,
    #card4 {
        display: none;
    }

}

.container-dashboard-cards {
    grid-area: cards;
    display: flex;
}

.container-card {
    padding-inline: 0.5rem;
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
}

.container-dashboard-chart {
    grid-area: chart;
    height: 100%;
    display: flex;
    padding: 0.5rem;
    padding-top: 1.5rem;
    overflow-y: auto;
}

.container-dashboard-table {
    grid-area: table;
    height: 100%;
    padding: 0.5rem;
    padding-top: 1.5rem;
    overflow-y: auto;
}
</style>