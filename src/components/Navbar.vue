<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 group">
          <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <span class="text-white font-bold text-2xl">B</span>
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Bazar</span>
        </router-link>

        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl mx-8">
          <div class="relative group">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Поиск товаров..."
              class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 text-gray-900 placeholder-gray-400"
            />
            <svg
              class="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-red-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Right Menu -->
        <div class="flex items-center space-x-4">
          <!-- Wishlist -->
          <router-link
            v-if="authStore.isAuthenticated"
            to="/wishlist"
            class="relative p-3 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-300 group"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span
              v-if="wishlistStore.wishlistCount() > 0"
              class="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
            >
              {{ wishlistStore.wishlistCount() }}
            </span>
          </router-link>

          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative p-3 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-300 group"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
            >
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-red-600 transition-all duration-300"
            >
              <div class="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {{ authStore.userName?.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden md:block font-medium">{{ authStore.userName }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in"
            >
              <router-link
                to="/profile"
                class="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                @click="showUserMenu = false"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Профиль
              </router-link>
              <router-link
                to="/wishlist"
                class="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                @click="showUserMenu = false"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Избранное
              </router-link>
              <router-link
                to="/orders"
                class="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                @click="showUserMenu = false"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Мои заказы
              </router-link>
              <router-link
                v-if="authStore.isSeller"
                to="/seller"
                class="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                @click="showUserMenu = false"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Панель продавца
              </router-link>
              <hr class="my-2 border-gray-100" />
              <button
                @click="handleLogout"
                class="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Выйти
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <router-link
            v-else
            to="/login"
            class="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Войти
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const searchQuery = ref('')
const showUserMenu = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'catalog', query: { search: searchQuery.value } })
  }
}

const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  router.push({ name: 'home' })
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>
