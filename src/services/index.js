import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login/', { email, password })
    const { access, refresh, user } = response.data
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    return { user, access, refresh }
  },

  async register(userData) {
    const response = await api.post('/auth/register/', userData)
    const { access, refresh, user } = response.data
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    return { user, access, refresh }
  },

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      try {
        await api.post('/auth/logout/', { refresh: refreshToken })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  async getProfile() {
    const response = await api.get('/auth/me/')
    return response.data
  },

  async updateProfile(data) {
    const response = await api.patch('/auth/me/', data)
    return response.data
  },

  async becomeSeller() {
    const response = await api.post('/auth/become-seller/')
    return response.data
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },
}

export const productService = {
  async getProducts(params = {}) {
    const response = await api.get('/products/', { params })
    return response.data
  },

  async getProduct(slug) {
    const response = await api.get(`/products/${slug}/`)
    return response.data
  },

  async getCategories() {
    const response = await api.get('/categories/')
    return response.data
  },

  async getReviews(slug) {
    const response = await api.get(`/products/${slug}/reviews/`)
    return response.data
  },

  async createReview(slug, data) {
    const response = await api.post(`/products/${slug}/reviews/create/`, data)
    return response.data
  },
}

export const cartService = {
  async getCart() {
    const response = await api.get('/cart/')
    return response.data
  },

  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/', {
      product_id: productId,
      quantity,
    })
    return response.data
  },

  async updateCartItem(itemId, quantity) {
    const response = await api.patch(`/cart/items/${itemId}/`, { quantity })
    return response.data
  },

  async removeCartItem(itemId) {
    await api.delete(`/cart/items/${itemId}/`)
  },

  async clearCart() {
    await api.delete('/cart/')
  },
}

export const orderService = {
  async getOrders() {
    const response = await api.get('/orders/')
    return response.data
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}/`)
    return response.data
  },

  async createOrder(data) {
    const response = await api.post('/orders/', data)
    return response.data
  },

  async cancelOrder(id) {
    const response = await api.patch(`/orders/${id}/`, { status: 'cancelled' })
    return response.data
  },
}

export const sellerService = {
  async getMyProducts() {
    const response = await api.get('/seller/products/')
    return response.data
  },

  async createProduct(data) {
    const response = await api.post('/seller/products/', data)
    return response.data
  },

  async updateProduct(id, data) {
    const response = await api.patch(`/seller/products/${id}/`, data)
    return response.data
  },

  async deleteProduct(id) {
    await api.delete(`/seller/products/${id}/`)
  },

  async getSellerOrders() {
    const response = await api.get('/seller/orders/')
    return response.data
  },
}
