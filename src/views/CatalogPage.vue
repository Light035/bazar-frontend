<template>
  <div class="min-h-screen">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="card p-6 sticky top-20">
            <h3 class="font-bold text-lg mb-4">Фильтры</h3>

            <!-- Categories -->
            <div class="mb-6">
              <h4 class="font-medium mb-3">Категории</h4>
              <div class="space-y-2">
                <label
                  v-for="category in categories"
                  :key="category.id"
                  class="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    :value="category.slug"
                    v-model="filters.category"
                    @change="applyFilters"
                    class="text-primary-600 focus:ring-primary-500"
                  />
                  <span class="ml-2 text-sm">{{ category.name }}</span>
                </label>
                <button
                  v-if="filters.category"
                  @click="clearCategory"
                  class="text-sm text-primary-600 hover:text-primary-700"
                >
                  Сбросить
                </button>
              </div>
            </div>

            <!-- Sort -->
            <div>
              <h4 class="font-medium mb-3">Сортировка</h4>
              <select
                v-model="filters.ordering"
                @change="applyFilters"
                class="input-field text-sm"
              >
                <option value="">По умолчанию</option>
                <option value="price">Цена: по возрастанию</option>
                <option value="-price">Цена: по убыванию</option>
                <option value="-average_rating">По рейтингу</option>
                <option value="-created_at">Новинки</option>
              </select>
            </div>
          </div>
        </aside>

        <!-- Products Grid -->
        <div class="flex-1">
          <!-- Results Header -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold mb-2">
              {{ filters.search ? `Результаты поиска: "${filters.search}"` : 'Каталог товаров' }}
            </h1>
            <p class="text-gray-600">
              Найдено товаров: {{ productStore.pagination.count || products.length }}
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 9" :key="i" class="card p-4 animate-pulse">
              <div class="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>

          <!-- Products -->
          <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- No Results -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Товары не найдены</h3>
            <p class="mt-1 text-sm text-gray-500">Попробуйте изменить фильтры</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import Navbar from '@/components/Navbar.vue'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const products = ref([])
const categories = ref([])
const loading = ref(true)

const filters = ref({
  search: route.query.search || '',
  category: route.query.category || '',
  ordering: route.query.ordering || '',
})

const applyFilters = () => {
  const query = {}
  if (filters.value.search) query.search = filters.value.search
  if (filters.value.category) query.category = filters.value.category
  if (filters.value.ordering) query.ordering = filters.value.ordering

  router.push({ name: 'catalog', query })
}

const clearCategory = () => {
  filters.value.category = ''
  applyFilters()
}

const fetchProducts = async () => {
  loading.value = true
  const params = {}
  if (filters.value.search) params.search = filters.value.search
  if (filters.value.category) params.category__slug = filters.value.category
  if (filters.value.ordering) params.ordering = filters.value.ordering

  await productStore.fetchProducts(params)
  products.value = productStore.products
  loading.value = false
}

watch(() => route.query, (newQuery) => {
  filters.value.search = newQuery.search || ''
  filters.value.category = newQuery.category || ''
  filters.value.ordering = newQuery.ordering || ''
  fetchProducts()
})

onMounted(async () => {
  await productStore.fetchCategories()
  categories.value = productStore.categories
  await fetchProducts()
})
</script>
