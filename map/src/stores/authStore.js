import { reactive } from 'vue'
import axios from 'axios'

const state = reactive({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
})

const mockUser = {
  userId: "684137d6d7251b24abd8df01",
  name: "HOUNNOU",
  surname: "Sessi",
  email: "cdric.hounnou@gmail.com",
  phone_number: "+2290163001717",
  message: "Connexion réussie !",
  role: "COURSIER",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQxMzdkNmQ3MjUxYjI0YWJkOGRmMDEiLCJuYW1lIjoiSE9VTk5PVSIsInN1cm5hbWUiOiJTZXNzaSIsImVtYWlsIjoiY2RyaWMuaG91bm5vdUBnbWFpbC5jb20iLCJwaG9uZV9udW1iZXIiOiIrMjI5MDE2MzAwMTcxNyIsInJvbGUiOiJDT1VSU0lFUiIsImlhdCI6MTc1MDQyNjUyMCwiZXhwIjoxNzUwNTEyOTIwfQ.xuFiyJrWWCUzayRU0Acn-iEk7c2LIsKIwVuod3gXqRw"
}

export function useAuthStore() {
  const login = async (credentials) => {
    state.loading = true
    state.error = null
    
    try {
      // Replace with your actual API endpoint
      // const response = await axios.post('http://5.189.186.118:8000/login', credentials)
      
      // const userData = response.data
      if (credentials.email === 'cdric.hounnou@gmail.com' && credentials.password === 'Pass@2024') {
        // Simulate successful login with mock data
        var userData = mockUser
      }
      state.user = {
        userId: userData.userId,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        phone_number: userData.phone_number,
        message: userData.message,
        role: userData.role
      }
      
      state.token = userData.token
      state.isAuthenticated = true
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_token', userData.token)
      localStorage.setItem('user_data', JSON.stringify(state.user))
      
      return { success: true }
    } catch (error) {
      state.error = error.response?.data?.message || 'Login failed'
      return { success: false, error: state.error }
    } finally {
      state.loading = false
    }
  }
  
  const logout = () => {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    state.error = null
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }
  
  const initializeAuth = () => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      state.token = token
      state.user = JSON.parse(userData)
      state.isAuthenticated = true
      
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }
  
  // Initialize auth on store creation
  initializeAuth()
  
  return {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    
    // Actions
    login,
    logout,
    initializeAuth
  }
}