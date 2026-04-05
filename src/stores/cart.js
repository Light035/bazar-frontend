import { defineStore } from 'pinia'
import { cartService } from '@/services'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null,
    loading: false,
    error: null,
  }),

  getters: {
    itemCount: (state) => state.cart?.items?.length || 0,
    totalPrice: (state) => state.cart?.total_price || '0.00',
    items: (state) => state.cart?.items || [],
  },

  actions: {
    async fetchCart() {
      this.loading = true
      try {
        this.cart = await cartService.getCart()
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch cart'
      } finally {
        this.loading = false
      }
    },

    async addToCart(productId, quantity = 1) {
      this.loading = true
      try {
        await cartService.addToCart(productId, quantity)
        await this.fetchCart()
      } catch (error) {
        this.error = error.response?.data || 'Failed to add to cart'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateQuantity(itemId, quantity) {
      this.loading = true
      try {
        await cartService.updateCartItem(itemId, quantity)
        await this.fetchCart()
      } catch (error) {
        this.error = error.response?.data || 'Failed to update quantity'
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeItem(itemId) {
      this.loading = true
      try {
        await cartService.removeCartItem(itemId)
        await this.fetchCart()
      } catch (error) {
        this.error = error.response?.data || 'Failed to remove item'
        throw error
      } finally {
        this.loading = false
      }
    },

    async clearCart() {
      this.loading = true
      try {
        await cartService.clearCart()
        this.cart = null
      } catch (error) {
        this.error = error.response?.data || 'Failed to clear cart'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
