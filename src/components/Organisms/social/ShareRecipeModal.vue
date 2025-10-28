<script setup>
import { ref, watch } from 'vue';
import Button from '../../atoms/button.vue';
import searchBar from '../../atoms/searchBar.vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:show', 'create-post']);

// Form state
// Form state
const postTitle = ref('');
const postContent = ref('');
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



// Reset form when modal is closed
watch(() => props.show, (newVal) => {
    if (!newVal) {
        postTitle.value = '';
        postContent.value = '';
        removeImage(); 
    }
});

const closeModal = () => {
    emit('update:show', false);
};

const handleSubmit = () => {
    if (postTitle.value && postContent.value) {
        emit('create-post', {
            title: postTitle.value,
            content: postContent.value,
            imageFile: imageFile.value
        });
        closeModal();
    } else {
        alert('Please fill out both the title and content.');
    }
};
</script>

<template>
    <div v-if="show" class="modal-backdrop" @click="closeModal">
        <div class="modal-content bg-white" @click.stop>
            <div class="modal-header">
                <h5 class="modal-title headingFont">Share a Recipe</h5>
                <Button icon="bi-x-lg" outline color="danger" @click="closeModal" label="X" class="ms-auto" />
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="modal-body">
                    <!-- Post Title -->
                    <div class="mb-3">
                        <label class="form-label headingFont fw-bold h5">Title</label>
                        <searchBar 
                            placeholder="What's the title of your post?" 
                            v-model="postTitle"
                        />
                    </div>

                    <!-- Post Content -->
                    <div class="mb-3">
                        <label class="form-label headingFont fw-bold h5">Content</label>
                        <searchBar
                            v-model="postContent"
                            type="textarea"
                            placeholder="What's on your mind?"
                        />
                    </div>

                    <!-- Image Upload -->
                    <div class="mb-3">
                        <label for="post-photo-input" class="form-label headingFont fw-bold h5">Attach an Image (Optional)</label>
                        <input id="post-photo-input" type="file" accept="image/*" @change="handleImageSelect" class="d-none" />
                        <label for="post-photo-input" class="d-block" style="cursor: pointer;">
                            <searchBar 
                                :model-value="imageFile ? imageFile.name : ''" 
                                placeholder="Click to select an image..." 
                                readonly
                            >
                                <template #icon><i class="bi bi-upload"></i></template>
                            </searchBar>
                        </label>
                    </div>

                    <!-- Image Preview -->
                    <div v-if="imagePreview" class="image-preview-container text-center p-3 border border-2 border-dashed rounded bg-light mb-3">
                        <h6 class="preview-title">Preview</h6>
                        <div class="position-relative d-inline-block">
                            <img :src="imagePreview" alt="Preview" class="preview-image rounded object-fit-cover" />
                            <button type="button" @click="removeImage" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle">×</button>
                        </div>
                        <p class="text-muted small mt-1 mb-0">{{ imageFile?.name }} ({{ formatFileSize(imageFile?.size) }})</p>
                    </div>
                </div>

                <div class="modal-footer">
                    <Button type="submit" label="Post">
                        <i class="bi bi-send mx-1"></i>
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* These styles are copied directly from AddIngredientModal for consistency */
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
    max-width: 600px; /* A bit wider for post content */
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color:white;
}

.modal-title {
    margin: 0;
    font-weight: 600;
}

.modal-body {
    padding: 1.5rem;
    overflow-y: auto;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

/* Specific style for the textarea */
textarea.form-control {
    resize: vertical; /* Allow vertical resizing */
    min-height: 120px;
}
.preview-image {
  width: 150px;
  height: 150px;
  border: 2px solid #e0e0e0;
}
</style>
