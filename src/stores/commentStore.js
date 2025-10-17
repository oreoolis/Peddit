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
    const submitting = ref(false);

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

    const createComment = async ({ postId, authorId, content, authorProfile }) => {
        if (!postId || !authorId || !content?.trim()) {
            return { success: false, error: 'Post ID, Author ID, and content are required.' };
        }

        try {
            submitting.value = true;
            error.value = null;

            // Optimistically add the comment to the UI for instant feedback
            const optimisticComment = {
                id: `temp-${Date.now()}`, // Temporary ID
                post_id: postId,
                author_id: authorId,
                content: content.trim(),
                created_at: new Date().toISOString(),
                profiles: { ...authorProfile, avatar_url: getPublicImage('avatars', authorProfile.avatar_url)} // Attach author profile data
            };
            
            // Prepend the optimistic comment to the list
            comments.value.unshift(optimisticComment);

            // Now, actually insert the comment into the database
            const { data, error: insertError } = await supabase
                .from('comments')
                .insert({
                    post_id: postId,
                    author_id: authorId,
                    content: content.trim(),
                })
                .select() // Select the newly created row to get its real ID and timestamp
                .single();

            if (insertError) throw insertError;

            // Replace the optimistic comment with the real one from the database
            const realComment = {
                ...data,
                profiles: optimisticComment.profiles // Keep the profile data we already have
            };
            
            // Find the temp comment and replace it
            const index = comments.value.findIndex(c => c.id === optimisticComment.id);
            if (index !== -1) {
                comments.value[index] = realComment;
            }

            return { success: true, data: realComment };

        } catch (err) {
            error.value = err.message;
            console.error('Error creating comment:', err);
            
            // If the insert failed, remove the optimistic comment
            comments.value = comments.value.filter(c => c.id !== `temp-${Date.now()}`);
            
            return { success: false, error: err.message };
        } finally {
            submitting.value = false;
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