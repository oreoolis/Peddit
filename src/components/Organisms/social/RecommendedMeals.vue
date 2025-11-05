<script setup>
import { computed } from 'vue';
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

// Normalize plan objects so the component can accept both the sample shape
// (name/desc) and the store shape (recipe_name/description/notes)
const normalizedPlans = computed(() => {
  return (props.plans || []).map(p => ({
    id: p.id ?? p.rec_id ?? p.recipe_id ?? (p.name || p.recipe_name) ?? null,
    name: p.recipe_name ?? p.name ?? p.recipe?.recipe_name ?? '',
    desc: p.description ?? p.desc ?? p.notes ?? (p.recipe?.description) ?? '',
    petKind: p.pet_kind ?? p.petKind ?? p.recipe?.pet_kind ?? null
  }));
});


const truncateText = (v, max = 500) => {
  if (v === null || typeof v === 'undefined') return '';
  const s = String(v);
  if (s.length <= max) return s;
  return s.slice(0, max).trimEnd() + '…';
};
</script>

<template>
     <section class="mx-auto">
        <h1 class="text-center headingFont bg-primary text-white py-2 ">What Others Are Feeding</h1>
       <div class=" py-4 row recommend-grid row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 d-flex justify-content-center">
         <div v-for="r in normalizedPlans" :key="r?.id" class=" col">
           <div class="card-wrapper w-100 justify-content-center">
             <MealPlanCard :name="r?.name" :rec_id="r?.id" :desc="truncateText(r?.desc, 100)" :petKind="r?.petKind" class="w-100" :editable="false" @open-meal-info="$emit('open-meal-info', $event)"/>
           </div>
         </div>
       </div>
     </section>

</template>

<style scoped>
/* Recommended grid tweaks remain... */
.recommend-grid .card-wrapper { display:flex; align-items:stretch; }

</style>