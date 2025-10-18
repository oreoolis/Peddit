<script setup>
import TestDB from '@/components/TestDB.vue';
import PetHealthCard from '@/components/PetHealthCard.vue';
import { usePetStore } from '@/stores/petStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

// TODO: link health dashboard here
// import Chatbot from '../components/Healthdashboard.vue';
// export default {
//   name: 'PetDashboard',
//   components: {
//     PetHealthCard
//   },
//   data() {
//     return {
//       pets: [
//         {
//           id: 1,
//           name: 'Buddy',
//           age: 5,
//           breed: 'Golden Retriever',
//           gender: 'male',
//           petKind: 'dog',
//           health: 85,
//           weight: 30,
//           allergies: 'Pollen',
//           diet: 'Premium dry food',
//           image: 'https://picsum.photos/seed/buddy/200/200.jpg'
//         },
//         {
//           id: 2,
//           name: 'Whiskers',
//           age: 3,
//           breed: 'Persian',
//           gender: 'female',
//           petKind: 'cat',
//           health: 92,
//           weight: 4.5,
//           allergies: 'None',
//           diet: 'Wet food mix',
//           image: 'https://picsum.photos/seed/whiskers/200/200.jpg'
//         },
//         {
//           id: 3,
//           name: 'Max',
//           age: 7,
//           breed: 'Beagle',
//           gender: 'male',
//           petKind: 'dog',
//           health: 65,
//           weight: 15,
//           allergies: 'Dust mites',
//           diet: 'Specialized digestive formula',
//           image: 'https://picsum.photos/seed/max/200/200.jpg'
//         }
//       ]
//     };
//   }
// };

const petStore = usePetStore();
const { pets } = storeToRefs(petStore);

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);

onMounted(async () => {
    console.log(userId.value);
    await petStore.fetchPets(userId.value);
});

</script>

<template>
    <main>
        <h2>Health Dashboard</h2>
        <!-- <Healthdashboard /> -->    
        <div v-if="pets" class="accordion" id="petHealthAccordion">
            <PetHealthCard
                v-for="pet in pets"
                :key="pet.id"
                :pet="pet"
            />
        </div>
    </main>
</template>