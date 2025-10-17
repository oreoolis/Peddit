// stores/userStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { validateImageFile } from '@/utils/imageFileValidation';
import { useStorage } from '@/composables/useStorage';
import { useAuthStore } from './authStore';

const { uploadImage, deleteImage } = useStorage();

export const useUserStore = defineStore('user', () => {
    // State
    const profile = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Getters
    const hasProfile = computed(() => !!profile.value);
    const avatarUrl = computed(() => {
        if (!profile.value?.avatar_url) return null;
        const { getPublicImage } = useStorage();
        return getPublicImage('avatars', profile.value.avatar_url);
    });
    const username = computed(() => profile.value?.display_name || profile.value?.username || 'user');
    const follows = computed(() => profile.value?.following_count || 0);
    const followers = computed(() => profile.value?.follower_count || 0);

    // Actions
    const fetchProfile = async () => {
        const authStore = useAuthStore();
        const userId = authStore.userId;
        
        if (!userId) {
            console.warn('No authenticated user found');
            return { success: false, error: 'No authenticated user' };
        }

        try {
            loading.value = true;
            error.value = null;

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (fetchError) throw fetchError;

            profile.value = data;
            
            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            profile.value = null;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    const updateProfile = async (updates) => {
        const authStore = useAuthStore();
        const userId = authStore.userId;
        
        if (!userId) {
            return { success: false, error: 'No authenticated user' };
        }

        try {
            loading.value = true;
            error.value = null;

            const { data, error: updateError } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (updateError) throw updateError;

            profile.value = data;
            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    const uploadProfileImage = async (file) => {
        const authStore = useAuthStore();
        const userId = authStore.userId;
        
        if (!userId) {
            return { success: false, error: 'No authenticated user' };
        }

        try {
            validateImageFile(file);

            // Delete old profile image if exists
            if (profile.value?.avatar_url) {
                await deleteImage('avatars', profile.value.avatar_url);
            }

            // Upload new profile image
            const storagePath = `${userId}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await uploadImage('avatars', file, storagePath);
            if (uploadError) throw uploadError;

            // Update profile image url
            const result = await updateProfile({
                avatar_url: storagePath
            });

            return result;
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        }
    };

    const deleteProfileImage = async () => {
        const authStore = useAuthStore();
        const userId = authStore.userId;
        
        if (!userId) {
            return { success: false, error: 'No authenticated user' };
        }

        try {
            if (!profile.value?.avatar_url) return { success: true };

            // Delete from storage
            const { error: deleteError } = await deleteImage('avatars', profile.value.avatar_url);
            if (deleteError) throw deleteError;

            const result = await updateProfile({
                avatar_url: null
            });

            return result;
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        }
    };

    const clearProfile = () => {
        profile.value = null;
        error.value = null;
    };

    return {
        // State
        profile,
        loading,
        error,

        // Getters
        hasProfile,
        username,
        avatarUrl,
        follows,
        followers,

        // Actions 
        fetchProfile,
        updateProfile,
        clearProfile,
        uploadProfileImage,
        deleteProfileImage
    };
});