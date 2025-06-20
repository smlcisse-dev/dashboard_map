<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
              </svg>
            </div>
            <h1 class="text-xl font-semibold text-gray-900">DeliveryTracker Pro</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              Welcome, <span class="font-medium">{{ authStore.user?.name }} {{ authStore.user?.surname }}</span>
            </div>
            <button
              @click="handleLogout"
              class="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Delivery Tracking</h2>
        <p class="text-gray-600">Track your delivery routes and calculate distances</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
      </div>

      <!-- Map Container -->
      <div v-if="deliveryData" class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Delivery Route Map</h3>
        <div id="map" class="map-container h-96 w-full"></div>
      </div>

      <!-- Location Details Modal -->
      <div v-if="selectedLocation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
        <div class="card p-6 w-full max-w-md animate-slide-in">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ selectedLocation.type === 'departure' ? 'Departure Location' : 'Arrival Location' }}
            </h3>
            <button @click="selectedLocation = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <!-- <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
              <p class="text-sm text-gray-600">
                {{ selectedLocation.data.latitude }}, {{ selectedLocation.data.longitude }}
              </p>
            </div> -->
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Distance</label>
              <p class="text-lg font-semibold text-primary-600">{{ deliveryData.Distance }} km</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p class="text-sm text-gray-600">{{ deliveryData.description }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="selectedLocation = null" class="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import L from 'leaflet'

const router = useRouter()
const authStore = inject('authStore')

const loading = ref(false)
const error = ref(null)
const deliveryData = ref(null)
const selectedLocation = ref(null)
let map = null

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const calculatePrice = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Replace with your actual API endpoint
    const response = await axios.post('/calculate-price', {
      // Add any required parameters here
    })
    
    deliveryData.value = response.data
    
    // Initialize map after data is loaded
    await nextTick()
    initializeMap()
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to calculate price. Using demo data for demonstration.'
    
    // Demo data for testing
    deliveryData.value = {
      departure_location: {
        latitude: 6.366078,
        longitude: 2.4290878
      },
      arrival_location: {
        latitude: 7.755388,
        longitude: -5.005432
      },
      Distance: "200",
      description: "Colis fragile à livrer",
      ReceiverData: {},
      SenderData: {}
    }
    
    await nextTick()
    initializeMap()
  } finally {
    loading.value = false
  }
}

const initializeMap = () => {
  if (map) {
    map.remove()
  }
  
  const departureLocation = deliveryData.value.departure_location
  const arrivalLocation = deliveryData.value.arrival_location
  
  // Calculate center point between departure and arrival
  const centerLat = (departureLocation.latitude + arrivalLocation.latitude) / 2
  const centerLng = (departureLocation.longitude + arrivalLocation.longitude) / 2
  
  // Initialize map
  map = L.map('map').setView([centerLat, centerLng], 8)
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)
  
  // Custom icons
  const departureIcon = L.divIcon({
    className: 'custom-marker departure-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
  
  const arrivalIcon = L.divIcon({
    className: 'custom-marker arrival-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
  
  // Add departure marker
  const departureMarker = L.marker([departureLocation.latitude, departureLocation.longitude], {
    icon: departureIcon
  }).addTo(map)
  
  departureMarker.on('click', () => {
    selectedLocation.value = {
      type: 'departure',
      data: departureLocation
    }
  })
  
  // Add arrival marker
  const arrivalMarker = L.marker([arrivalLocation.latitude, arrivalLocation.longitude], {
    icon: arrivalIcon
  }).addTo(map)
  
  arrivalMarker.on('click', () => {
    selectedLocation.value = {
      type: 'arrival',
      data: arrivalLocation
    }
  })
  
  // Add route line
  const routeLine = L.polyline([
    [departureLocation.latitude, departureLocation.longitude],
    [arrivalLocation.latitude, arrivalLocation.longitude]
  ], {
    color: '#3b82f6',
    weight: 3,
    opacity: 0.8
  }).addTo(map)
  
  // Fit map to show both markers
  const group = new L.featureGroup([departureMarker, arrivalMarker])
  map.fitBounds(group.getBounds().pad(0.1))
  
  // Add popups
  departureMarker.bindPopup(`
    <div class="text-center">
      <strong>Departure Location</strong><br>
      <small>Click marker for details</small>
    </div>
  `)
  
  arrivalMarker.bindPopup(`
    <div class="text-center">
      <strong>Arrival Location</strong><br>
      <small>Click marker for details</small>
    </div>
  `)
}

onMounted(() => {
  // Set axios default header if token exists
  // if (authStore.token) {
  //   axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
  // }
  
  calculatePrice()
})
</script>