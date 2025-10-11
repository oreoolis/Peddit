import { supabase } from "@/lib/supabaseClient";
import { ref, onMounted } from "vue";

export function useAuth() {
    const session = ref();
    const user = ref();
    const loading = ref(true);
    const error = ref(null);

    const initAuth = async () => {
        try {
            loading.value = true;
            const { data, error: sessionError } = await supabase.auth.getSession();

            if(sessionError) throw sessionError;

            session.value = data.session;
            user.value = data.session?.user ?? null;
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }
    
    const signInWithEmail = async (email, options = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const { error: signInError } = await supabase.auth.signInWithOtp({
                email,
                options
            });

            if(signInError) throw signInError;

            return { success: true };
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const signInWithOAuth = async () => {
        try {
            loading.value = true;
            error.value = null;

            const { error: oAuthError } = await supabase.auth.signInWithOAuth({
                provider: 'google'
            });

            if(oAuthError) throw oAuthError;

            return { success: true };
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err };
        } finally {
            loading.value = false;
        }
    };

    const signOut = async () => {
        try {
            const { error: signOutError } = await supabase.auth.signOut();
            if(signOutError) throw signOutError;

            session.value = null;
            user.value = null;

            return { success: true };
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err };
        }
    };

    // subscription is exposed so other components can unlisten to this event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
        session.value = newSession;
        user.value = newSession?.user ?? null;
        loading.value = false;
    });

    initAuth();

    return {
        // State
        session, 
        user, 
        loading, 
        error, 
        
        // Method
        signInWithEmail, 
        signInWithOAuth,
        signOut
    };
}