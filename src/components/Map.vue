
<template>
  <div class="container-fluid map-page">
    <h1 class="mt-3 mb-3">Pet Stores & Clinics Near You</h1>

    <!-- Search and Filter Controls -->
    <div class="controls-container mb-3">
      <!-- Location Search Bar -->
      <div class="search-bar-container mb-3">
        <div class="search-input-wrapper">
          <input
            ref="searchInput"
            type="text"
            class="form-control"
            placeholder="Enter your location or use your current location by clicking the button on the right!"
            v-model="searchLocation"
          />
          <button 
            v-if="searchLocation"
            @click="clearLocation" 
            class="clear-btn"
            title="Clear location"
            label="x"
          >
            ✕
          </button>
        </div>
        <Button @click="getCurrentLocation" label="📍 Use My Location" outline color="secondary">
          
        </Button>
      </div>

      <!-- Category Selection -->
      <div class="category-selection mb-3">
        <label class="mb-2"><strong>Place Types:</strong></label>
        <div class="category-pills">
          <ButtonTogglable
            :initialState="selectedCategories.petStores"
            labelOFF="Pet Stores"
            labelON="Pet Stores"
            colorOFF="secondary"
            colorON="primary"
            iconLinkON="bi-basket-fill"
            iconLinkOFF="bi-basket"
            @toggle="(v) => (selectedCategories.petStores = v, searchPlaces())"
          />

          <ButtonTogglable
            :initialState="selectedCategories.vetClinics"
            labelOFF="Vet Clinics"
            labelON="Vet Clinics"
            colorOFF="secondary"
            colorON="danger"
            iconLinkON="bi-hospital-fill"
            iconLinkOFF="bi-hospital"            
            @toggle="(v) => (selectedCategories.vetClinics = v, searchPlaces())"
          />
        </div>
      </div>

      <!-- Radius Slider -->
      <div class="radius-slider mb-3">
        <label for="radiusSlider" class="form-label">
          <strong>Search Radius: {{ radius }}m</strong>
        </label>
        <input
          type="range"
          class="form-range"
          id="radiusSlider"
          min="100"
          max="2000"
          step="100"
          v-model.number="radius"
          @input="updateRadius"
        />
        <div class="d-flex justify-content-between">
          <span>100m</span>
          <span>2000m</span>
        </div>
      </div>
    </div>

    <!-- Map container -->
    <div id="map" style="height: 500px; width: 100%; border: 1px solid #ddd;"></div>

    <!-- Loading indicator -->
    <div v-if="loading" class="text-center mt-3">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- No results message -->
    <div v-else-if="!loading && allPlaces.length === 0 && searchAttempted" class="alert alert-warning mt-4" role="alert">
      <h5 class="alert-heading">😕 No Results Found</h5>
      <p class="mb-0">
        There are no <strong>{{ getSelectedCategoriesText() }}</strong> found within {{ radius }}m of your location.
        <br>
        Perhaps try increasing the radius size or selecting different categories?
      </p>
    </div>

    <!-- Results filter (appears only if there are >10 results) -->
    <div v-else-if="allPlaces.length > 10" class="results-filter mt-3">
      <div class="d-flex align-items-center justify-content-center gap-3">
        <label><strong>Sort by:</strong></label>
        <div class="btn-group" role="group" aria-label="Sort filter">
          <Button
            :class="sortMode === 'rating' ? 'btn-primary' : 'btn-outline-primary'"
            @click="setSortMode('rating')"
            label="⭐ Top Rated"
          >
            
          </Button>
          <Button
            class="btn btn-sm ms-1"
            :class="sortMode === 'distance' ? 'btn-primary' : 'btn-outline-primary'"
            @click="setSortMode('distance')"
            label="📍 Nearest"
          >
            
          </Button>
        </div>
        <div class="btn-group ms-3" role="group" aria-label="Result filter">
          <Button
            :class="showMode === 'top10' ? 'btn-success' : 'btn-outline-success'"
            @click="setShowMode('top10')"
            label="Show top 10"
          >
          </Button>
          <Button
            class="ms-1"
            :class="showMode === 'all' ? 'btn-success' : 'btn-outline-success'"
            @click="setShowMode('all')"
            :label="'Show All (' + allPlaces.length + ')'"
          >
            
          </Button>
        </div>
      </div>
    </div>

    <!-- Cards container -->
    <div v-if="!loading && allPlaces.length > 0" class="cards-container mt-4">
      <div
        v-for="place in filteredPlaces"
        :key="place.place_id"
        class="card"
      >
        <!-- Favorite Button -->
        <button 
          class="favorite-btn"
          :class="{ favorited: isFavorite(place.place_id) }"
          @click="toggleFavorite(place)"
          title="Add to favorites"
        >
          {{ isFavorite(place.place_id) ? '❤️' : '🤍' }}
        </button>

        <div class="card-content">
          <h5 class="card-title">
            <span class="me-2">{{ getCategoryLabel(place) }}</span>
            {{ place.name }}
          </h5>
          <p class="card-text">
            <small>📍 {{ place.vicinity || place.formatted_address }}</small>
          </p>
          <p class="card-text">
            <small class="text-muted">
              🚶 {{ place.distance }}m away
            </small>
          </p>
          <p class="card-text">
            <small class="text-muted">
              ⭐ {{ place.rating || 'N/A' }} ({{ place.user_ratings_total || 0 }} reviews)
            </small>
          </p>
          
          <!-- Today's Opening Hours -->
          <div v-if="place.opening_hours && place.opening_hours.weekday_text" class="opening-hours-today mb-2">
            <small class="text-muted">
              <strong>🕐 Today:</strong> {{ getTodayHours(place.opening_hours.weekday_text) }}
            </small>
          </div>
        </div>
        <div class="card-footer-btn">
          <Button
            v-if="place.opening_hours"
            class=" w-100"
            :class="place.opening_hours.open_now ? 'btn-success' : 'btn-danger'"
            :label=" place.opening_hours.open_now ? '🟢 Open Now' : '🔴 Closed'"
          >
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import Button from './atoms/button.vue'
import searchBar from './atoms/searchBar.vue'
import ButtonTogglable from './atoms/buttonTogglable.vue'
const searchInput = ref(null)
const searchLocation = ref('')
const selectedCategories = ref({
  petStores: true,
  vetClinics: true
})
const radius = ref(1000)
const loading = ref(false)
const searchAttempted = ref(false)
const allPlaces = ref([])
const showMode = ref('all')
const sortMode = ref('rating') // 'rating' or 'distance'
const favorites = ref([]) // Array of favorite place IDs

