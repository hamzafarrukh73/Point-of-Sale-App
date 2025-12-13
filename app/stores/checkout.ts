const toast = useToast()

export const useCheckoutStore = defineStore('checkoutStore', {
  state: () => ({
    fetched: false,
    server_url: 'http://127.0.0.1:8000',
    api: '/api/sales/',
    sale: {
      token: 'ORD-' + Date.now(),
      subtotal_amount: 0.0,
      discount_amount: 0.0,
      tax_amount: 0.0,
      total_amount: 0.0,
      cashier_at_sale: 'admin',
      items: [] as Array<{
        product_id: number
        quantity: number
        name_at_sale: string
        price_at_sale: number
        discount_at_sale: number
      }>
    }
  }),
  getters: {
    getItems: (state) => state.sale,
    totalPrice: (state) => {
      return state.sale.items
        .reduce((total, item) => total + item.price_at_sale * item.quantity, 0)
        .toFixed(2)
    },
    itemsCount: (state) => {
      return state.sale.items.reduce((total, item) => total + item.quantity, 0)
    }
  },
  actions: {
    addToCart(product: any) {
      const existingItem = this.sale.items.find((item) => item.product_id === product.id)
      if (existingItem && existingItem.quantity < product.stock_qty) {
        existingItem.quantity++
      } else if (!existingItem) {
        this.sale.items.push({
          product_id: product.id,
          quantity: 1,
          name_at_sale: product.name,
          price_at_sale: product.price,
          discount_at_sale: 0
        })
      } else {
        toast.add({
          title: 'Out of Stock.',
          color: 'error',
          position: 'top-right'
        })
        return
      }
      // product.stock_qty--;
    },

    removeFromCart(product_id: number) {
      const index = this.sale.items.findIndex((item) => item.product_id === product_id)
      if (index !== -1) {
        this.sale.items.splice(index, 1)
      }
    },

    clearCart() {
      this.sale.items = []
    },

    async createItem() {
      this.sale.token = 'ORD-' + Date.now()
      this.sale.subtotal_amount = parseFloat(this.totalPrice)
      this.sale.discount_amount = 0.0
      this.sale.tax_amount = 0.0
      this.sale.total_amount =
        parseFloat(this.totalPrice) - this.sale.discount_amount + this.sale.tax_amount
      this.sale.cashier_at_sale = 'admin'
      try {
        let token = localStorage.getItem('authToken')
        const response = await $fetch(`${this.server_url}${this.api}`, {
          method: 'POST',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: this.sale
        })

        this.fetched = false

        if (response) {
          toast.add({
            title: 'Added Successfully.',
            color: 'success'
          })
        }
      } catch (error) {
        toast.add({
          title: 'Failed to Add.',
          color: 'error'
        })
      }
    }
  }
})
