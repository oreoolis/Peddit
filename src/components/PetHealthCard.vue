<template>
  <div class="pet-health-card accordion-item mb-3">
    <div class="accordion-header">
      <div class="card-header d-flex align-items-center p-3" @click="handleToggle">
        <!-- Pet Image with Circular Health Bar -->
        <div class="pet-image-container position-relative me-3" ref="imageContainer">
          <div class="circular-health-bar">
            <svg 
              class="health-ring" 
              :width="svgSize" 
              :height="svgSize"
              :viewBox="`0 0 ${svgSize} ${svgSize}`"
            >
              <circle
                class="health-bg"
                :cx="svgSize / 2"
                :cy="svgSize / 2"
                :r="radius"
                fill="none"
                stroke="#e9ecef"
                :stroke-width="strokeWidth"
              />
              <circle
                class="health-progress"
                :cx="svgSize / 2"
                :cy="svgSize / 2"
                :r="radius"
                fill="none"
                :stroke="healthColor"
                :stroke-width="strokeWidth"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="healthDashOffset"
                stroke-linecap="round"
                :transform="`rotate(-90 ${svgSize / 2} ${svgSize / 2})`"
              />
            </svg>
            <img
              :src="pet.photo_url || defaultPetImage"
              :alt="pet.name"
              class="pet-image rounded-circle"
              :width="imageSize"
              :height="imageSize"
              :style="imageStyle"
            />
          </div>
          <div class="health-percentage text-center position-absolute bottom-0 start-50 translate-middle-x">
            {{ healthPercentage }}%
          </div>
        </div>

        <!-- Pet Basic Info -->
        <div class="pet-info flex-grow-1">
          <div class="d-flex align-items-center mb-1">
            <h4 class="pet-name mb-0 me-2">{{ pet.name }}</h4>
            <!-- Pet Icons directly beside name -->
            <div class="pet-icons d-flex align-items-center">
              <!-- Gender Icon -->
              <i :class="genderIcon" class="me-1" :title="genderTitle"></i>
              <!-- Pet Kind Icon -->
              <i :class="petKindIcon" class="me-1" :title="petKindTitle"></i>
              <!-- Neutered Icon -->
              <i v-if="pet.neutered" class="bi bi-check-circle-fill text-success me-1" title="Neutered"></i>
            </div>
          </div>
          <div class="pet-details">
            <span class="age-breed">{{ calculatedAge }} years old, {{ pet.breed || 'Mixed breed' }}</span>
          </div>
        </div>

        <!-- Accordion Toggle Icon -->
        <div class="accordion-toggle">
          <i class="bi" :class="isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
        </div>
      </div>
    </div>

    <!-- Expanded Details Section -->
    <Transition name="accordion">
      <div v-if="isExpanded" class="accordion-content">
        <div class="card-body p-3">
          <div class="row">
            <div class="col-md-3 mb-3">
              <div class="detail-item">
                <h6 class="detail-label">Birthdate</h6>
                <p class="detail-value">{{ formattedBirthdate }}</p>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="detail-item">
                <h6 class="detail-label">Weight</h6>
                <p class="detail-value">{{ pet.weight_kg }} kg</p>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="detail-item">
                <h6 class="detail-label">Body Condition</h6>
                <p class="detail-value">{{ pet.body_condition_scale || 'N/A' }}/9</p>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="detail-item">
                <h6 class="detail-label">Neutered</h6>
                <p class="detail-value">{{ pet.neutered ? 'Yes' : 'No' }}</p>
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="detail-item">
                <h6 class="detail-label">Allergies</h6>
                <p class="detail-value">{{ pet.allergies || 'None recorded' }}</p>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="detail-item">
                <h6 class="detail-label">Last Updated</h6>
                <p class="detail-value">{{ formattedUpdatedAt }}</p>
              </div>
            </div>
          </div>
          
          <!-- Health Status Description -->
          <div class="health-status mt-3">
            <h6 class="detail-label">Health Status</h6>
            <div class="progress mb-2">
              <div
                class="progress-bar"
                :class="healthBarClass"
                role="progressbar"
                :style="{ width: healthPercentage + '%' }"
                :aria-valuenow="healthPercentage"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {{ healthPercentage }}%
              </div>
            </div>
            <p class="health-description">{{ healthDescription }}</p>
            
            <!-- Nearest Vet Button - Only show when health is below threshold -->
            <div v-if="showVetButton" class="mt-3">
              <button 
                class="btn btn-danger btn-sm"
                @click.stop="goToNearestVet"
              >
                <i class="bi bi-geo-alt-fill me-1"></i>
                Find Nearest Vet
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDateFormat, useNow, useWindowSize } from '@vueuse/core';

