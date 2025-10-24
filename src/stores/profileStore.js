// stores/profileStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useStorage } from '@/composables/useStorage';

/**
 * Profile store for managing other users' profiles
 * Handles fetching and viewing profiles of other users (not the current user)
 * For current user profile management, use userStore instead
*/
export const useProfileStore = defineStore('profile', () => {
    // State
    const profile = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const lastFetchedUsername = ref(null);

    const profiles = ref([]);
    const query = ref('');

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
    const filteredProfiles = computed(() => profiles.value.filter(p => p.display_name.toLowerCase().includes(query.value.toLowerCase())));

    // Actions
    /**
     * Fetches a user's profile by username
     * Uses caching to avoid refetching the same profile
     * @param {string} username - The username of the profile to fetch
     * @param {boolean} [force=false] - Force refetch even if already loaded
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const fetchProfile = async (username, force = false) => {
        if (!username || typeof username !== 'string') {
            console.warn('Invalid username:', username);
            return { success: false, error: 'Invalid username' };
        }

        // Skip if already loaded
        if (!force && lastFetchedUsername.value === username && profile.value) {
            return { success: true, data: profile.value };
        }

        try {
            loading.value = true;
            error.value = null;

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single();

            if (fetchError) throw fetchError;

            profile.value = data;
            lastFetchedUsername.value = username;
            
            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            profile.value = null;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetches all user profiles
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const fetchAllProfiles = async () => {
        try {
            loading.value = true;
            error.value = null;

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*');

            if (fetchError) throw fetchError;

            profile.value = data;
            lastFetchedUsername.value = username;
            
            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            profile.value = null;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Clears the currently loaded profile data
     * @returns {void}
    */
    const clearProfile = () => {
        profile.value = null;
        lastFetchedUsername.value = null;
        error.value = null;
    };

    return {
        // State
        profile,
        loading,
        error,
        query,

        // Getters
        hasProfile,
        username,
        avatarUrl,
        follows,
        followers,
        filteredProfiles,

        // Actions 
        fetchProfile,
        clearProfile
    };
});