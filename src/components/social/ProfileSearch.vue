
<script setup>
import Button from "../atoms/button.vue"
const props = defineProps({
    Name: {
        required: true,
        type : String,
        default: "@bernardcks"
    },
    Image: {
        type: String,
        default: "/src/assets/person.jpg"

    },
})

</script>


<template>
  <div class="card profile-row w-100">
    <div class="row g-2 align-items-center">
      <!-- Column 1: avatar -->
      <div class="col-auto">
        <img
          :src="props.Image"
          alt="avatar"
          class="rounded-circle avatar w-50 p-2"
        />
      </div>

      <!-- Column 2: name / meta -->
      <div class="col">
        <div class="profile-meta">
          <span class="fw-bold bodyFont name">{{ props.Name }}</span>
        </div>
      </div>

      <!-- Column 3: action button -->
      <div class="col-auto p-3">
        <Button label="View" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: linear-gradient(180deg, #fff, #fbfbfd);
  transition: transform 180ms ease, box-shadow 180ms ease;
  box-shadow: 0 8px 20px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
  
}
.card:hover {
  transform: translateY(0px);
  box-shadow: 0 18px 44px rgba(11,22,40,0.14);
}
</style>