// Props
const props = defineProps({
  pet: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        typeof value.id === 'string' &&
        typeof value.name === 'string' &&
        typeof value.kind === 'string' &&
        typeof value.owner_id === 'string'
      );
    }
  },
  healthThreshold: {
    type: Number,
    default: 60
  }
});

// Emits
const emit = defineEmits(['find-nearest-vet']);

// Simple ref for accordion state instead of useToggle
const isExpanded = ref(false);

// VueUse hooks
const now = useNow();
const { width: windowWidth } = useWindowSize();

// Refs for responsive sizing
const imageContainer = ref(null);
const defaultPetImage = 'https://picsum.photos/seed/defaultpet/200/200.jpg';

// Methods
const handleToggle = () => {
  console.log('Toggle clicked, current state:', isExpanded.value);
  isExpanded.value = !isExpanded.value;
  console.log('New state:', isExpanded.value);
};

// Responsive sizing based on window width
const svgSize = computed(() => {
  if (windowWidth.value < 576) return 80; // Extra small screens
  if (windowWidth.value < 768) return 100; // Small screens
  if (windowWidth.value < 992) return 110; // Medium screens
  return 120; // Large screens
});

const imageSize = computed(() => svgSize.value - 20);
const radius = computed(() => (svgSize.value / 2) - 4);
const strokeWidth = computed(() => Math.max(6, svgSize.value / 20));
const circumference = computed(() => 2 * Math.PI * radius.value);

// Position for the image inside the SVG
const imageStyle = computed(() => {
  const offset = (svgSize.value - imageSize.value) / 2;
  return {
    top: `${offset}px`,
    left: `${offset}px`
  };
});

// Computed properties
const calculatedAge = computed(() => {
  if (!props.pet.birthdate) return 'Unknown';
  
  const birthDate = new Date(props.pet.birthdate);
  const years = now.value.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.value.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.value.getDate() < birthDate.getDate())) {
    return years - 1;
  }
  
  return years;
});

const formattedBirthdate = computed(() => {
  if (!props.pet.birthdate) return 'Not recorded';
  return useDateFormat(props.pet.birthdate, 'MMM D, YYYY').value;
});

const formattedUpdatedAt = computed(() => {
  if (!props.pet.updated_at) return 'Not recorded';
  return useDateFormat(props.pet.updated_at, 'MMM D, YYYY').value;
});

const genderIcon = computed(() => {
  if (!props.pet.gender || props.pet.gender === 'unknown') {
    return 'bi bi-gender-ambiguous text-secondary';
  }
  return props.pet.gender === 'male' 
    ? 'bi-gender-male text-primary' 
    : 'bi-gender-female text-danger';
});

const genderTitle = computed(() => {
  if (!props.pet.gender || props.pet.gender === 'unknown') {
    return 'Unknown gender';
  }
  return props.pet.gender === 'male' ? 'Male' : 'Female';
});

const petKindIcon = computed(() => {
  return props.pet.kind === 'dog' 
    ? 'bi bi-heart-fill text-warning' 
    : 'bi bi-heart-fill text-info';
});

const petKindTitle = computed(() => {
  return props.pet.kind === 'dog' ? 'Dog' : 'Cat';
});

