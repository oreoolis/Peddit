<template>
  <div class="container-fluid map-page">
    <h1 class="mt-3 mb-3">Pet Stores & Clinics Near You</h1>

    <!-- Map container -->
    <div id="map" style="height: 500px; width: 100%; border: 1px solid #ddd;"></div>

    <!-- Cards container -->
    <div class="cards-container mt-4">
      <div
        v-for="place in places"
        :key="place.id"
        class="card p-3"
        style="width: 18rem;"
      >
        <h5 class="card-title">{{ place.name }}</h5>
        <p class="card-text">{{ place.address }}</p>
        <p class="card-text"><small class="text-muted">{{ place.type }}</small></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Placeholder data for now
const places = ref([
  { id: 1, name: 'Happy Paws Pet Store', address: '123 Main St', type: 'Pet Store' },
  { id: 2, name: 'Healthy Pets Clinic', address: '456 Elm St', type: 'Clinic' },
])

onMounted(() => {
  // TODO: Initialize Google Maps here
  // Example: new google.maps.Map(document.getElementById("map"), { ... })
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
  script.async = true
  script.defer = true
  document.head.appendChild(script)

  script.onload = () => {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 1.3521, lng: 103.8198 }, // Singapore center
      zoom: 13,
    })
  }
})
</script>

<style scoped>
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}
</style>
