import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[], // { product: any, quantity: number }
  }),
  getters: {
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0).toFixed(2)
    },
    itemCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    }
  },
  actions: {
    addToCart(product: any) {
      const existingItem = this.items.find(item => item.product.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ product, quantity: 1 })
      }
    },
    removeFromCart(productId: number) {
      const index = this.items.findIndex(item => item.product.id === productId)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },
    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.product.id === productId)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          this.removeFromCart(productId)
        }
      }
    },
    clearCart() {
      this.items = []
    },
    async checkout() {
      const orderData = {
        token: 'ORD-' + Date.now(), // Simple token generation
        total_amount: this.totalPrice,
        items: this.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      }

      try {
        const token = localStorage.getItem('authToken');
        const headers: any = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Token ${token}`;
        }

        const response = await fetch('http://localhost:8000/api/orders/', {
          method: 'POST',
          headers,
          body: JSON.stringify(orderData)
        })

        if (!response.ok) {
          throw new Error('Checkout failed')
        }

        const data = await response.json()
        this.clearCart()
        return data
      } catch (error) {
        console.error('Checkout error:', error)
        throw error
      }
    }
  }
})
