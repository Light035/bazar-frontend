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
          <p class="text-sm text-gray-500 mb-1">{{ product.category.name }}</p>
          <p class="text-sm text-gray-600 mb-2">
            <span class="font-medium">Склад:</span> {{ product.stock }} шт.
            <span v-if="!product.is_active" class="ml-2 text-red-600">(Неактивен)</span>
          </p>

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
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
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

          <!-- Stock -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Количество на складе
            </label>
            <input
              v-model.number="form.stock"
              type="number"
              required
              min="0"
              step="1"
              class="input-field"
              placeholder="0"
            />
          </div>

          <!-- Is Active -->
          <div class="flex items-center">
            <input
              v-model="form.is_active"
              type="checkbox"
              id="is_active"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label for="is_active" class="ml-2 text-sm font-medium text-gray-700">
              Активен (показывать в каталоге)
            </label>
          </div>

          <!-- Image Upload Section (only for edit mode) -->
          <div v-if="showEditModal && editingProductId" class="border-t pt-4">
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Изображения товара (макс. 10)
            </label>

            <!-- Existing Images -->
            <div v-if="productImages.length > 0" class="mb-4">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <div
                  v-for="image in productImages"
                  :key="image.id"
                  class="relative group"
                >
                  <img
                    :src="image.thumbnail_url || image.image_url"
                    :alt="form.title"
                    class="w-full aspect-square object-cover rounded-lg"
                    :class="{ 'ring-2 ring-primary-600': image.is_main }"
                  />

                  <!-- Main badge -->
                  <div v-if="image.is_main" class="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    Главное
                  </div>

                  <!-- Actions -->
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      v-if="!image.is_main"
                      @click="setMainImage(image.id)"
                      type="button"
                      class="bg-white text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-100"
                    >
                      Главное
                    </button>
                    <button
                      @click="deleteImage(image.id)"
                      type="button"
                      class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload Zone -->
            <div
              v-if="productImages.length < 10"
              @drop.prevent="handleDrop"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              class="border-2 border-dashed rounded-lg p-6 text-center transition-colors"
              :class="isDragging ? 'border-primary-600 bg-primary-50' : 'border-gray-300'"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                @change="handleFileSelect"
                class="hidden"
              />

              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>

              <p class="mt-2 text-sm text-gray-600">
                Перетащите изображения сюда или
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="text-primary-600 hover:text-primary-700 font-medium"
                >
                  выберите файлы
                </button>
              </p>
              <p class="mt-1 text-xs text-gray-500">
                JPEG, PNG, WebP до 5MB
              </p>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-3">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Загрузка...</span>
                <span>{{ uploadProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-primary-600 h-2 rounded-full transition-all"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
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
const productImages = ref([])
const isDragging = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)

const form = ref({
  title: '',
  description: '',
  price: 0,
  category_id: '',
  stock: 0,
  is_active: true,
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

const fetchProductImages = async (productId) => {
  try {
    const data = await sellerService.getProductImages(productId)
    productImages.value = data
  } catch (error) {
    console.error('Failed to fetch images:', error)
  }
}

const editProduct = async (product) => {
  editingProductId.value = product.id
  form.value = {
    title: product.title,
    description: product.description,
    price: product.price,
    category_id: product.category.id,
    stock: product.stock,
    is_active: product.is_active,
  }
  showEditModal.value = true
  await fetchProductImages(product.id)
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

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  uploadImages(files)
}

const handleDrop = (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files).filter(file =>
    file.type.startsWith('image/')
  )
  uploadImages(files)
}

const uploadImages = async (files) => {
  if (!editingProductId.value) return

  for (const file of files) {
    if (productImages.value.length >= 10) {
      alert('Максимум 10 изображений на товар')
      break
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(`Файл ${file.name} слишком большой. Максимум 5MB`)
      continue
    }

    const formData = new FormData()
    formData.append('image', file)
    formData.append('is_main', productImages.value.length === 0)

    try {
      uploadProgress.value = 0
      await sellerService.uploadProductImage(
        editingProductId.value,
        formData,
        (progressEvent) => {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      )
      await fetchProductImages(editingProductId.value)
    } catch (error) {
      alert(`Ошибка загрузки ${file.name}: ${error.response?.data?.error || 'Неизвестная ошибка'}`)
    } finally {
      uploadProgress.value = 0
    }
  }
}

const setMainImage = async (imageId) => {
  try {
    await sellerService.updateProductImage(editingProductId.value, imageId, { is_main: true })
    await fetchProductImages(editingProductId.value)
  } catch (error) {
    alert('Ошибка при установке главного изображения')
  }
}

const deleteImage = async (imageId) => {
  if (!confirm('Удалить это изображение?')) return

  try {
    await sellerService.deleteProductImage(editingProductId.value, imageId)
    await fetchProductImages(editingProductId.value)
  } catch (error) {
    alert('Ошибка при удалении изображения')
  }
}

const submitForm = async () => {
  formLoading.value = true
  errorMessage.value = ''

  try {
    if (showEditModal.value) {
      await sellerService.updateProduct(editingProductId.value, form.value)
      closeModal()
      await fetchProducts()
    } else {
      // Create product and redirect to edit mode to add images
      const newProduct = await sellerService.createProduct(form.value)
      closeModal()
      await fetchProducts()

      // Open edit modal for the newly created product to add images
      const createdProduct = products.value.find(p => p.id === newProduct.id)
      if (createdProduct) {
        await editProduct(createdProduct)
      }
    }
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
  productImages.value = []
  form.value = {
    title: '',
    description: '',
    price: 0,
    category_id: '',
    stock: 0,
    is_active: true,
  }
  errorMessage.value = ''
  uploadProgress.value = 0
}

onMounted(async () => {
  if (!authStore.user?.is_seller) {
    alert('Вы не являетесь продавцом')
    router.push('/profile')
    return
  }

  await productStore.fetchCategories()
  categories.value = productStore.categories
  await fetchProducts()
})
</script>
