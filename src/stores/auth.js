import { defineStore } from 'pinia'
import { authService } from '@/services'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    isSeller: (state) => state.user?.is_seller || false,
    userName: (state) => {
      if (!state.user) return ''
      return `${state.user.first_name} ${state.user.last_name}`.trim() || state.user.email
    },
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const { user } = await authService.login(email, password)
        this.user = user
        this.isAuthenticated = true
        return user
      } catch (error) {
        this.error = error.response?.data?.detail || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const { user } = await authService.register(userData)
        this.user = user
        this.isAuthenticated = true
        return user
      } catch (error) {
        this.error = error.response?.data || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await authService.logout()
      } finally {
        this.user = null
        this.isAuthenticated = false
      }
    },

    async fetchProfile() {
      if (!authService.isAuthenticated()) {
        this.isAuthenticated = false
        return
      }

      try {
        const user = await authService.getProfile()
        this.user = user
        this.isAuthenticated = true
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
      }
    },

    async updateProfile(data) {
      this.loading = true
      try {
        const user = await authService.updateProfile(data)
        this.user = user
        return user
      } catch (error) {
        this.error = error.response?.data || 'Update failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async becomeSeller() {
      this.loading = true
      try {
        await authService.becomeSeller()
        if (this.user) {
          this.user.is_seller = true
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to become seller'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
