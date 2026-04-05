<template>
  <div class="min-h-screen">
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8">Корзина</h1>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="!cartStore.items.length" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Корзина пуста</h3>
        <p class="mt-2 text-gray-500">Добавьте товары из каталога</p>
        <router-link to="/catalog" class="mt-6 inline-block btn-primary">
          Перейти в каталог
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="card p-4 flex gap-4"
          >
            <!-- Product Image -->
            <router-link
              :to="{ name: 'product', params: { slug: item.product.slug } }"
              class="flex-shrink-0"
            >
              <img
                v-if="item.product.main_image"
                :src="item.product.main_image"
                :alt="item.product.title"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div v-else class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </router-link>

            <!-- Product Info -->
            <div class="flex-1">
              <router-link
                :to="{ name: 'product', params: { slug: item.product.slug } }"
                class="font-medium text-gray-900 hover:text-primary-600"
              >
                {{ item.product.title }}
              </router-link>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatPrice(item.product.price) }} ₸
              </p>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-3 mt-3">
                <button
                  @click="updateQuantity(item.id, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                  class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
                <button
                  @click="updateQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Price & Remove -->
            <div class="text-right">
              <p class="text-lg font-bold text-gray-900">
                {{ formatPrice(item.total_price) }} ₸
              </p>
              <button
                @click="removeItem(item.id)"
                class="mt-2 text-red-600 hover:text-red-700 text-sm"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="card p-6 sticky top-20">
            <h3 class="font-bold text-lg mb-4">Итого</h3>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Товары ({{ cartStore.itemCount }})</span>
                <span class="font-medium">{{ formatPrice(cartStore.totalPrice) }} ₸</span>
              </div>
              <div class="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span class="text-primary-600">{{ formatPrice(cartStore.totalPrice) }} ₸</span>
              </div>
            </div>

            <button
              @click="showCheckoutModal = true"
              class="w-full btn-primary mb-3"
            >
              Оформить заказ
            </button>

            <button
              @click="clearCart"
              class="w-full btn-secondary text-sm"
            >
              Очистить корзину
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <div
      v-if="showCheckoutModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showCheckoutModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Оформление заказа</h3>

        <form @submit.prevent="createOrder" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Адрес доставки
            </label>
            <textarea
              v-model="orderForm.address"
              required
              rows="3"
              class="input-field"
              placeholder="Город, улица, дом, квартира"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              v-model="orderForm.phone"
              type="tel"
              required
              class="input-field"
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="showCheckoutModal = false"
              class="flex-1 btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="orderLoading"
              class="flex-1 btn-primary disabled:opacity-50"
            >
              {{ orderLoading ? 'Оформление...' : 'Подтвердить' }}
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
import { useCartStore } from '@/stores/cart'
import { orderService } from '@/services'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(true)
const showCheckoutModal = ref(false)
const orderLoading = ref(false)

const orderForm = ref({
  address: '',
  phone: '',
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const updateQuantity = async (itemId, quantity) => {
  await cartStore.updateQuantity(itemId, quantity)
}

const removeItem = async (itemId) => {
  if (confirm('Удалить товар из корзины?')) {
    await cartStore.removeItem(itemId)
  }
}

const clearCart = async () => {
  if (confirm('Очистить всю корзину?')) {
    await cartStore.clearCart()
  }
}

const createOrder = async () => {
  orderLoading.value = true
  try {
    await orderService.createOrder(orderForm.value)
    showCheckoutModal.value = false
    router.push({ name: 'orders' })
  } catch (error) {
    alert('Ошибка при создании заказа')
  } finally {
    orderLoading.value = false
  }
}

onMounted(async () => {
  await cartStore.fetchCart()
  loading.value = false
})
</script>
