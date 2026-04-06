<template>
  <div class="min-h-screen">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8">Избранное</h1>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="card p-4 animate-pulse">
          <div class="aspect-square bg-gray-200 rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      <!-- Wishlist Items -->
      <div v-else-if="wishlistItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in wishlistItems"
          :key="product.id"
          class="card p-4 group cursor-pointer relative"
        >
          <!-- Remove Button -->
          <button
            @click.stop="removeFromWishlist(product.id)"
            class="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
            title="Удалить из избранного"
          >
            <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <div @click="goToProduct(product.slug)">
            <!-- Product Image -->
            <div class="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
              <img
                v-if="product.main_image"
                :src="product.main_image"
                :alt="product.title"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <!-- Product Info -->
            <div class="space-y-2">
              <h3 class="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {{ product.title }}
              </h3>

              <!-- Rating -->
              <div v-if="product.review_count > 0" class="flex items-center space-x-1">
                <div class="flex items-center">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-4 h-4"
                    :class="i <= Math.round(product.average_rating) ? 'text-yellow-400' : 'text-gray-300'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
                <span class="text-sm text-gray-600">
                  {{ product.average_rating }} ({{ product.review_count }})
                </span>
              </div>

              <!-- Price -->
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-gray-900">
                  {{ formatPrice(product.price) }} ₸
                </span>
              </div>

              <!-- Add to Cart Button -->
              <button
                @click.stop="handleAddToCart(product.id)"
                :disabled="product.stock === 0 || addingToCart[product.id]"
                class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="addingToCart[product.id]">Добавление...</span>
                <span v-else-if="product.stock === 0">Нет в наличии</span>
                <span v-else>В корзину</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 class="text-xl font-medium text-gray-900 mb-2">Ваш список избранного пуст</h3>
        <p class="text-gray-500 mb-6">Добавьте товары, которые вам нравятся</p>
        <button
          @click="$router.push('/')"
          class="btn-primary"
        >
          Перейти в каталог
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const wishlistItems = ref([])
const loading = ref(true)
const addingToCart = ref({})

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const goToProduct = (slug) => {
  router.push({ name: 'product', params: { slug } })
}

const removeFromWishlist = async (productId) => {
  try {
    await wishlistStore.removeFromWishlist(productId)
    wishlistItems.value = wishlistStore.wishlistItems
  } catch (error) {
    console.error('Failed to remove from wishlist:', error)
  }
}

const handleAddToCart = async (productId) => {
  addingToCart.value[productId] = true
  try {
    await cartStore.addToCart(productId)
  } catch (error) {
    console.error('Failed to add to cart:', error)
  } finally {
    addingToCart.value[productId] = false
  }
}

onMounted(async () => {
  await wishlistStore.fetchWishlist()
  wishlistItems.value = wishlistStore.wishlistItems
  loading.value = false
})
</script>
