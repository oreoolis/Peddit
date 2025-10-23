<template>
  <div class="card info-card">
    <div class="card-header">
      <h5 class="mb-0">
        <BaseIcon name="heart-fill" size="md" class="me-2" />
        Pet Information
      </h5>
    </div>
    <div class="card-body">
      <!-- Select Existing Pet -->
      <div class="mb-3" v-if="pets && pets.length > 0">
        <label class="form-label fw-semibold">Select Your Pet</label>
        <select :value="selectedPet" @change="handlePetChange" class="form-select">
          <option :value="null">-- Or enter manually --</option>
          <option v-for="pet in pets" :key="pet.id" :value="pet">
            {{ pet.name }} ({{ pet.kind }})
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Pet Kind</label>
        <select :value="petKind" @change="$emit('update:petKind', $event.target.value)" class="form-select">
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Life Stage</label>
        <select :value="petLifeStage" @change="$emit('update:petLifeStage', $event.target.value)" class="form-select">
          <option value="adult_maintenance">Adult</option>
          <option value="growth_and_reproduction">Baby or Mother</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Weight (kg)</label>
        <input 
          type="number" 
          :value="petWeight" 
          @input="$emit('update:petWeight', parseFloat($event.target.value))"
          class="form-control"
          min="0.1"
          step="0.1"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseIcon from '../../atomic/BaseIcon.vue';

defineProps({
  pets: {
    type: Array,
    default: () => []
  },
  selectedPet: {
    type: Object,
    default: null
  },
  petKind: {
    type: String,
    required: true
  },
  petLifeStage: {
    type: String,
    required: true
  },
  petWeight: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:selectedPet', 'update:petKind', 'update:petLifeStage', 'update:petWeight']);

const handlePetChange = (event) => {
  const selectedIndex = event.target.selectedIndex - 1; // Adjust for the "-- Or enter manually --" option
  const pet = selectedIndex >= 0 ? event.target.options[event.target.selectedIndex].value : null;
  emit('update:selectedPet', pet);
};
</script>

<style scoped>
.info-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0 !important;
  border: none;
}

.card-header h5 {
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
