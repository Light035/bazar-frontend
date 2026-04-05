<template>
  <div class="min-h-screen">
    <Navbar />

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8">Профиль</h1>

      <!-- Loading State -->
      <div v-if="loading" class="card p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      <!-- Profile Form -->
      <div v-else class="space-y-6">
        <div class="card p-6">
          <h2 class="text-xl font-bold mb-4">Личная информация</h2>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <!-- Success Message -->
            <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              {{ successMessage }}
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {{ errorMessage }}
            </div>

            <!-- Email (read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                :value="authStore.user?.email"
                type="email"
                disabled
                class="input-field bg-gray-50"
              />
            </div>

            <!-- First Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                v-model="form.first_name"
                type="text"
                required
                class="input-field"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                v-model="form.last_name"
                type="text"
                required
                class="input-field"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="input-field"
                placeholder="+7 (___) ___-__-__"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="updating"
              class="w-full btn-primary disabled:opacity-50"
            >
              {{ updating ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
          </form>
        </div>

        <!-- Seller Section -->
        <div class="card p-6">
          <h2 class="text-xl font-bold mb-4">Продавец</h2>

          <div v-if="authStore.user?.is_seller" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="font-medium text-green-900">Вы являетесь продавцом</p>
                <p class="text-sm text-green-700">Вы можете управлять своими товарами</p>
              </div>
            </div>
            <router-link to="/seller" class="mt-4 inline-block btn-primary">
              Перейти в панель продавца
            </router-link>
          </div>

          <div v-else class="space-y-4">
            <p class="text-gray-600">
              Станьте продавцом, чтобы размещать свои товары на платформе
            </p>
            <button
              @click="becomeSeller"
              :disabled="becomingSellerLoading"
              class="btn-primary disabled:opacity-50"
            >
              {{ becomingSellerLoading ? 'Обработка...' : 'Стать продавцом' }}
            </button>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="card p-6">
          <h2 class="text-xl font-bold mb-4">Действия</h2>
          <button
            @click="handleLogout"
            class="w-full btn-secondary text-red-600 hover:bg-red-50"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const updating = ref(false)
const becomingSellerLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
  first_name: '',
  last_name: '',
  phone: '',
})

const updateProfile = async () => {
  updating.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await authStore.updateProfile(form.value)
    successMessage.value = 'Профиль успешно обновлен'
  } catch (error) {
    errorMessage.value = 'Ошибка при обновлении профиля'
  } finally {
    updating.value = false
  }
}

const becomeSeller = async () => {
  becomingSellerLoading.value = true
  try {
    await authStore.becomeSeller()
    alert('Теперь вы продавец!')
  } catch (error) {
    alert('Ошибка при регистрации продавца')
  } finally {
    becomingSellerLoading.value = false
  }
}

const handleLogout = async () => {
  if (confirm('Вы уверены, что хотите выйти?')) {
    await authStore.logout()
    router.push('/')
  }
}

onMounted(async () => {
  await authStore.fetchProfile()
  form.value = {
    first_name: authStore.user?.first_name || '',
    last_name: authStore.user?.last_name || '',
    phone: authStore.user?.phone || '',
  }
  loading.value = false
})
</script>
