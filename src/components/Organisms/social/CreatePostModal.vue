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
const postTitle = ref('');
const postContent = ref('');
// support multiple files
const imageFiles = ref([]);
const imagePreviews = ref([]); // array of { url, name, size }

// Character limits
const TITLE_MAX_CHARS = 120;
const CONTENT_MAX_CHARS = 5000;

const enforceChars = (text = '', max = Infinity) => {
    if (!text) return '';
    return text.slice(0, max);
}

const titleCharsRemaining = () => Math.max(0, TITLE_MAX_CHARS - (postTitle.value?.length || 0));
const contentCharsRemaining = () => Math.max(0, CONTENT_MAX_CHARS - (postContent.value?.length || 0));

// Keep inputs within character limits as user types/pastes
watch(postTitle, (val) => {
    if (val == null) return;
    const enforced = enforceChars(val, TITLE_MAX_CHARS);
    if (enforced !== val) postTitle.value = enforced;
});

watch(postContent, (val) => {
    if (val == null) return;
    const enforced = enforceChars(val, CONTENT_MAX_CHARS);
    if (enforced !== val) postContent.value = enforced;
});


const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    // append new files (avoid duplicates by name+size) and create previews
    files.forEach(file => {
        const exists = imageFiles.value.some(f => f.name === file.name && f.size === file.size);
        if (!exists) {
            imageFiles.value.push(file);
            imagePreviews.value.push({ url: URL.createObjectURL(file), name: file.name, size: file.size });
        }
    });

    // clear the native input so same file can be re-selected if removed
    event.target.value = '';
}

const removeImage = (index) => {
    const prev = imagePreviews.value[index];
    if (prev && prev.url) URL.revokeObjectURL(prev.url);
    imagePreviews.value.splice(index, 1);
    imageFiles.value.splice(index, 1);
}



// Reset form when modal is closed
watch(() => props.show, (newVal) => {
    if (!newVal) {
        postTitle.value = '';
        postContent.value = '';
        // revoke and clear all previews
        imagePreviews.value.forEach(p => p.url && URL.revokeObjectURL(p.url));
        imagePreviews.value = [];
        imageFiles.value = [];
    }
});

const closeModal = () => {
    emit('update:show', false);
};

const handleSubmit = () => {
    // enforce limits again before submit
    postTitle.value = enforceChars(postTitle.value, TITLE_MAX_CHARS);
    postContent.value = enforceChars(postContent.value, CONTENT_MAX_CHARS);

    if (postTitle.value && postContent.value) {
        emit('create-post', {
            title: postTitle.value,
            content: postContent.value,
            // keep backward-compatible single-file key plus new array key
            imageFile: imageFiles.value[0] ?? null,
            imageFiles: imageFiles.value.length ? imageFiles.value.slice() : null
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
            <div class="modal-header d-flex shadow sticky-top">
                <h5 class="modal-title headingFont">Create a New Post</h5>
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
                        <div class="form-text text-muted small mt-1">
                            {{ titleCharsRemaining() }} chars remaining
                        </div>
                    </div>

                    <!-- Post Content -->
                    <div class="mb-3">
                        <label class="form-label headingFont fw-bold h5">Content</label>
                        <searchBar
                            v-model="postContent"
                            type="textarea"
                            placeholder="What's on your mind?"
                        />
                        <div class="form-text text-muted small mt-1">
                            {{ contentCharsRemaining() }} chars remaining
                        </div>
                    </div>

                    <!-- Image Upload -->
                    <div class="mb-3">
                        <label for="post-photo-input" class="form-label headingFont fw-bold h5">Attach Images (Optional)</label>
                        <input id="post-photo-input" type="file" accept="image/*" multiple @change="handleImageSelect" class="d-none" />
                        <label for="post-photo-input" class="d-block" style="cursor: pointer;">
                            <searchBar 
                                :model-value="imageFiles.length ? (imageFiles.length === 1 ? imageFiles[0].name : imageFiles.length + ' files selected') : ''" 
                                placeholder="Click to select images..." 
                                readonly
                            >
                                <template #icon><i class="bi bi-upload"></i></template>
                            </searchBar>
                        </label>
                    </div>

                    <!-- Image Previews (multiple) -->
                    <div v-if="imagePreviews.length" class="image-preview-container d-flex flex-wrap gap-3 p-3 border border-2 border-dashed rounded bg-light mb-3">
                        <div class="w-100"><h6 class="preview-title">Preview</h6></div>
                        <div v-for="(p, idx) in imagePreviews" :key="p.name + '-' + p.size" class="position-relative d-inline-block">
                            <img :src="p.url" :alt="p.name" class="preview-image rounded object-fit-cover" />
                            <button type="button" @click="removeImage(idx)" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle">×</button>
                            <div class="text-center small text-truncate mt-1" style="max-width:150px">{{ p.name }}</div>
                            <div class="text-center text-muted small">{{ formatFileSize(p.size) }}</div>
                        </div>
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
