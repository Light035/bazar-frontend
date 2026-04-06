import { defineStore } from 'pinia'
import { productService } from '@/services'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    currentProduct: null,
    loading: false,
    error: null,
    pagination: {
      count: 0,
      next: null,
      previous: null,
    },
  }),

  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      try {
        const data = await productService.getProducts(params)
        this.products = data.results || data
        if (data.count !== undefined) {
          this.pagination = {
            count: data.count,
            next: data.next,
            previous: data.previous,
          }
        }
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch products'
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(slug) {
      this.loading = true
      try {
        this.currentProduct = await productService.getProduct(slug)
        return this.currentProduct
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch product'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        this.categories = await productService.getCategories()
      } catch (error) {
        this.error = error.response?.data || 'Failed to fetch categories'
      }
    },
  },
})
