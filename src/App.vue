<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth state on app load
  if (authStore.isAuthenticated) {
    authStore.fetchProfile()
  }
})
</script>
