<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
    <div class="card w-full max-w-md p-8 animate-fade-in">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">DeliveryTracker Pro</h1>
        <p class="text-gray-600">Sign in to track your deliveries</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            v-model="credentials.email"
            type="email"
            required
            class="input-field"
            placeholder="Enter your email"
            :disabled="authStore.loading"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            required
            class="input-field"
            placeholder="Enter your password"
            :disabled="authStore.loading"
          />
        </div>
        
        <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <p class="text-sm text-red-800">{{ authStore.error }}</p>
          </div>
        </div>
        
        <button
          type="submit"
          class="btn-primary w-full flex items-center justify-center"
          :disabled="authStore.loading"
        >
          <div v-if="authStore.loading" class="loading-spinner mr-2"></div>
          <span v-if="!authStore.loading">Sign In</span>
          <span v-else>Signing In...</span>
        </button>
      </form>
      
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-center text-sm text-gray-600">
          Demo credentials: cdric.hounnou@gmail.com / Pass@2024
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = inject('authStore')

const credentials = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  const result = await authStore.login(credentials.value)
  
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>