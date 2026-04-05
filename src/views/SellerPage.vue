<template>
  <div class="min-h-screen">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Панель продавца</h1>
        <button
          @click="showCreateModal = true"
          class="btn-primary"
        >
          + Добавить товар
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="card p-4 animate-pulse">
          <div class="aspect-square bg-gray-200 rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="card p-4"
        >
          <img
            v-if="product.main_image"
            :src="product.main_image"
            :alt="product.title"
            class="w-full aspect-square object-cover rounded-lg mb-4"
          />
          <div v-else class="w-full aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 class="font-medium text-gray-900 mb-1">{{ product.title }}</h3>
          <p class="text-lg font-bold text-primary-600 mb-2">{{ formatPrice(product.price) }} ₸</p>
          <p class="text-sm text-gray-500 mb-4">{{ product.category.name }}</p>

          <div class="flex gap-2">
            <button
              @click="editProduct(product)"
              class="flex-1 btn-secondary text-sm"
            >
              Редактировать
            </button>
            <button
              @click="deleteProduct(product.id)"
              class="flex-1 btn-secondary text-sm text-red-600 hover:bg-red-50"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Нет товаров</h3>
        <p class="mt-2 text-gray-500">Добавьте свой первый товар</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
        <h3 class="text-xl font-bold mb-4">
          {{ showEditModal ? 'Редактировать товар' : 'Добавить товар' }}
        </h3>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {{ errorMessage }}
          </div>

          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="input-field"
              placeholder="Название товара"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              class="input-field"
              placeholder="Подробное описание товара"
            ></textarea>
          </div>

          <!-- Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Цена (₸)
            </label>
            <input
              v-model.number="form.price"
              type="number"
              required
              min="0"
              step="0.01"
              class="input-field"
              placeholder="0.00"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              v-model="form.category_id"
              required
              class="input-field"
            >
              <option value="">Выберите категорию</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Image URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              URL изображения
            </label>
            <input
              v-model="form.main_image"
              type="url"
              class="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="formLoading"
              class="flex-1 btn-primary disabled:opacity-50"
            >
              {{ formLoading ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'
import { sellerService } from '@/services'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const authStore = useAuthStore()
const productStore = useProductStore()

const products = ref([])
const categories = ref([])
const loading = ref(true)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const formLoading = ref(false)
const errorMessage = ref('')
const editingProductId = ref(null)

const form = ref({
  title: '',
  description: '',
  price: 0,
  category_id: '',
  main_image: '',
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const data = await sellerService.getMyProducts()
    products.value = data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

const editProduct = (product) => {
  editingProductId.value = product.id
  form.value = {
    title: product.title,
    description: product.description,
    price: product.price,
    category_id: product.category.id,
    main_image: product.main_image || '',
  }
  showEditModal.value = true
}

const deleteProduct = async (productId) => {
  if (!confirm('Удалить этот товар?')) return

  try {
    await sellerService.deleteProduct(productId)
    await fetchProducts()
  } catch (error) {
    alert('Ошибка при удалении товара')
  }
}

const submitForm = async () => {
  formLoading.value = true
  errorMessage.value = ''

  try {
    if (showEditModal.value) {
      await sellerService.updateProduct(editingProductId.value, form.value)
    } else {
      await sellerService.createProduct(form.value)
    }
    closeModal()
    await fetchProducts()
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || 'Ошибка при сохранении товара'
  } finally {
    formLoading.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingProductId.value = null
  form.value = {
    title: '',
    description: '',
    price: 0,
    category_id: '',
    main_image: '',
  }
  errorMessage.value = ''
}

onMounted(async () => {
  // Check if user is a seller
  if (!authStore.user?.is_seller) {
    alert('Вы не являетесь продавцом')
    router.push('/profile')
    return
  }

  // Fetch categories and products
  await productStore.fetchCategories()
  categories.value = productStore.categories
  await fetchProducts()
})
</script>
