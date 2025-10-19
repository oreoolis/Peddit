<template>
  <div class="pet-info-chip">
    <h4 class="pet-name mb-1">
      {{ name }}
    </h4>
    <div class="pet-icons">
      <BaseIcon 
        v-if="genderIcon"
        :name="genderIcon"
        :variant="genderVariant"
        size="md"
        :title="genderTitle"
      />
      <BaseIcon
        :name="kindIcon"
        :variant="kindVariant"
        size="md"
        :title="kindTitle"
      />
      <BaseBadge 
        v-if="neutered"
        variant="success"
        icon="check-circle-fill"
        pill
        class="ms-1"
      >
        Neutered
      </BaseBadge>
    </div>
    <BaseLabel size="sm" variant="muted" class="pet-details mt-1">
      {{ age }} years old • {{ breed }}
    </BaseLabel>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseIcon from './BaseIcon.vue';
import BaseLabel from './BaseLabel.vue';
import BaseBadge from './BaseBadge.vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  age: {
    type: [String, Number],
    required: true
  },
  breed: {
    type: String,
    default: 'Mixed breed'
  },
  gender: {
    type: String,
    validator: (value) => ['male', 'female', 'unknown'].includes(value)
  },
  kind: {
    type: String,
    required: true,
    validator: (value) => ['dog', 'cat'].includes(value)
  },
  neutered: {
    type: Boolean,
    default: false
  }
});

const genderIcon = computed(() => {
  if (!props.gender || props.gender === 'unknown') return 'gender-ambiguous';
  return props.gender === 'male' ? 'gender-male' : 'gender-female';
});

const genderVariant = computed(() => {
  if (!props.gender || props.gender === 'unknown') return 'secondary';
  return props.gender === 'male' ? 'primary' : 'danger';
});

const genderTitle = computed(() => {
  if (!props.gender || props.gender === 'unknown') return 'Unknown gender';
  return props.gender === 'male' ? 'Male' : 'Female';
});

const kindIcon = computed(() => {
  return props.kind === 'dog' ? 'heart-fill' : 'heart-fill';
});

const kindVariant = computed(() => {
  return props.kind === 'dog' ? 'warning' : 'info';
});

const kindTitle = computed(() => {
  return props.kind === 'dog' ? 'Dog' : 'Cat';
});
</script>

<style scoped>
.pet-info-chip {
  flex: 1;
}

.pet-name {
  font-weight: 700;
  color: #343a40;
  margin: 0;
}

.pet-icons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.pet-details {
  display: block;
}

@media (max-width: 576px) {
  .pet-name {
    font-size: 1.1rem;
  }
}
</style>
