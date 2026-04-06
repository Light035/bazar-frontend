<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <div class="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-3xl">B</span>
        </div>
      </router-link>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Reset Password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your email address and we'll send you a link to reset your password
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Success Message -->
          <div v-if="success" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            <p class="font-medium">Email sent!</p>
            <p class="text-sm mt-1">Check your inbox for the password reset link.</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {{ error }}
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input-field mt-1"
              placeholder="your@email.com"
              :disabled="success"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || success"
            class="w-full btn-primary disabled:opacity-50"
          >
            <span v-if="loading">Sending...</span>
            <span v-else-if="success">Email Sent</span>
            <span v-else>Send Reset Link</span>
          </button>

          <div class="text-center">
            <router-link to="/login" class="text-sm text-primary-600 hover:text-primary-500">
              Back to Login
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authService } from '@/services'

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    await authService.requestPasswordReset(email.value)
    success.value = true
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to send reset email'
  } finally {
    loading.value = false
  }
}
</script>
