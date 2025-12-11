const toast = useToast();

export const useSalesStore = defineStore('salesStore', {
    state: () => ({
        fetched: false,
        server_url: 'http://127.0.0.1:8000',
        api: '/api/sales/',
        items: [{}],
        ordering: '',
        orderingOptions: {
            'Created (Oldest)': 'created_on',
            'Created (Recent)': '-created_on',
            'Total (Low to High)': 'total_amount',
            'Total (High to Low)': '-total_amount',
        } as Record<string, string>,
        filters: {
            search: '', 
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

        async deleteItem(id: number) {
            try {
                let token=localStorage.getItem('authToken')
                const response = await $fetch(`${this.server_url}${this.api}${id}/`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
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
