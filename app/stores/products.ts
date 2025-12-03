const toast = useToast();

export const useProductsStore = defineStore('productsStore', {
    state: () => ({
        fetched: false,
        server_url: 'http://127.0.0.1:8000',
        api: '/api/products/',
        items: [{}],
        ordering: '',
        orderingOptions: {
            'Created (Oldest)': 'created_on',
            'Created (Recent)': '-created_on',
            'Name (A-Z)': 'name',
            'Name (Z-A)': '-name',
            'Price (Low to High)': 'price',
            'Price (High to Low)': '-price',
        } as Record<string, string>,
        filters: {
            search: '',
            min_price: 0,
            max_price: '',
            category__name: '',
        },
    }),
    getters: {
        getItems: (state)  => state.items,
    },
    actions: {
        generateDummies() {
            this.items = [
                { id: 1, name: "Pizza" },
                { id: 2, name: "Furniture" },
                { id: 3, name: "House" },
            ]
        },

        async createItem(newItem: object) {
            try {
                let token=localStorage.getItem('authToken')
                const response = await $fetch(`${this.server_url}${this.api}`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: newItem,
                });

                this.fetched = false;

                if (response) {
                    this.fetchItems();
                    toast.add({
                        title: 'Added Successfully.',
                        color: 'success'
                    });
                }
            } catch (error) {
                toast.add({
                    title: 'Failed to Add.',
                    color: 'error'
                });
                alert(error);
            }
        },

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
                    method: "PUT",
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

        async deleteItem(id: number) {
            try {
                let token=localStorage.getItem('authToken')
                const response = await $fetch(`${this.server_url}${this.api}${id}/`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                this.fetched = false;
                this.fetchItems();
                toast.add({
                    title: 'Deleted Successfully.',
                    color: 'success'
                });
            } 
            catch (error) {
                toast.add({
                    title: 'Failed to Delete.',
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