const filteredPlaces = computed(() => {
  let sorted = [...allPlaces.value]
  
  // Sort based on selected mode
  if (sortMode.value === 'rating') {
    sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  } else if (sortMode.value === 'distance') {
    sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0))
  }
  
  // Return top 10 or all based on showMode
  return showMode.value === 'top10' ? sorted.slice(0, 10) : sorted
})

let map = null
let service = null
let infowindow = null
let currentCircle = null
let markers = []
let currentLocation = { lat: 1.3521, lng: 103.8198 }
let markerIcons = {}

onMounted(() => {
  // Load favorites from localStorage
  const savedFavorites = localStorage.getItem('petStoreFavorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }

  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`
  script.async = true
  script.defer = true
  document.head.appendChild(script)

  script.onload = () => {
    markerIcons = {
      petStore: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#4285F4" stroke="white" stroke-width="2"/>
            <text x="20" y="28" font-size="20" text-anchor="middle" fill="white">🏪</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      },
      vetClinic: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#EA4335" stroke="white" stroke-width="2"/>
            <text x="20" y="28" font-size="20" text-anchor="middle" fill="white">🏥</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      }
    }
    
    initializeMap()
    getCurrentLocation()
  }
})

function initializeMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: currentLocation,
    zoom: 14,
  })

  service = new google.maps.places.PlacesService(map)
  infowindow = new google.maps.InfoWindow()

  const autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
    componentRestrictions: { country: 'sg' },
    fields: ['geometry', 'formatted_address', 'name']
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (place.geometry) {
      currentLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      const displayText = place.name 
        ? `${place.name}, ${place.formatted_address}`
        : place.formatted_address
      searchLocation.value = displayText
      map.setCenter(currentLocation)
      searchPlaces()
    }
  })
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    loading.value = true
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        map.setCenter(currentLocation)
        
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ location: currentLocation }, (results, status) => {
          if (status === 'OK' && results[0]) {
            searchLocation.value = results[0].formatted_address
          }
        })
        
        searchPlaces()
        loading.value = false
      },
      (error) => {
        console.error('Error getting location:', error)
        loading.value = false
        searchPlaces()
      }
    )
  } else {
    searchPlaces()
  }
}

function updateRadius() {
  if (currentCircle) {
    currentCircle.setRadius(radius.value)
  }
  searchPlaces()
}

function searchPlaces() {
  // Clear markers immediately
  markers.forEach(marker => marker.setMap(null))
  markers = []
  
  // Clear places array completely
  allPlaces.value = []
  
  searchAttempted.value = true
  showMode.value = 'all' // Reset to 'all' on new search

  if (currentCircle) {
    currentCircle.setMap(null)
  }

  currentCircle = new google.maps.Circle({
    strokeColor: '#4285F4',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#4285F4',
    fillOpacity: 0.15,
    map: map,
    center: currentLocation,
    radius: radius.value
  })

  map.fitBounds(currentCircle.getBounds())

  const types = []
  if (selectedCategories.value.petStores) {
    types.push('pet_store')
  }
  if (selectedCategories.value.vetClinics) {
    types.push('veterinary_care')
  }

  if (types.length === 0) {
    return
  }

  loading.value = true
  let pending = types.length
  const seen = new Set()
  const tempPlaces = [] // Use temporary array to collect results

  types.forEach(type => {
    const request = {
      location: currentLocation,
      radius: radius.value,
      type: type
    }

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        results.forEach(place => {
          // Filter out places without reviews or opening hours
          if (!place.rating || !place.user_ratings_total || !place.opening_hours) {
            return // Skip this place
          }
          
          if (!seen.has(place.place_id)) {
            seen.add(place.place_id)
            place.categoryType = type
            
            // Calculate distance from current location
            const placeLatLng = place.geometry.location
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
              placeLatLng
            )
            place.distance = Math.round(distance) // Store distance in meters
            
            tempPlaces.push(place)
          }
        })
      }
      pending -= 1
      if (pending === 0) {
        // Only update allPlaces once all requests are complete
        allPlaces.value = tempPlaces
        loading.value = false
        renderMarkers()
      }      
    })
  })
}

function renderMarkers() {
  // Clear ALL existing markers first
  markers.forEach(marker => marker.setMap(null))
  markers = []

  // Add markers only for filtered list (first 10 or all)
  filteredPlaces.value.forEach(place => {
    createMarker(place)
  })
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: place.categoryType === 'pet_store' 
      ? markerIcons.petStore
      : markerIcons.vetClinic
  })

  marker.addListener('click', () => {
    infowindow.setContent(`
      <div>
        <strong>${getCategoryLabel(place)} ${place.name}</strong><br>
        ${place.vicinity}<br>
        Rating: ${place.rating || 'N/A'} ⭐<br>
        ${place.opening_hours ? (place.opening_hours.open_now ? '<span style="color:green">Open Now</span>' : '<span style="color:red">Closed</span>') : ''}
      </div>
    `)
    infowindow.open(map, marker)
  })

  markers.push(marker)
}

function getCategoryLabel(place) {
  if (place.categoryType === 'pet_store') {
    return '🏪'
  } else if (place.categoryType === 'veterinary_care') {
    return '🏥'
  }
  return ''
}

function toggleCategory(category) {
  selectedCategories.value[category] = !selectedCategories.value[category]
  searchPlaces()
}

function getSelectedCategoriesText() {
  const selected = []
  if (selectedCategories.value.petStores) selected.push('pet stores')
  if (selectedCategories.value.vetClinics) selected.push('vet clinics')
  
  if (selected.length === 0) return 'places'
  if (selected.length === 1) return selected[0]
  return selected.join(' or ')
}

function clearLocation() {
  searchLocation.value = ''
  searchInput.value.focus()
}

function setShowMode(mode) {
  showMode.value = mode
}

function setSortMode(mode) {
  sortMode.value = mode
}

function getTodayHours(weekdayText) {
  // weekdayText is an array like ["Monday: 9:00 AM – 6:00 PM", "Tuesday: 9:00 AM – 6:00 PM", ...]
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
  const todayName = days[today]
  
  const todayHours = weekdayText.find(text => text.startsWith(todayName))
  if (todayHours) {
    // Remove the day name and return just the hours
    return todayHours.replace(todayName + ': ', '')
  }
  return 'Hours not available'
}

function isFavorite(placeId) {
  return favorites.value.includes(placeId)
}

function toggleFavorite(place) {
  const placeId = place.place_id
  const index = favorites.value.indexOf(placeId)
  
  if (index > -1) {
    // Remove from favorites
    favorites.value.splice(index, 1)
  } else {
    // Add to favorites
    favorites.value.push(placeId)
  }
  
  // Save to localStorage
  localStorage.setItem('petStoreFavorites', JSON.stringify(favorites.value))
  
  // TODO: Later you can also save to backend/user profile

}

// Watch for changes in filtered places and update markers
watch(filteredPlaces, () => {
  renderMarkers()
})
</script>

<style scoped>
.map-page {
  padding: 20px;
}

.controls-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.search-bar-container {
  display: flex;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-input-wrapper input {
  width: 100%;
  padding-right: 40px;
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.results-filter {
  text-align: center;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}

.card {
  width: 18rem;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.favorite-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.favorite-btn.favorited {
  border-color: var(--bs-warning);
  background: #ffe0e3;
}

.opening-hours-today {
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #4285F4;
}

.card-content {
  padding: 1rem;
  flex-grow: 1;
}

.card-footer-btn {
  padding: 0 1rem 1rem 1rem;
  margin-top: auto;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.remove-icon {
  font-size: 14px;
  opacity: 0.8;
}

</style>