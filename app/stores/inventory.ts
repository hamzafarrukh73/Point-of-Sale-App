const toast = useToast();

export const useInventoryStore = defineStore('inventoryStore', {
    state: () => ({
        fetched: false,
        server_url: 'http://127.0.0.1:8000',
        api: '/api/inventory/',
        items: [{}],
        ordering: '',
        orderingOptions: {
            'Created (Oldest)': 'product__created_on',
            'Created (Recent)': '-product__created_on',
            'Name (A-Z)': 'product__name',
            'Name (Z-A)': '-product__name',
            'Stock (Low to High)': 'stock_qty',
            'Stock (High to Low)': '-stock_qty',
        } as Record<string, string>,
        filters: {
            search: '',
            min_stock: 0,
            max_stock: '',
            category: '',
        },
    }),
    getters: {
        getItems: (state)  => state.items,
    },
    actions: {
        async fetchItems() {
            if (!this.fetched) {
                try {
                    let token=localStorage.getItem('authToken')
                    let url = `${this.server_url}${this.api}?ordering=${this.ordering}`; 
                    Object.keys(this.filters).forEach(filter => {
                        url += `&${filter}=${this.filters[filter]}`;
                    });
                    const response = await $fetch(url, {
                        method: "GET",
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    this.items = response?.results ?? response ?? [];
                    if (response.data) {
                        this.items = response.data;
                        this.fetched = true;
                    }
                }
                catch (error) {
                    toast.add({
                        title: 'Failed to Fetch.',
                        color: 'error'
                    });
                }
            }
        },

        async updateItem(newValues: object) {
            try {
                let token=localStorage.getItem('authToken')
                const response = await $fetch(`${this.server_url}${this.api}${newValues.id}/`, {
                    method: "PATCH",
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: newValues,
                });

                this.fetched = false;

                if (response) {
                    this.fetchItems();
                    toast.add({
                        title: 'Updated Successfully.',
                        color: 'success'
                    });
                }
            } catch (error) {
                toast.add({
                    title: 'Failed to Update.',
                    color: 'error'
                });
            }
        },

        sortItems(criteria: string) {
            this.ordering = this.orderingOptions[criteria] as string;  
            this.fetched = false;
            this.fetchItems();
        },
        
        filterItems(filters: Object) {
            this.filters = filters;
            this.fetched = false;
            this.fetchItems();
        },
    } 
});
