
<script setup>
import MealPlanCard from '@/components/PetViewComponents/MealPlanCard.vue';
const props = defineProps({
  plans: {
    type: Array,
    default: () => ([
      { id: 'r1', name: 'Salmon Recipe', desc: 'Balanced diet — great for growing kittens' },
      { id: 'r2', name: 'Chicken Feast', desc: 'High-protein plan for active adults' },
      { id: 'r3', name: 'Tuna Delight', desc: 'Light, low-calorie option' },
      { id: 'r4', name: 'Beef Boost', desc: 'Calorie-dense for underweight pets' },
      { id: 'r5', name: 'Veg Mix', desc: 'Gentle on stomachs' }
    ])
  }
});

</script>

<template>
     <section class="mx-auto">
        <h1 class="text-center headingFont bg-primary text-white py-2 ">Recommended</h1>
       <div class=" py-4 row recommend-grid row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 d-flex justify-content-center">
         <div v-for="r in plans" :key="r.id" class=" col">
           <div class="card-wrapper w-100 justify-content-center">
             <MealPlanCard :name="r.name" :rec_id="r.id" :desc="r.desc" class="w-100"/>
           </div>
         </div>
       </div>
     </section>

</template>

<style scoped>
/* Recommended grid tweaks remain... */
.recommend-grid .card-wrapper { display:flex; align-items:stretch; }

</style>