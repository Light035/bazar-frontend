<template>
  <div class="min-h-screen">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="aspect-square bg-gray-200 rounded-lg"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
            <div class="h-6 bg-gray-200 rounded w-1/4"></div>
            <div class="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Product Images Gallery -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              <img
                v-if="selectedImage"
                :src="selectedImage"
                :alt="product.title"
                class="w-full h-full object-cover cursor-zoom-in transition-transform group-hover:scale-110"
                @click="zoomImage"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Thumbnail Gallery -->
            <div v-if="productImages.length > 1" class="grid grid-cols-5 gap-2">
              <div
                v-for="image in productImages"
                :key="image.id"
                @click="selectImage(image)"
                class="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all"
                :class="selectedImage === image.image_url ? 'border-primary-600' : 'border-transparent hover:border-gray-300'"
              >
                <img
                  :src="image.thumbnail_url || image.image_url"
                  :alt="product.title"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.title }}</h1>
              <div class="flex items-center gap-4">
                <div class="flex items-center">
                  <span class="text-yellow-400 mr-1">★</span>
                  <span class="font-medium">{{ product.average_rating || 0 }}</span>
                  <span class="text-gray-500 ml-1">({{ product.review_count }} отзывов)</span>
                </div>
                <span class="text-gray-400">|</span>
                <span class="text-gray-600">{{ product.category.name }}</span>
              </div>
            </div>

            <div class="border-t border-b py-4">
              <p class="text-4xl font-bold text-primary-600">{{ formatPrice(product.price) }} ₸</p>
            </div>

            <div>
              <h3 class="font-medium mb-2">Описание</h3>
              <p class="text-gray-600">{{ product.description }}</p>
            </div>

            <div class="flex gap-3">
              <button
                @click="addToCart"
                :disabled="addingToCart"
                class="flex-1 btn-primary disabled:opacity-50"
              >
                {{ addingToCart ? 'Добавление...' : 'Добавить в корзину' }}
              </button>
              <button
                @click="toggleWishlist"
                :disabled="wishlistLoading"
                class="btn-secondary px-6 disabled:opacity-50"
                :title="isInWishlist ? 'Удалить из избранного' : 'Добавить в избранное'"
              >
                <svg
                  class="w-6 h-6 transition-colors"
                  :class="isInWishlist ? 'text-red-600' : 'text-gray-600'"
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
            </div>

            <div v-if="product.wishlist_count > 0" class="text-sm text-gray-500">
              {{ product.wishlist_count }} {{ product.wishlist_count === 1 ? 'человек добавил' : 'человек добавили' }} в избранное
            </div>

            <div v-if="product.seller" class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600">Продавец</p>
              <p class="font-medium">{{ product.seller.first_name }} {{ product.seller.last_name }}</p>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="border-t pt-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Отзывы</h2>
            <button
              v-if="authStore.isAuthenticated"
              @click="showReviewModal = true"
              class="btn-primary"
            >
              Написать отзыв
            </button>
          </div>

          <!-- Reviews List -->
          <div v-if="reviews.length > 0" class="space-y-4">
            <div
              v-for="review in reviews"
              :key="review.id"
              class="card p-6"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-medium">{{ review.user.first_name }} {{ review.user.last_name }}</p>
                  <div class="flex items-center mt-1">
                    <span v-for="i in 5" :key="i" class="text-lg">
                      {{ i <= review.rating ? '★' : '☆' }}
                    </span>
                  </div>
                </div>
                <span class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</span>
              </div>
              <p class="text-gray-700">{{ review.comment }}</p>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            Пока нет отзывов
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div
      v-if="showReviewModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showReviewModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Написать отзыв</h3>

        <form @submit.prevent="submitReview" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Оценка
            </label>
            <div class="flex gap-2">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                @click="reviewForm.rating = i"
                class="text-3xl focus:outline-none"
                :class="i <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'"
              >
                ★
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Комментарий
            </label>
            <textarea
              v-model="reviewForm.comment"
              required
              rows="4"
              class="input-field"
              placeholder="Поделитесь своим мнением о товаре"
            ></textarea>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="showReviewModal = false"
              class="flex-1 btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="reviewLoading"
              class="flex-1 btn-primary disabled:opacity-50"
            >
              {{ reviewLoading ? 'Отправка...' : 'Отправить' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Image Zoom Modal -->
    <div
      v-if="showZoomModal"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      @click="showZoomModal = false"
    >
      <button
        @click="showZoomModal = false"
        class="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        :src="selectedImage"
        :alt="product?.title"
        class="max-w-full max-h-full object-contain"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import { productService } from '@/services'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()

const product = ref(null)
const reviews = ref([])
const productImages = ref([])
const selectedImage = ref(null)
const showZoomModal = ref(false)
const loading = ref(true)
const addingToCart = ref(false)
const showReviewModal = ref(false)
const reviewLoading = ref(false)
const wishlistLoading = ref(false)
const isInWishlist = ref(false)

const reviewForm = ref({
  rating: 5,
  comment: '',
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const addToCart = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  addingToCart.value = true
  try {
    await cartStore.addToCart(product.value.id, 1)
    alert('Товар добавлен в корзину')
  } catch (error) {
    alert('Ошибка при добавлении в корзину')
  } finally {
    addingToCart.value = false
  }
}

const toggleWishlist = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  wishlistLoading.value = true

  // Optimistic UI update
  const previousState = isInWishlist.value
  isInWishlist.value = !isInWishlist.value

  try {
    if (previousState) {
      await wishlistStore.removeFromWishlist(product.value.id)
    } else {
      await wishlistStore.addToWishlist(product.value.id)
    }
    // Refresh product to get updated wishlist_count
    await fetchProduct()
  } catch (error) {
    // Revert on error
    isInWishlist.value = previousState
    alert('Ошибка при обновлении избранного')
  } finally {
    wishlistLoading.value = false
  }
}

const selectImage = (image) => {
  selectedImage.value = image.image_url
}

const zoomImage = () => {
  showZoomModal.value = true
}

const submitReview = async () => {
  reviewLoading.value = true
  try {
    await productService.createReview(product.value.id, reviewForm.value)
    showReviewModal.value = false
    reviewForm.value = { rating: 5, comment: '' }
    await fetchReviews()
    await fetchProduct()
  } catch (error) {
    alert('Ошибка при отправке отзыва')
  } finally {
    reviewLoading.value = false
  }
}

const fetchProduct = async () => {
  await productStore.fetchProduct(route.params.slug)
  product.value = productStore.currentProduct
}

const fetchReviews = async () => {
  const data = await productService.getReviews(route.params.slug)
  reviews.value = data
}

onMounted(async () => {
  await fetchProduct()
  await fetchReviews()

  // Set initial selected image
  if (product.value?.images && product.value.images.length > 0) {
    productImages.value = product.value.images
    const mainImage = product.value.images.find(img => img.is_main)
    selectedImage.value = mainImage ? mainImage.image_url : product.value.images[0].image_url
  } else if (product.value?.main_image) {
    selectedImage.value = product.value.main_image
  }

  // Check if product is in wishlist
  if (authStore.isAuthenticated && product.value) {
    isInWishlist.value = wishlistStore.isInWishlist(product.value.id)
  }

  loading.value = false
})
</script>
