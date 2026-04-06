<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <div class="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-3xl">B</span>
        </div>
      </router-link>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Set New Password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your new password below
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Success Message -->
          <div v-if="success" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            <p class="font-medium">Password reset successful!</p>
            <p class="text-sm mt-1">You can now login with your new password.</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {{ error }}
          </div>

          <!-- New Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="8"
              class="input-field mt-1"
              placeholder="Minimum 8 characters"
              :disabled="success"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="password2" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="password2"
              v-model="password2"
              type="password"
              required
              class="input-field mt-1"
              placeholder="Re-enter your password"
              :disabled="success"
            />
          </div>

          <!-- Password Requirements -->
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs font-medium text-gray-700 mb-2">Password must:</p>
            <ul class="text-xs text-gray-600 space-y-1">
              <li :class="password.length >= 8 ? 'text-green-600' : ''">
                ✓ Be at least 8 characters long
              </li>
              <li :class="password === password2 && password.length > 0 ? 'text-green-600' : ''">
                ✓ Match the confirmation
              </li>
            </ul>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || success"
            class="w-full btn-primary disabled:opacity-50"
          >
            <span v-if="loading">Resetting...</span>
            <span v-else-if="success">Password Reset</span>
            <span v-else>Reset Password</span>
          </button>

          <div class="text-center">
            <router-link v-if="success" to="/login" class="text-sm text-primary-600 hover:text-primary-500">
              Go to Login
            </router-link>
            <router-link v-else to="/password-reset" class="text-sm text-primary-600 hover:text-primary-500">
              Request New Link
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authService } from '@/services'

const route = useRoute()

const password = ref('')
const password2 = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''

  if (password.value !== password2.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }

  loading.value = true

  try {
    const token = route.params.token
    await authService.confirmPasswordReset(token, password.value)
    success.value = true
  } catch (err) {
    error.value = err.response?.data?.error || err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!route.params.token) {
    error.value = 'Invalid reset link'
  }
})
</script>
