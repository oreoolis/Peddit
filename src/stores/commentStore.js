// stpre/commentStore.js

import { supabase } from "@/lib/supabaseClient";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommentStore = defineStore('comments', () => {
    // State
    const comments = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // Getters


    // Actions
    const fetchCommentsByPostID = async (postId) => {
        try {
            loading.value = true;
            error.value = null;

            comments.value = [];

            const { data, error: supabaseError } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: false });
            
            if(supabaseError) throw supabaseError;

            comments.value = data || [];
            console.log(comments.value);

            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            console.error('Error fetching comments:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    return {
        // State
        comments,

        // Getters

        // Actions
        fetchCommentsByPostID,
    };
});