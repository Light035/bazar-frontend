import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useWishlistStore = defineStore('wishlist', () => {
  const wishlistItems = ref([])
  const loading = ref(false)

  const fetchWishlist = async () => {
    loading.value = true
    try {
      const response = await api.get('/wishlist/')
      wishlistItems.value = response.data
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      wishlistItems.value = []
    } finally {
      loading.value = false
    }
  }

  const addToWishlist = async (productId) => {
    try {
      await api.post('/wishlist/', { product_id: productId })
      await fetchWishlist()
      return true
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
      throw error
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}/`)
      wishlistItems.value = wishlistItems.value.filter(item => item.id !== productId)
      return true
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      throw error
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.value.some(item => item.id === productId)
  }

  const checkWishlistStatus = async (productId) => {
    try {
      const response = await api.get(`/wishlist/${productId}/check/`)
      return response.data.in_wishlist
    } catch (error) {
      console.error('Failed to check wishlist status:', error)
      return false
    }
  }

  const clearWishlist = () => {
    wishlistItems.value = []
  }

  const wishlistCount = () => {
    return wishlistItems.value.length
  }

  return {
    wishlistItems,
    loading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    checkWishlistStatus,
    clearWishlist,
    wishlistCount,
  }
})
