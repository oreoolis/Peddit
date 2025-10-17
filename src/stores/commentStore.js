// stores/commentStore.js
import { useStorage } from "@/composables/useStorage";
import { supabase } from "@/lib/supabaseClient";
import { defineStore } from "pinia";
import { ref } from "vue";

const { getPublicImage } = useStorage();

export const useCommentStore = defineStore('comments', () => {
    // State
    const comments = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // Actions
    const fetchCommentsByPostID = async (postId) => {
        try {
            loading.value = true;
            error.value = null;

            comments.value = [];

            const { data, error: supabaseError } = await supabase
                .from('comments')
                .select(`
                    *,
                    profiles:author_id (
                        username,
                        display_name,
                        avatar_url
                    )
                `)
                .eq('post_id', postId)
                .order('created_at', { ascending: false });
            
            if(supabaseError) throw supabaseError;

            const transformedComments = data.map(comment => {
                if (comment.profiles?.avatar_url) {
                    comment.profiles.avatar_url = getPublicImage('avatars', comment.profiles.avatar_url);
                }
                return comment;
            });

            comments.value = transformedComments || [];
            return { success: true, data: transformedComments };
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
        loading,
        error,
        // Actions
        fetchCommentsByPostID,
    };
});