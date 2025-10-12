import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';

export const useUserStore = defineStore('user', () => {
    // State
    const profile = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const lastFetchedUserId = ref(null);

    // Getters
    const hasProfile = computed(() => !!profile.value);
    const avatarUrl = computed(() => profile.value?.avatar_url || null);
    const username = computed(() => profile.value?.display_name || 'user');
    const follows = computed(() => profile.value?.following_count || 0);
    const followers = computed(() => profile.value?.follower_count || 0);

    // Primary Action: Fetch any user's profile
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

    // Primary Action: Update any user's profile
    const updateProfile = async (userId, updates) => {
        if (!userId) {
            return { success: false, error: 'No user ID provided' };
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

            // Update local state if this is the currently loaded profile
            if (userId === lastFetchedUserId.value) {
                profile.value = data;
            }

            return { success: true, data };
        } catch (err) {
            error.value = err.message;
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
        updateProfile,
        clearProfile,
    };
});
