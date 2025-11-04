<script setup>
import { computed } from 'vue';
import { defineProps } from 'vue';
import Button from "../../atoms/button.vue"
const LinkStart = "./profile/"
const props = defineProps({
    Name: {
        required: true,
        type : String,
        default: "Name"
    },
    handle: {
        type: String,
        default: "@user"
    },
    Image: {
        type: String,
        default: "/src/assets/person.jpg"
    },
    Followers: {
        type: Number,
        default: 999
    },
    Following: {
        type: Number,
        default: 999
    },
    LinkID: {
      type: String,
      default: "123"
    }

})
</script>

<template>
  <div class="card profile-row w-100 p-2">
    <div class="row align-items-center gx-2">
      <div class="col-auto">
        <img :src="props.Image" alt="avatar" class="avatar rounded-circle" />
      </div>

      <div class="col">
        <h6 class="fw-bold bodyFont name mb-0 text-truncate">{{ props.Name }}</h6>
        <span class="text-muted small handle">{{ props.handle }}</span>
      </div>

      <div class="col-auto d-none d-sm-flex align-items-center user-stats">
        <div class="stat me-3"><span class="fw-bold">{{ props.Followers }}</span><br/><small class="text-muted">Followers</small></div>
        <div class="stat"><span class="fw-bold">{{ props.Following }}</span><br/><small class="text-muted">Following</small></div>
      </div>

      <div class="col-auto">
        <RouterLink :to="LinkStart+LinkID"><Button label="View" size="sm" /></RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-row {
  background: white;
  border: 1px solid var(--bs-border-color-translucent);
  border-radius: 0.75rem;
  transition: transform 180ms ease, box-shadow 180ms ease;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.profile-row:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(11, 22, 40, 0.1);
}

.avatar {
  width: 48px;
  height: 48px;
  object-fit: cover;
  background-color: var(--bs-light);
}


/* New styles for the stats */
.user-stats .stat {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-size: 0.8rem;
}
</style>