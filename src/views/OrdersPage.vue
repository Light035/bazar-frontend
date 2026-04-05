<template>
  <div class="min-h-screen">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8">Мои заказы</h1>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="card p-6 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Orders List -->
      <div v-else-if="orders.length > 0" class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="card p-6"
        >
          <!-- Order Header -->
          <div class="flex justify-between items-start mb-4 pb-4 border-b">
            <div>
              <p class="text-sm text-gray-500">Заказ #{{ order.id }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
            </div>
            <div class="text-right">
              <span
                class="inline-block px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusClass(order.status)"
              >
                {{ getStatusText(order.status) }}
              </span>
              <p class="text-lg font-bold mt-2">{{ formatPrice(order.total_price) }} ₸</p>
            </div>
          </div>

          <!-- Order Items -->
          <div class="space-y-3">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex gap-4"
            >
              <img
                v-if="item.product.main_image"
                :src="item.product.main_image"
                :alt="item.product.title"
                class="w-16 h-16 object-cover rounded"
              />
              <div v-else class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ item.product.title }}</p>
                <p class="text-sm text-gray-500">{{ item.quantity }} × {{ formatPrice(item.price) }} ₸</p>
              </div>

              <div class="text-right">
                <p class="font-medium">{{ formatPrice(item.quantity * item.price) }} ₸</p>
              </div>
            </div>
          </div>

          <!-- Delivery Info -->
          <div class="mt-4 pt-4 border-t">
            <p class="text-sm text-gray-600">
              <span class="font-medium">Адрес доставки:</span> {{ order.address }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Телефон:</span> {{ order.phone }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Нет заказов</h3>
        <p class="mt-2 text-gray-500">Вы еще не сделали ни одного заказа</p>
        <router-link to="/catalog" class="mt-6 inline-block btn-primary">
          Перейти в каталог
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { orderService } from '@/services'
import Navbar from '@/components/Navbar.vue'

const orders = ref([])
const loading = ref(true)

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Ожидает обработки',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
  }
  return texts[status] || status
}

onMounted(async () => {
  try {
    const data = await orderService.getOrders()
    orders.value = data
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    loading.value = false
  }
})
</script>
