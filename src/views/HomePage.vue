<template>
  <div class="min-h-screen">
    <Navbar />

    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Добро пожаловать в Bazar
          </h1>
          <p class="text-xl mb-8 text-primary-100">
            Лучшие товары по выгодным ценам
          </p>
          <router-link to="/catalog" class="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Перейти в каталог
          </router-link>
        </div>
      </div>
    </div>

    <!-- Categories Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold mb-6">Категории</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="{ name: 'catalog', query: { category: category.slug } }"
          class="card p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div class="w-16 h-16 mx-auto mb-3 bg-primary-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
        </router-link>
      </div>
    </div>

    <!-- Featured Products -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Популярные товары</h2>
        <router-link to="/catalog" class="text-primary-600 hover:text-primary-700 font-medium">
          Смотреть все →
        </router-link>
      </div>

      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="card p-4 animate-pulse">
          <div class="aspect-square bg-gray-200 rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import ProductCard from '@/components/ProductCard.vue'

const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const products = ref([])
const categories = ref([])
const loading = ref(true)

onMounted(async () => {
  // Fetch user profile if authenticated
  if (authStore.isAuthenticated) {
    await authStore.fetchProfile()
    await cartStore.fetchCart()
  }

  // Fetch categories and products
  await productStore.fetchCategories()
  categories.value = productStore.categories

  await productStore.fetchProducts({ ordering: '-average_rating' })
  products.value = productStore.products.slice(0, 8)

  loading.value = false
})
</script>
