<template>
  <div class="group cursor-pointer relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-red-200 hover:shadow-2xl transition-all duration-300" @click="goToProduct">
    <!-- Wishlist Heart Button -->
    <button
      @click.stop="toggleWishlist"
      :disabled="wishlistLoading"
      class="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 disabled:opacity-50"
      :title="isInWishlist ? 'Удалить из избранного' : 'Добавить в избранное'"
    >
      <svg
        class="w-5 h-5 transition-all duration-300"
        :class="isInWishlist ? 'text-red-600 scale-110' : 'text-gray-400'"
        :fill="isInWishlist ? 'currentColor' : 'none'"
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
    </button>

    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <img
        v-if="product.main_image"
        :src="product.main_image"
        :alt="product.title"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        @error="imageError = true"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-300"
      >
        <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <!-- Stock Badge -->
      <div v-if="product.stock < 10 && product.stock > 0" class="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
        Осталось {{ product.stock }}
      </div>
      <div v-else-if="product.stock === 0" class="absolute top-3 left-3 bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
        Нет в наличии
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-5 space-y-3">
      <h3 class="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors min-h-[3rem] text-base leading-tight">
        {{ product.title }}
      </h3>

      <!-- Rating -->
      <div v-if="product.review_count > 0" class="flex items-center space-x-2">
        <div class="flex items-center space-x-0.5">
          <svg
            v-for="i in 5"
            :key="i"
            class="w-4 h-4"
            :class="i <= Math.round(product.average_rating) ? 'text-yellow-400' : 'text-gray-200'"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
        <span class="text-sm text-gray-500 font-medium">
          {{ product.average_rating }} <span class="text-gray-400">({{ product.review_count }})</span>
        </span>
      </div>

      <!-- Price -->
      <div class="flex items-baseline space-x-2 pt-2">
        <span class="text-2xl font-bold text-gray-900">
          {{ formatPrice(product.price) }}
        </span>
        <span class="text-lg text-gray-500 font-medium">₸</span>
      </div>

      <!-- Add to Cart Button -->
      <button
        @click.stop="handleAddToCart"
        :disabled="product.stock === 0 || loading"
        class="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="product.stock === 0 ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Добавление...
        </span>
        <span v-else-if="product.stock === 0">Нет в наличии</span>
        <span v-else class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          В корзину
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()
const loading = ref(false)
const wishlistLoading = ref(false)
const imageError = ref(false)
const isInWishlist = ref(false)

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const goToProduct = () => {
  router.push({ name: 'product', params: { slug: props.product.slug } })
}

const handleAddToCart = async () => {
  loading.value = true
  try {
    await cartStore.addToCart(props.product.id)
  } catch (error) {
    console.error('Failed to add to cart:', error)
  } finally {
    loading.value = false
  }
}

const toggleWishlist = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  wishlistLoading.value = true

  // Optimistic UI update
  const previousState = isInWishlist.value
  isInWishlist.value = !isInWishlist.value

  try {
    if (previousState) {
      await wishlistStore.removeFromWishlist(props.product.id)
    } else {
      await wishlistStore.addToWishlist(props.product.id)
    }
  } catch (error) {
    // Revert on error
    isInWishlist.value = previousState
    console.error('Failed to toggle wishlist:', error)
  } finally {
    wishlistLoading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    isInWishlist.value = wishlistStore.isInWishlist(props.product.id)
  }
})
</script>
