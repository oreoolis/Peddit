<script setup>
import { supabase } from '@/lib/supabaseClient';
import { ref, toRefs, watchEffect } from 'vue';

const prop = defineProps(['path', 'size']);
const { path, size } = toRefs(prop);

const emit = defineEmits(['upload', 'update:path']);
const uploading = ref(false);
const src = ref('');
const files = ref();

const downloadImage = async () => {
    try {
        const { data, error } = await supabase.storage
            .from('avatars')
            .download(path.value);
        if (error) throw error;
        src.value = URL.createObjectURL(data);
    } catch (error) {
        console.error('Error downloading image: ', error.message);
    }
}

const uploadAvatar = async (evt) => {
    files.value = evt.target.files;
    try {
        uploading.value = true;
        if(!files.value || files.value.length === 0){
            throw new Error('You must select an image to upload.');
        }

        const file = files.value[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${Math.random()}.${fileExt}`; // To avoid collisions and sequential naming; can use UUIDv4 instead

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);
        
        if(uploadError) throw uploadError;
        emit('update:path', filePath);
        emit('upload');
    } catch (error) {
        alert(error.message);
    } finally{
        uploading.value = false;
    }
}

watchEffect(() => {
    if(path.value) downloadImage();
});

</script>

<template>
    <div>
        <div class="card mb-3">
            <div class="card-header">Upload Widget</div>
            <div class="card-body">
                <h4 class="card-title">Select an image to upload</h4>
                <img
                    v-if="src"
                    :src="src"
                    alt="Avatar"
                    class="avatar image"
                    :style="{ height: size + 'em', width: size + 'em' }"
                >
                <div v-else 
                    class="avatar no-image"
                    :style="{ height: size + 'em', width: size + 'em' }"
                >
                </div>
            </div>
            <div 
                class="card-footer text-muted text-center"
                
            >
                <label class="form-label" for="single">
                    {{ uploading ? 'Uploading...' : 'Upload' }}
                </label>
                <input 
                    style="visibility: hidden; position: absolute;"
                    type="file"
                    id="single"
                    accept="image/*"
                    @change="uploadAvatar"
                    :disabled="uploading"
                >
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>