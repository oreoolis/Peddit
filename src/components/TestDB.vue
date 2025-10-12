<script setup>
import { usePetStore } from '@/stores/petStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import PetCreateForm from '@/components/PetCreateFormTest.vue';
import { useAuthStore } from '@/stores/authStore';

const petStore = usePetStore();
const { pets, loading, error } = storeToRefs(petStore);
const { fetchPets, createPet, deletePet } = petStore;
const authStore = useAuthStore();
const { user, loading: authLoading } = storeToRefs(authStore);

const showCreateForm = ref(false);

const toggleCreateForm = () => {
	showCreateForm.value = !showCreateForm.value;
}

watch(() => authStore.userId, (newUserId) => {
	if (newUserId) {
		fetchPets(newUserId);
	}
}, { immediate: true });

</script>

<template>
    <div class="d-flex flex-column justify-content-center pb-5">
        <h2>Test stuff here</h2>
		<!-- Pets Section -->
		<div class="pets-section">
			<div class="section-header">
				<h2>My Pets ({{ petStore.petCount }})</h2>
				<button @click="toggleCreateForm" class="btn btn-primary">
				{{ showCreateForm ? 'Cancel' : 'Add Pet' }}
				</button>
			</div>

			<!-- Create Form -->
			<PetCreateForm v-if="showCreateForm" />

			<!-- Pets List -->
			<div v-else class="pets-grid">
				<div v-for="pet in petStore.pets" :key="pet.id" class="pet-card">
				<h4>{{ pet.name }}</h4>
				<p>{{ pet.breed || 'Mixed' }} • {{ pet.kind }}</p>
				<small>{{ pet.gender }} • {{ pet.weight_kg }}kg</small>
				</div>
				<div v-if="petStore.petCount === 0" class="no-pets">
				<p>No pets yet. Add your first pet!</p>
				</div>
			</div>
		</div>
    </div>
</template>

<style scoped>

</style>