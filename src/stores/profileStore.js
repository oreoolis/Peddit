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
    const profiles = ref([]);
    const loading = ref(false);
    const loadingProfiles = ref(false);
    const error = ref(null);
    const lastFetchedUsername = ref(null);

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
     * Clears the currently loaded profile data
     * @returns {void}
    */
    const clearProfile = () => {
        profile.value = null;
        lastFetchedUsername.value = null;
        error.value = null;
    };

    /**
     * Fetch multiple profiles (exclude current user optionally)
     * options: { excludeId, q, limit, offset }
     */
    const fetchProfiles = async (options = {}) => {
        const { excludeId = null, q = null, limit = 12, offset = 0 } = options;
        try {
            loadingProfiles.value = true;
            error.value = null;

            let query = supabase
                .from('profiles')
                .select('*')
                .order('display_name', { ascending: true });

            if (excludeId) query = query.neq('id', excludeId);
            if (q) query = query.ilike('display_name', `%${q}%`);

            const start = offset;
            const end = offset + Math.max(1, limit) - 1;
            const { data, error: fetchError } = await query.range(start, end);
            if (fetchError) throw fetchError;

            const { getPublicImage } = useStorage();
            const transformed = (data || []).map(p => {
                if (p.avatar_url) p.avatar_url = getPublicImage('avatars', p.avatar_url);
                return p;
            });

            profiles.value = transformed;
            return { success: true, data: transformed };
        } catch (err) {
            console.error('fetchProfiles error', err);
            error.value = err.message || String(err);
            return { success: false, error: error.value };
        } finally {
            loadingProfiles.value = false;
        }
    };

    return {
        // State
        profile,
        profiles,
        loading,
        loadingProfiles,
        error,

        // Getters
        hasProfile,
        username,
        avatarUrl,
        follows,
        followers,

        // Actions 
        fetchProfile,
        fetchProfiles,
        clearProfile
    };
});