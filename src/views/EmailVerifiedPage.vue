<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <div class="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-3xl">B</span>
        </div>
      </router-link>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Loading State -->
        <div v-if="loading" class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Verifying your email...</p>
        </div>

        <!-- Success State -->
        <div v-else-if="verified" class="text-center">
          <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <h2 class="mt-4 text-2xl font-bold text-gray-900">
            Email Verified!
          </h2>

          <p class="mt-2 text-gray-600">
            Your email has been successfully verified. You can now access all features of Bazar.
          </p>

          <div class="mt-6">
            <router-link to="/catalog" class="w-full btn-primary inline-block text-center">
              Start Shopping
            </router-link>
          </div>

          <div class="mt-4">
            <router-link to="/profile" class="text-sm text-primary-600 hover:text-primary-500">
              Go to Profile
            </router-link>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center">
          <svg class="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <h2 class="mt-4 text-2xl font-bold text-gray-900">
            Verification Failed
          </h2>

          <p class="mt-2 text-red-600">
            {{ errorMessage }}
          </p>

          <div class="mt-6 space-y-3">
            <router-link to="/email-verification" class="w-full btn-primary inline-block text-center">
              Request New Link
            </router-link>

            <router-link to="/login" class="block text-sm text-primary-600 hover:text-primary-500">
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const verified = ref(false)
const errorMessage = ref('')

const verifyEmail = async () => {
  const token = route.params.token

  if (!token) {
    errorMessage.value = 'Invalid verification link'
    loading.value = false
    return
  }

  try {
    const response = await authService.verifyEmail(token)

    // Store tokens and user data
    localStorage.setItem('access_token', response.access)
    localStorage.setItem('refresh_token', response.refresh)
    authStore.user = response.user
    authStore.isAuthenticated = true

    verified.value = true
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.response?.data?.message || 'Verification failed. The link may be invalid or expired.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  verifyEmail()
})
</script>
