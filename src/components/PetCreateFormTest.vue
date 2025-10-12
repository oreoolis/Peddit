<script setup>
import { ref } from 'vue'
import { usePetStore } from '@/stores/petStore'
import { useAuthStore } from '@/stores/authStore'

const petStore = usePetStore()
const authStore = useAuthStore()

const showSuccess = ref(false)

// Form data
const form = ref({
    name: '',
    kind: '',
    breed: '',
    gender: 'unknown',
    birthdate: '',
    weight_kg: null,
    neutered: null
})

const imageFile = ref(null);
const imagePreview = ref(null);

const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file');
        return;
    }

    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
}

const removeImage = () => {
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
    }
    imageFile.value = null;
    imagePreview.value = null;
}


const handleSubmit = async () => {
    if (!form.value.name || !form.value.kind) {
        alert('Please fill in required fields')
        return
    }

    const result = await petStore.createPet(authStore.userId, { ...form.value, photo_url: null })

    if (result.success) {

        // If image was selected, upload it
        if (imageFile.value) {
            const imageResult = await petStore.uploadPetImage(result.data.id, imageFile.value);
            if (!imageResult.success) {
                console.error('Failed to upload image:', imageResult.error);
            }
        }

        showSuccess.value = true
        resetForm()
        
        // Hide success message after 3 seconds
        setTimeout(() => {
        showSuccess.value = false
        }, 3000)
    }
}

const resetForm = () => {
    form.value = {
        name: '',
        kind: '',
        breed: '',
        gender: 'unknown',
        birthdate: '',
        weight_kg: null,
        neutered: null
    }
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
    }
    removeImage();
    petStore.clearError();
    showSuccess.value = false;
}
</script>

<template>
    <div class="pet-create-form">
        <h3>Add New Pet</h3>
        
        <form @submit.prevent="handleSubmit" class="pet-form">
            <div class="form-group">
                <label for="pet-photo" class="form-label">Pet Photo</label>
                <input
                    id="pet-photo"
                    type="file"
                    accept="image/*"
                    @change="handleImageSelect"
                    class="form-control"
                />
                <!-- Image Preview - Same size as avatar -->
                <div v-if="imagePreview" class="image-preview-container mt-2">
                    <h6 class="preview-title">Preview</h6>
                    <div class="position-relative d-inline-block">
                        <img 
                            :src="imagePreview" 
                            alt="Preview" 
                            class="preview-image"
                        />
                        <button 
                            type="button"
                            @click="removeImage"
                            class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-btn"
                        >
                            ×
                        </button>
                    </div>
                    <p class="text-muted small mt-1">
                        {{ imageFile?.name }} ({{ formatFileSize(imageFile?.size) }})
                    </p>
                </div>
            </div>

            <!-- Pet Name -->
            <div class="form-group">
                <label for="pet-name" class="form-label">Pet Name *</label>
                <input
                id="pet-name"
                v-model="form.name"
                type="text"
                class="form-control"
                placeholder="Enter pet name"
                required
                />
            </div>

            <!-- Pet Type -->
            <div class="form-group">
                <label class="form-label">Pet Type *</label>
                <div class="type-options">
                <label class="type-option">
                    <input
                    v-model="form.kind"
                    type="radio"
                    value="dog"
                    required
                    />
                    <span class="option-label">🐕 Dog</span>
                </label>
                <label class="type-option">
                    <input
                    v-model="form.kind"
                    type="radio"
                    value="cat"
                    />
                    <span class="option-label">🐈 Cat</span>
                </label>
                <label class="type-option">
                    <input
                    v-model="form.kind"
                    type="radio"
                    value="other"
                    />
                    <span class="option-label">🐾 Other</span>
                </label>
                </div>
            </div>

            <!-- Breed -->
            <div class="form-group">
                <label for="pet-breed" class="form-label">Breed</label>
                <input
                id="pet-breed"
                v-model="form.breed"
                type="text"
                class="form-control"
                placeholder="e.g., Golden Retriever"
                />
            </div>

            <!-- Gender -->
            <div class="form-group">
                <label class="form-label">Gender</label>
                <select v-model="form.gender" class="form-control">
                <option value="unknown">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                </select>
            </div>

            <!-- Birthdate -->
            <div class="form-group">
                <label for="pet-birthdate" class="form-label">Birthdate</label>
                <input
                id="pet-birthdate"
                v-model="form.birthdate"
                type="date"
                class="form-control"
                />
            </div>

            <!-- Weight -->
            <div class="form-group">
                <label for="pet-weight" class="form-label">Weight (kg)</label>
                <input
                id="pet-weight"
                v-model="form.weight_kg"
                type="number"
                step="0.1"
                min="0"
                class="form-control"
                placeholder="0.0"
                />
            </div>

            <!-- Neutered -->
            <div class="form-group">
                <label class="form-check">
                <input
                    v-model="form.neutered"
                    type="checkbox"
                />
                <span class="check-label">Neutered/Spayed</span>
                </label>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
                <button
                type="button"
                @click="resetForm"
                class="btn btn-secondary"
                :disabled="petStore.loading"
                >
                Reset
                </button>
                <button
                type="submit"
                class="btn btn-primary"
                :disabled="petStore.loading || !form.name || !form.kind"
                >
                <span v-if="petStore.loading" class="spinner"></span>
                {{ petStore.loading ? 'Creating...' : 'Add Pet' }}
                </button>
            </div>

            <!-- Error Message -->
            <div v-if="petStore.error" class="error-message">
                {{ petStore.error }}
            </div>

            <!-- Success Message -->
            <div v-if="showSuccess" class="success-message">
                🎉 Pet created successfully!
            </div>
        </form>
    </div>
</template>

<style scoped>
.preview-image {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid #e0e0e0;
}

.image-preview-container {
    text-align: center;
    padding: 1rem;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    background: #f8f9fa;
}

.preview-title {
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
}

.remove-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid white;
    background-color: #dc3545;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(50%, -50%);
    font-size: 14px;
    line-height: 1;
}

.remove-btn:hover {
    background-color: #c82333;
}

.pet-create-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: white;
}

.pet-create-form h3 {
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
}

.form-group {
    margin-bottom: 1rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
    }

.form-control {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-control:focus {
    outline: none;
    border-color: #007bff;
}

.type-options {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.type-option {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.type-option input {
    margin-right: 0.5rem;
}

.option-label {
    font-size: 0.9rem;
}

.form-check {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.form-check input {
    margin-right: 0.5rem;
}

.check-label {
    font-size: 0.9rem;
}

.form-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #0056b3;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #545b62;
}

.error-message {
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    font-size: 0.9rem;
}

.success-message {
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
    font-size: 0.9rem;
    text-align: center;
}

.spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 480px) {
    .pet-create-form {
        padding: 1rem;
    }
    
    .type-options {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>