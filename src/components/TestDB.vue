<script setup>
import { usePetStore } from '@/stores/petStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import PetCreateForm from '@/components/PetCreateFormTest.vue';
import SocialTest from '@/components/SocialTest.vue';
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
//random comment
const handlePetImageUpload = async (petId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const result = await petStore.uploadPetImage(petId, file);
    if (result.success) {
        console.log('Pet image updated');
    } else {
        alert('Failed to upload image: ' + result.error);
    }
    
    // Reset file input
    event.target.value = '';
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
		<SocialTest />
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
			<div v-for="pet in petStore.pets" :key="pet.id" class="pet-card">
				<div class="pet-image-container">
					<div class="position-relative d-inline-block">
						<img 
							v-if="pet.photo_url" 
							:src="pet.photo_url" 
							:alt="pet.name"
							class="pet-photo"
							@error="(e) => e.target.style.display = 'none'"
						/>
						<div 
							v-else 
							class="no-photo-placeholder"
						>
							{{ pet.kind === 'dog' ? '🐕' : pet.kind === 'cat' ? '🐈' : '🐾' }}
						</div>
						
						<!-- Small upload button similar to gear icon -->
						<!-- <input 
							type="file" 
							accept="image/*"
							@change="(e) => handlePetImageUpload(pet.id, e)"
							class="d-none" 
							:id="'pet-upload-' + pet.id"
						/> -->
						<!-- <label 
							:for="'pet-upload-' + pet.id" 
							class="btn btn-light btn-sm position-absolute bottom-0 end-0 upload-btn"
						>
							📷
						</label> -->
					</div>
				</div>
				<h4>{{ pet.name }}</h4>
				<p>{{ pet.breed || 'Mixed' }} • {{ pet.kind }}</p>
				<small>{{ pet.gender }} • {{ pet.weight_kg }}kg</small>
			</div>
		</div>
    </div>
</template>

<style scoped>
.pet-photo {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid #e0e0e0;
}

.no-photo-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    background: #f8f9fa;
    border: 2px dashed #dee2e6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
}

.upload-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid white;
    background-color: #007bff;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(25%, 25%);
    font-size: 12px;
    cursor: pointer;
}

.upload-btn:hover {
    background-color: #0056b3;
}

.pet-image-container {
    text-align: center;
    margin-bottom: 0.5rem;
}
</style>