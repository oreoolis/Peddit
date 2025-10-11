import { supabase } from "@/lib/supabaseClient";
import { ref, watch, isRef, unref } from 'vue'

export function useUserData(userId) {
    const profile = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const fetchProfile = async (id) => {
        // Ensure we have a valid UUID string
        const userId = unref(id)
        console.log('Fetching profile for user ID:', userId);
        
        if (!userId || typeof userId !== 'string') {
            console.log('Invalid user ID:', userId);
            profile.value = null;
            return;
        }

        try {
            loading.value = true;
            error.value = null;

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if(fetchError) throw fetchError;
            profile.value = data;
        } catch (err) {
            error.value = err.message;
            console.error('Error fetching profile: ', err);
        } finally{
            loading.value = false;
        }
    }

    const updateProfile = async (updates) => {
        const id = unref(userId);
        console.log('Updating profile for user ID:', id);
        
        if (!id || typeof id !== 'string') {
            return { success: false, error: 'No valid user ID' };
            }

            try {
                loading.value = true;
                error.value = null;
                
                const upsertData = {
                    id: id,
                    ...updates,
                    updated_at: new Date().toISOString()
                }

                const { data, error: upsertError } = await supabase
                    .from('profiles')
                    .upsert(upsertData)
                    .select()
                    .single();

                if (upsertError) throw upsertError;
                
                profile.value = data;
                return { success: true, data };
            } catch (err) {
                console.error('Error updating profile:', err);
                error.value = err.message;
                return { success: false, error: err };
            } finally {
                loading.value = false;
            }
    }

    // Watch for userId changes
    if (isRef(userId)) {
        // userId is a ref/computed
        watch(userId, (newId) => {
            console.log('User ID changed:', newId);
            fetchProfile(newId);
        }, { immediate: true })
    } else {
        // userId is a static value
        console.log('Static user ID:', userId);
        fetchProfile(userId);
    }

    return {
        // State
        profile,
        loading,
        error,

        // Methods
        fetchProfile,
        updateProfile
    }
}