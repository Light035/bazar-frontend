<template>
  <div class="card p-4 group cursor-pointer" @click="goToProduct">
    <!-- Product Image -->
    <div class="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
      <img
        v-if="product.main_image"
        :src="product.main_image"
        :alt="product.title"
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
        @click.stop="handleAddToCart"
        :disabled="product.stock === 0 || loading"
        class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Добавление...</span>
        <span v-else-if="product.stock === 0">Нет в наличии</span>
        <span v-else>В корзину</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const cartStore = useCartStore()
const loading = ref(false)

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
</script>
