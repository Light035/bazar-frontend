<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <div class="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-3xl">B</span>
        </div>
      </router-link>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        Check Your Email
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        We've sent a verification link to
        <span class="font-medium text-gray-900">{{ email }}</span>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <svg class="mx-auto h-16 w-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>

          <h3 class="mt-4 text-lg font-medium text-gray-900">
            Verification Email Sent
          </h3>

          <p class="mt-2 text-sm text-gray-600">
            Please check your inbox and click the verification link to activate your account.
          </p>

          <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-800">
              <strong>Didn't receive the email?</strong>
            </p>
            <ul class="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>Check your spam folder</li>
              <li>Make sure the email address is correct</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>

          <div class="mt-6">
            <button
              @click="resendEmail"
              :disabled="resending || countdown > 0"
              class="w-full btn-secondary disabled:opacity-50"
            >
              <span v-if="resending">Sending...</span>
              <span v-else-if="countdown > 0">Resend in {{ countdown }}s</span>
              <span v-else>Resend Verification Email</span>
            </button>
          </div>

          <div v-if="message" class="mt-4 text-sm" :class="messageClass">
            {{ message }}
          </div>

          <div class="mt-6">
            <router-link to="/login" class="text-sm text-primary-600 hover:text-primary-500">
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { authService } from '@/services'

const route = useRoute()
const email = ref(route.query.email || '')
const resending = ref(false)
const countdown = ref(0)
const message = ref('')
const messageClass = ref('')

let countdownInterval = null

const startCountdown = () => {
  countdown.value = 60
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval)
    }
  }, 1000)
}

const resendEmail = async () => {
  if (!email.value) {
    message.value = 'Email address is required'
    messageClass.value = 'text-red-600'
    return
  }

  resending.value = true
  message.value = ''

  try {
    await authService.resendVerification(email.value)
    message.value = 'Verification email sent successfully!'
    messageClass.value = 'text-green-600'
    startCountdown()
  } catch (error) {
    message.value = error.response?.data?.error || 'Failed to send email'
    messageClass.value = 'text-red-600'
  } finally {
    resending.value = false
  }
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>
