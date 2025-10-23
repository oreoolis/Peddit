// stores/commentStore.js
import { useStorage } from "@/composables/useStorage";
import { supabase } from "@/lib/supabaseClient";
import { defineStore } from "pinia";
import { ref } from "vue";

const { getPublicImage } = useStorage();

/**
 * Comment store for managing post comments
 * Handles fetching and creating comments for posts
*/
export const useCommentStore = defineStore('comments', () => {
    // State
    const comments = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const submitting = ref(false);

    // Actions
    /**
     * Fetches all comments for a specific post
     * @param {string} postId - The ID of the post to fetch comments for
     * @returns {Promise<{ success: boolean, data?: Array, error?: string }>}
    */
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

    /**
     * Creates a new comment on a post with optimistic UI updates
     * @param {object} params - Comment creation parameters
     * @param {string} params.postId - The ID of the post to comment on
     * @param {string} params.authorId - The ID of the user creating the comment
     * @param {string} params.content - The comment content
     * @param {object} params.authorProfile - The author's profile data for optimistic rendering
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const createComment = async (postId, authorId, body) => {
      try {
        loading.value = true;
        error.value = null;

        const { data, error: supabaseError } = await supabase
          .from('comments')
          .insert([{
            post_id: postId,
            author_id: authorId,
            body,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (supabaseError) throw supabaseError;

        // add locally
        comments.value.unshift(data);

        // Refresh the post so postStore recomputes comment_count / vote_score
        // dynamic import to avoid circular import at module top-level
        const { usePostStore } = await import('@/stores/postStore');
        const postStore = usePostStore();
        await postStore.fetchPostById(postId);

        return { success: true, data };
      } catch (err) {
        console.error('createComment error', err);
        error.value = err.message || String(err);
        return { success: false, error: error.value };
      } finally {
        loading.value = false;
      }
    };

    const deleteComment = async (commentId, postId) => {
      try {
        loading.value = true;
        error.value = null;

        const { error: supabaseError } = await supabase
          .from('comments')
          .delete()
          .eq('id', commentId);

        if (supabaseError) throw supabaseError;

        // update local cache
        comments.value = comments.value.filter(c => c.id !== commentId);

        // Refresh post so comment_count updates
        const { usePostStore } = await import('@/stores/postStore');
        const postStore = usePostStore();
        await postStore.fetchPostById(postId);

        return { success: true };
      } catch (err) {
        console.error('deleteComment error', err);
        error.value = err.message || String(err);
        return { success: false, error: error.value };
      } finally {
        loading.value = false;
      }
    };

    return {
        // State
        comments,
        loading,
        error,
        submitting,

        // Actions
        fetchCommentsByPostID,
        createComment,
    };
});