const healthPercentage = computed(() => {
  // Convert body condition scale (1-9) to percentage
  if (!props.pet.body_condition_scale) return 30; // Default if not set
  
  const scale = props.pet.body_condition_scale;
  
  if (scale <= 2) return 30; // Very thin
  if (scale === 3) return 50; // Thin
  if (scale === 4) return 80; // Ideal
  if (scale === 5) return 100; // Ideal
  if (scale === 6) return 75; // Overweight
  if (scale === 7) return 50; // Heavy
  if (scale >= 8) return 30; // Obese
  
  return 75; // Default
});

const healthColor = computed(() => {
  const percentage = healthPercentage.value;
  if (percentage >= 80) return '#28a745'; // Green
  if (percentage >= 60) return '#ffc107'; // Yellow
  if (percentage >= 40) return '#fd7e14'; // Orange
  return '#dc3545'; // Red
});

const healthDashOffset = computed(() => {
  return circumference.value - (healthPercentage.value / 100) * circumference.value;
});

const healthBarClass = computed(() => {
  const percentage = healthPercentage.value;
  if (percentage >= 80) return 'bg-success';
  if (percentage >= 60) return 'bg-warning';
  if (percentage >= 40) return 'bg-danger';
  return 'bg-danger';
});

const healthDescription = computed(() => {
  const percentage = healthPercentage.value;
  const scale = props.pet.body_condition_scale;
  
  if (percentage >= 80) return 'Excellent body condition! Your pet is at an ideal weight.';
  if (percentage >= 60) return 'Good body condition with minor concerns that should be monitored.';
  if (percentage >= 40) return 'Some body condition issues detected. Consider adjusting diet and exercise.';
  return 'Significant body condition concerns. Please consult with your veterinarian.';
});

const showVetButton = computed(() => {
  return healthPercentage.value < props.healthThreshold;
});

const goToNearestVet = () => {
  emit('find-nearest-vet', {
    petId: props.pet.id,
    petName: props.pet.name
  });
};
</script>

<style scoped>
.pet-health-card {
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.pet-health-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  cursor: pointer;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s;
  user-select: none; /* Prevent text selection while clicking */
}

.card-header:hover {
  background-color: #e9ecef;
}

.pet-image-container {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.circular-health-bar {
  position: relative;
  width: 100%;
  height: 100%;
}

.health-ring {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.health-bg {
  opacity: 0.3;
}

.health-progress {
  transition: stroke-dashoffset 1s ease-in-out;
}

.pet-image {
  position: absolute;
  z-index: 2;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.health-percentage {
  font-weight: bold;
  font-size: 0.8rem;
  color: #495057;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 10px;
  bottom: 5px !important;
}

.pet-name {
  font-weight: 600;
  color: #343a40;
}

.age-breed {
  color: #6c757d;
  font-size: 0.9rem;
}

.pet-icons i {
  font-size: 1.2rem;
}

.accordion-toggle {
  color: #6c757d;
  transition: transform 0.2s;
}

/* Accordion transition styles */
.accordion-content {
  overflow: hidden;
}

.accordion-enter-active {
  transition: all 0.3s ease-out;
}

.accordion-leave-active {
  transition: all 0.3s ease-in;
}

.accordion-enter-from {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.accordion-enter-to {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}

.accordion-leave-from {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}

.detail-item {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  height: 100%;
}

.detail-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.detail-value {
  margin-bottom: 0;
  color: #343a40;
}

.health-status {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
}

.progress {
  height: 10px;
  border-radius: 5px;
}

.health-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .pet-image-container {
    width: 110px;
    height: 110px;
  }
}

@media (max-width: 768px) {
  .pet-image-container {
    width: 100px;
    height: 100px;
  }
  
  .pet-details {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .age-breed {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 576px) {
  .pet-image-container {
    width: 80px;
    height: 80px;
  }
  
  .card-header {
    padding: 1rem !important;
  }
  
  .pet-name {
    font-size: 1.1rem;
  }
  
  .age-breed {
    font-size: 0.8rem;
  }
  
  .pet-icons i {
    font-size: 1rem;
  }
}
</style>