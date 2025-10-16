// stores/profileStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useStorage } from '@/composables/useStorage';

export const useProfileStore = defineStore('profile', () => {
    // State
    const profile = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const lastFetchedUserId = ref(null);

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
    const fetchProfile = async (userId) => {
        if (!userId || typeof userId !== 'string') {
            console.warn('Invalid user ID:', userId);
            return { success: false, error: 'Invalid user ID' };
        }

        // Skip if already loaded
        if (lastFetchedUserId.value === userId && profile.value) {
            return { success: true, data: profile.value };
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
            lastFetchedUserId.value = userId;
            
            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            profile.value = null;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    const clearProfile = () => {
        profile.value = null;
        lastFetchedUserId.value = null;
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
        clearProfile
    };
});