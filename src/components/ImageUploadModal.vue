<script setup>
import { ref, watch } from 'vue';
import { onUnmounted } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    currentAvatar: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['update:show', 'uploaded', 'error']);

const selectedFile = ref(null);
const previewUrl = ref(null);
const uploading = ref(false);
const uploadProgress = ref(0);
const error = ref(null);

// Reset when modal opens/closes
watch(() => props.show, (newVal) => {
    if (!newVal) {
        resetForm();
    }
});

const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        error.value = 'Please select a valid image file (JPG, PNG, GIF, WebP)';
        return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        error.value = 'File size must be less than 5MB';
        return;
    }

    error.value = null;
    selectedFile.value = file;

    // Create preview
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = URL.createObjectURL(file);
}

const handleUpload = async () => {
    if (!selectedFile.value) return;

    try {
        uploading.value = true;
        error.value = null;
        uploadProgress.value = 0;

        // Simulate upload progress (you can replace this with actual progress events)
        const progressInterval = setInterval(() => {
            if (uploadProgress.value < 90) {
                uploadProgress.value += 10;
            }
        }, 200);

        // Emit the file to parent component for actual upload
        emit('uploaded', selectedFile.value);

        // Clean up
        clearInterval(progressInterval);
        uploadProgress.value = 100;
        
        // Close modal after successful upload
        setTimeout(() => {
            closeModal();
        }, 500);
    } catch (err) {
        error.value = 'Upload failed: ' + err.message;
        emit('error', err);
    } finally {
        uploading.value = false;
    }
}

const closeModal = () => {
    if (!uploading.value) {
        emit('update:show', false);
    }
};

const resetForm = () => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }
    selectedFile.value = null;
    previewUrl.value = null;
    uploading.value = false;
    uploadProgress.value = 0;
    error.value = null;
}

const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Clean up object URLs when component unmounts
onUnmounted(() => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }
})
</script>

<template>
    <div v-if="show" class="modal-backdrop" @click="closeModal">
        <div class="modal-content bg-white" @click.stop>
            <div class="modal-header d-flex">
                <h5 class="modal-title primary">Upload Profile Picture</h5>
                <button type="button" class="btn-close ms-auto" @click="closeModal"></button>
            </div>
            
            <div class="modal-body">
                <!-- File Input -->
                <div class="mb-3">
                <label for="image-upload" class="form-label">Choose an image</label>
                <input 
                    type="file" 
                    id="image-upload"
                    class="form-control" 
                    accept="image/*"
                    @change="handleFileSelect"
                    :disabled="uploading"
                >
                <div class="form-text">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                </div>
                </div>

                <!-- Image Preview -->
                <div v-if="previewUrl" class="image-preview-container text-center mb-3">
                <h6>Preview</h6>
                <img 
                    :src="previewUrl" 
                    alt="Preview" 
                    class="image-preview"
                >
                <p class="text-muted small mt-2">
                    {{ selectedFile?.name }} ({{ formatFileSize(selectedFile?.size) }})
                </p>
                </div>

                <!-- Upload Progress -->
                <div v-if="uploading" class="progress mb-3">
                <div 
                    class="progress-bar progress-bar-striped progress-bar-animated" 
                    role="progressbar" 
                    :style="{ width: uploadProgress + '%' }"
                >
                    {{ uploadProgress }}%
                </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="alert alert-danger">
                {{ error }}
                </div>
            </div>

            <div class="modal-footer">
                <button 
                    type="button" 
                    class="btn bg-primary white" 
                    @click="handleUpload"
                    :disabled="!selectedFile || uploading"
                >
                    <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ uploading ? 'Uploading...' : 'Upload' }}
                </button>
                <button 
                    type="button" 
                    class="btn btn-secondary" 
                    @click="closeModal"
                    :disabled="uploading"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1050;
    }

    .modal-content {
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        justify-content: between;
        align-items: center;
    }

    .modal-title {
        margin: 0;
        font-weight: 600;
    }

    .modal-body {
        padding: 1.5rem;
    }

    .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #dee2e6;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }

    .image-preview-container {
        padding: 1rem;
        border: 2px dashed #dee2e6;
        border-radius: 8px;
        background: #f8f9fa;
    }

    .image-preview {
        max-width: 200px;
        max-height: 200px;
        border-radius: 8px;
        object-fit: cover;
    }

    .progress {
        height: 8px;
    }
</style>