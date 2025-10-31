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
    <div class="d-flex align-items-center gap-3">
      <!-- Column 1: Avatar (no change) -->
      <div class="flex-shrink-0">
        <img
          :src="props.Image"
          alt="avatar"
          class="avatar rounded-circle"
        />
      </div>

      <!-- Column 2: User Info (now includes stats) -->
      <div class="flex-grow-1 profile-meta">
        <!-- Name and Handle -->
        <div>
          <h6 class="fw-bold bodyFont name mb-0">{{ props.Name }}</h6>
          <span class="text-muted small handle">{{ props.handle }}</span>
        </div>
        <!-- Follower Stats -->
      </div>
        <div class="d-flex align-items-center gap-3 mt-2 user-stats">
          <div class="stat">
            <span class="fw-bold">{{ props.Followers }}</span>
            <span class="text-muted small">Followers</span>
          </div>
          <div class="stat">
            <span class="fw-bold">{{ props.Following }}</span>
            <span class="text-muted small">Following</span>
          </div>
        </div>
      <!-- Column 3: Action Button (no change) -->
      <div class="flex-shrink-0">
        <RouterLink :to="LinkStart+LinkID">
         <Button label="View" size="sm" />
        </RouterLink>
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