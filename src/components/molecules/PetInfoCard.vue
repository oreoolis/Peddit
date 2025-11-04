<script setup>
const props = defineProps({
  name: {
    type: String,
    default: 'PetName',
    required: true,
  },
  gender: {
    type: String,
    default: 'unknown',
    required: true,
  },
  birthday: {
    type: String,
    default: '1/1/1970',
    required: true,
  },
  breed: {
    type: String,
    default: "Dog_Breed",
  },
  weight: {
    type: Number,
    default: "weight",
  },
  allergies: {
    type: String,
    default: null,
  },
  neutered: {
    type: [String, Boolean],
    default: null
  }
})
</script>

<template>
  <section class="pet-info-card pet-info fw-bold py-4 px-2 m-0 bg-light shadow">
    <h2 class="headingFont fw-semibold text border-bottom pb-2 text-center fs-1">{{ props.name }}</h2>

    <div class="data-grid fs-5">
      <div class="data-row">
        <div class="label headingFont ">Gender</div>
        <div class="value text-capitalize bodyFont">{{ props.gender }}</div>
      </div>

      <div class="data-row">
        <div class="label headingFont">Birthday</div>
        <div class="value bodyFont">{{ props.birthday }}</div>
      </div>

      <div class="data-row">
        <div class="label headingFont">Breed</div>
        <div class="value bodyFont">{{ props.breed }}</div>
      </div>

      <div class="data-row">
        <div class="label headingFont">Weight</div>
        <div class="value bodyFont">{{ props.weight }} kg</div>
      </div>

      <div class="data-row">
        <div class="label headingFont">Allergies</div>
        <div class="value text-truncate bodyFont" :title="props.allergies">{{ props.allergies || 'None' }}</div>
      </div>
      <div class="data-row">
        <div class="label headingFont">Neutered</div>
        <div v-if="props.neutered == true" class="value text-truncate bodyFont" :title="props.neutered">Yes</div>
        <div v-else-if="props.neutered == false" class="value text-truncate bodyFont" :title="props.neutered">No</div>
        <div v-else class="value text-truncate bodyFont" :title="props.neutered">Unknown</div>
      </div>
    </div>

  </section>
</template>

<style scoped>
@keyframes picardPop {
  from {
    opacity: 0;
    transform: translateY(8px) scale(.995);
  }

  60% {
    opacity: 1;
    transform: translateY(-3px) scale(1.01);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Tunables (scoped) */
.pet-info-card {
  --picard-duration: 320ms;
  --picard-ease: cubic-bezier(.2, .9, .2, 1);
  --picard-lift: 6px;
  --picard-shadow: 0 10px 28px rgba(var(--bs-primary-rgb), 0.06);

  /* stable text sizing regardless of viewport */
  font-size: 0.95rem;
  line-height: 1.25;

  will-change: transform, opacity;
  animation: picardPop var(--picard-duration) var(--picard-ease) both;
  transition: transform 160ms var(--picard-ease), box-shadow 160ms ease;
  border-radius: 0.5rem;
  /* kept small and consistent with bootstrap rounded */

  display: flex;
  flex-direction: column;
  min-height: 220px;
  /* ensures a reasonable visual block; adjust as needed */
  box-sizing: border-box;
  padding-top: .75rem;
}

/* header stays compact and doesn't participate in equal-height distribution */
.pet-info-card>h2 {
  margin: 0;
  padding: 0 .25rem .5rem .25rem;
  font-size: 1.05rem;
  line-height: 1.15;
  flex: 0 0 auto;
}

/* data grid takes the remaining height and divides it evenly among rows */
.data-grid {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  /* rows will use border to separate */
  margin-top: 0.25rem;
  min-height: 0;
  /* allow proper flex overflow in containers */
}

/* each key/value row — now flex:1 so all rows share available height equally */
.data-row {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .5rem .75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
}

/* remove border on last row */
.data-row:last-child {
  border-bottom: none;
}

/* subtle alternating tint to aid scanning */
.data-row:nth-child(odd) {
  background: rgba(var(--bs-primary-rgb), 0.03);
}

/* label (left) */
.label {
  color: var(--bs-grey);
  font-weight: 600;
  white-space: nowrap;
}

/* value (right) */
.value {
  color: var(--bs-black);
  font-weight: 700;
  min-width: 6rem;
  text-align: right;

}

/* truncate long values (e.g. allergies) */
.value.text-truncate {
  max-width: 12rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* when used inside modal, delay to avoid clashing with modal animation */
::v-deep(.modal-content) .pet-info-card {
  animation-delay: 220ms;
}

/* subtle hover/focus lift (keeps it minimal) */
.pet-info-card:hover,
.pet-info-card:focus-within {
  transform: translateY(calc(-1 * var(--picard-lift)));
  box-shadow: var(--picard-shadow);
}

/* reduced lift on very small screens */
@media (max-width: 576px) {
  .pet-info-card {
    --picard-lift: 3px;
    min-height: unset;
  }

  .value.text-truncate {
    max-width: 9.5rem;
  }
}

/* respect users preferring reduced motion */
@media (prefers-reduced-motion: reduce) {

  .pet-info-card,
  .pet-info-card>*,
  .data-row,
  .value,
  .label {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    box-shadow: none !important;
  }
}
</style>