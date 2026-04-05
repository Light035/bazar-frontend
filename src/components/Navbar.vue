<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">B</span>
          </div>
          <span class="text-xl font-bold text-gray-900">Bazar</span>
        </router-link>

        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl mx-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Поиск товаров..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg
              class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
        <div class="flex items-center space-x-6">
          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative flex items-center text-gray-700 hover:text-primary-600 transition-colors"
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
              class="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="hidden md:block">{{ authStore.userName }}</span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Профиль
              </router-link>
              <router-link
                to="/orders"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Мои заказы
              </router-link>
              <router-link
                v-if="authStore.isSeller"
                to="/seller"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Панель продавца
              </router-link>
              <hr class="my-2" />
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Выйти
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <router-link
            v-else
            to="/login"
            class="btn-primary"
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

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

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
