<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <div class="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-3xl">B</span>
        </div>
      </router-link>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Регистрация
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Уже есть аккаунт?
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          Войти
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Error Messages -->
          <div v-if="errors.length > 0" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            <ul class="list-disc list-inside">
              <li v-for="(err, index) in errors" :key="index">{{ err }}</li>
            </ul>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field mt-1"
              placeholder="your@email.com"
            />
          </div>

          <!-- First Name -->
          <div>
            <label for="first_name" class="block text-sm font-medium text-gray-700">
              Имя
            </label>
            <input
              id="first_name"
              v-model="form.first_name"
              type="text"
              required
              class="input-field mt-1"
              placeholder="Иван"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label for="last_name" class="block text-sm font-medium text-gray-700">
              Фамилия
            </label>
            <input
              id="last_name"
              v-model="form.last_name"
              type="text"
              required
              class="input-field mt-1"
              placeholder="Иванов"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="8"
              class="input-field mt-1"
              placeholder="Минимум 8 символов"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="password2" class="block text-sm font-medium text-gray-700">
              Подтвердите пароль
            </label>
            <input
              id="password2"
              v-model="form.password2"
              type="password"
              required
              class="input-field mt-1"
              placeholder="Повторите пароль"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50"
          >
            <span v-if="loading">Регистрация...</span>
            <span v-else>Зарегистрироваться</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  password2: '',
})

const loading = ref(false)
const errors = ref([])

const handleRegister = async () => {
  loading.value = true
  errors.value = []

  try {
    const response = await authStore.register(form.value)
    // Redirect to email verification page
    router.push({
      name: 'email-verification',
      query: { email: form.value.email }
    })
  } catch (err) {
    const errorData = err.response?.data
    if (errorData) {
      Object.keys(errorData).forEach(key => {
        if (Array.isArray(errorData[key])) {
          errors.value.push(...errorData[key])
        } else {
          errors.value.push(errorData[key])
        }
      })
    } else {
      errors.value.push('Ошибка регистрации')
    }
  } finally {
    loading.value = false
  }
}
</script>
