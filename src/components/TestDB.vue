<script setup>
import { usePetStore } from '@/stores/petStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const petStore = usePetStore();
const { pets, loading, error, dogs, cats } = storeToRefs(petStore);
const { fetchPets, createPet, deletePet } = petStore;

onMounted(async () => {
    const result = await fetchPets(userId);
});

</script>

<template>
    <div>
        <h2>Test stuff here</h2>

    </div>
</template>

<style scoped>

</style>