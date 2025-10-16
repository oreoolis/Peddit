// stores/authStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';

export const useAuthStore = defineStore('auth', () => {
    // State
    const session = ref(null);
    const user = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const initialised = ref(false);

    // Getters
    const isAuthenticated = computed(() => !!user.value);
    const userId = computed(() => user.value?.id ?? null);
    const userEmail = computed(() => user.value?.email ?? null);

    // Private: Auth state change subscription
    let authSubscription = null;

    // Actions
    const initAuth = async () => {
        // Prevent multiple initializations
        if (initialised.value) return;

        try {
            loading.value = true;
            error.value = null;

            // Get initial session
            const { data, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) throw sessionError;

            session.value = data.session;
            user.value = data.session?.user ?? null;

            // Set up auth state listener (only once!)
            if (!authSubscription) {
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                    async (event, newSession) => {
                        console.log('Auth event:', event);
                        session.value = newSession;
                        user.value = newSession?.user ?? null;
                        loading.value = false;

                        // Handle specific events
                        if (event === 'SIGNED_IN' && newSession?.user) {
                            // Fetch user profile when signed in
                            const userStore = useUserStore();
                            await userStore.fetchProfile();
                        } else if (event === 'SIGNED_OUT') {
                            // Clear user profile when signed out
                            const userStore = useUserStore();
                            userStore.clearProfile();
                        }
                    }
                );
                authSubscription = subscription;
            }

            initialised.value = true;
            return { success: true };
        } catch (err) {
            error.value = err.message;
            console.error('Auth initialization error:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    const signInWithEmail = async (email, options = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const { error: signInError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin,
                    ...options
                }
            });

            if (signInError) throw signInError;

            return { success: true };
        } catch (err) {
            error.value = err.message;
            console.error('Email sign-in error:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    // WIP: DO NOT USE
    const signInWithOAuth = async (provider = 'google', options = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const { error: oAuthError } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin,
                    ...options
                }
            });

            if (oAuthError) throw oAuthError;

            return { success: true };
        } catch (err) {
            error.value = err.message;
            console.error('OAuth sign-in error:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    const signOut = async () => {
        try {
            loading.value = true;
            error.value = null;

            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;

            session.value = null;
            user.value = null;

            return { success: true };
        } catch (err) {
            error.value = err.message;
            console.error('Sign-out error:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    const clearError = () => {
        error.value = null;
    };

    // Clear user-specific data from other stores
    const clearUserData = () => {
        // const petStore = usePetStore();
        // petStore.resetStore();
    };

    // Cleanup subscription when store is disposed
    const cleanup = () => {
        if (authSubscription) {
            authSubscription.unsubscribe();
            authSubscription = null;
        }
    };

    return {
        // State
        session,
        user,
        loading,
        error,
        initialised,

        // Getters
        isAuthenticated,
        userId,
        userEmail,

        // Actions
        initAuth,
        signInWithEmail,
        signInWithOAuth,
        signOut,
        clearError,
        cleanup,
    };
});