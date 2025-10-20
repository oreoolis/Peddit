// stores/postStore.js
import { useStorage } from '@/composables/useStorage';
import { supabase } from '@/lib/supabaseClient';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const { getPublicImage } = useStorage();

/**
 * Post store for managing posts, including fetching, creating, updating, and deleting posts
 * Also handles post voting and media management
*/
export const usePostStore = defineStore('posts', () => {
    // State
    const posts = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentPost = ref(null);
    const hasMore = ref(true);
    const page = ref(0);
    const PAGE_SIZE = 10;

    // Getters
    const postCount = computed(() => posts.value.length);
    const publicPosts = computed(() => posts.value.filter(post => post.is_public));
    const userPosts = computed(() => (userId) => posts.value.filter(post => post.author_id === userId));
    const popularPosts = computed(() => [...posts.value].sort((a, b) => b.vote_score - a.vote_score).slice(0, 5));

    // Actions
    /**
     * Fetches posts from the database with optional filtering and pagination
     * @param {object} [options={}] - Options for fetching posts
     * @param {string} [options.userId] - Filter posts by author ID
     * @param {boolean} [options.publicOnly=true] - Filter to only show public posts
     * @param {boolean} [options.loadMore=false] - Whether to load more posts or reset the list
     * @returns {Promise<{ success: boolean, transformedPosts?: Array, error?: string }>}
    */
    const fetchPosts = async (options = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const { userId, publicOnly = true, loadMore = false } = options;

            // Pagination stuff
            if (loadMore) {
                page.value += 1;
            } else {
                page.value = 0;
                posts.value = [];
            }

            // Query joins profiles to get the image of the post author
            let query = supabase
                .from('posts')
                .select(`
                    *,
                    profiles:author_id (
                        username,
                        display_name,
                        avatar_url
                    ),
                    post_media (*)
                `)
                .order('created_at', { ascending: false })
                .range(page.value * PAGE_SIZE, (page.value + 1) * PAGE_SIZE - 1);

            // Apply filters
            if (publicOnly) {
                query = query.eq('is_public', true);
            }
            if (userId) {
                query = query.eq('author_id', userId);
            }

            const { data, error: supabaseError } = await query;

            // Change the avatar_url into the image URL inside supabase avatars storage bucket
            const transformedPosts = data.map(post => {
                if (post.profiles?.avatar_url) {
                    post.profiles.avatar_url = getPublicImage('avatars', post.profiles.avatar_url);
                }
                return post;
            });

            if (supabaseError) throw supabaseError;

            if (loadMore) {
                posts.value = [...posts.value, ...transformedPosts];
            } else {
                posts.value = transformedPosts || [];
            }

            hasMore.value = data.length === PAGE_SIZE;

            return { success: true, transformedPosts };

        } catch (err) {
            error.value = err.message;
            console.error('Error fetching posts:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Fetches posts from the database with optional filtering and pagination
     * @param {string} postId - The postId of post you trying to fetch
     * @returns {Promise<{ success: boolean, error?: string }>}
    */
    const fetchPostById = async (postId) => {
        try {
            loading.value = true;
            error.value = null;

            // Join post with author
            const { data, error: supabaseError } = await supabase
                .from('posts')
                .select(`
                    *,
                    profiles:author_id (
                        username,
                        display_name,
                        avatar_url
                    ),
                    post_media (*)
                `)
                .eq('id', postId)
                .single();

            if (supabaseError) throw supabaseError;

            if (data.profiles?.avatar_url) {
                data.profiles.avatar_url = getPublicImage('avatars', data.profiles.avatar_url);
            }

            currentPost.value = data;
            return { success: true, data };

        } catch (err) {
            error.value = err.message;
            console.error('Error fetching post:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    // TODO: Make post lock to current user only
    // const authStore = useAuthStore();
    // const userId = computed(() => authStore.userId);
    /**
     * Create a post and tie it to current user
     * @param {string} userId - The userId author of the post
     * @param {string} postData - The post fields to update (title, content, is_public, nsfw(Gorey pet image like injuries))
     * @returns {Promise<{ success: boolean, error?: string }>}
    */
    const createPost = async (userId, postData) => {
        try {
            loading.value = true;
            error.value = null;

            if (!postData.content && !postData.title) {
                throw new Error('Post must have content or title');
            }

            const { data, error: supabaseError } = await supabase
                .from('posts')
                .insert([{
                    author_id: userId,
                    title: postData.title?.trim() || null,
                    content: postData.content?.trim() || null,
                    is_public: postData.is_public ?? true,
                    nsfw: postData.nsfw ?? false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select(`
                    *,
                    profiles:author_id (
                        username,
                        display_name,
                        avatar_url
                    )
                `)
                .single();

            if (supabaseError) throw supabaseError;

            if (data.profiles?.avatar_url) {
                data.profiles.avatar_url = getPublicImage('avatars', data.profiles.avatar_url);
            }

            // Add to local state (at beginning for newest first)
            posts.value.unshift(data);
            return { success: true, data };

        } catch (err) {
            error.value = err.message;
            console.error('Error creating post:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Update post by postId
     * @param {string} postId - The postId of post you trying to update
     * @param {Object} updates - The post fields to update (title, content, is_public, nsfw(Gorey pet image like injuries))
     * @returns {Promise<{ success: boolean, error?: string }>}
    */
    const updatePost = async (postId, updates) => {
        try {
            loading.value = true;
            error.value = null;

            const { data, error: supabaseError } = await supabase
                .from('posts')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', postId)
                .select(`
                    *,
                    profiles:author_id (
                        username,
                        display_name,
                        avatar_url
                    )
                `)
                .single();

            if (supabaseError) throw supabaseError;

            // Update in local state
            const index = posts.value.findIndex(post => post.id === postId);
            if (index !== -1) {
                posts.value[index] = data;
            }

            // Update currentPost if it's the one being edited
            if (currentPost.value?.id === postId) {
                currentPost.value = data;
            }

            if (data.profiles?.avatar_url) {
                data.profiles.avatar_url = getPublicImage('avatars', data.profiles.avatar_url);
            }

            return { success: true, data };

        } catch (err) {
            error.value = err.message;
            console.error('Error updating post:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Deletes the post by postId
     * TODO: Only can delete own post, check with auth
     * @param {string} postId - The postId of post you trying to delete
     * @returns {Promise<{ success: boolean, error?: string }>}
    */
    const deletePost = async (postId) => {
        try {
            loading.value = true;
            error.value = null;

            const { error: supabaseError } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);

            if (supabaseError) throw supabaseError;

            // Remove from local state
            posts.value = posts.value.filter(post => post.id !== postId);

            // Clear currentPost if it's the one being deleted
            if (currentPost.value?.id === postId) {
                currentPost.value = null;
            }

            return { success: true };

        } catch (err) {
            error.value = err.message;
            console.error('Error deleting post:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    // Vote actions
    /**
     * Upvote, downvote or remove vote on post
     * @param {string} postId - The postId of post you voting
     * @param {string} userId - The userId of user voting
     * @param {int} voteValue - The vote value of the post, (-1, 0, 1)
     * @returns {Promise<{ success: boolean, error?: string }>}
    */
    const voteOnPost = async (postId, userId, voteValue) => {
        try {
            // voteValue should be 1 (upvote), -1 (downvote), or 0 (remove vote)
            if (voteValue === 0) {
                // Remove existing vote
                const { error: deleteError } = await supabase
                    .from('post_votes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('voter_id', userId);

                if (deleteError) throw deleteError;
            } else {
                // Upsert vote
                const { error: upsertError } = await supabase
                    .from('post_votes')
                    .upsert({
                        post_id: postId,
                        voter_id: userId,
                        vote: voteValue
                    }, {
                        onConflict: 'post_id,voter_id'
                    });

                if (upsertError) throw upsertError;
            }

            // Refetch the post to get updated vote score
            await fetchPostById(postId);

            return { success: true };

        } catch (err) {
            error.value = err.message;
            console.error('Error voting on post:', err);
            return { success: false, error: err.message };
        }
    }

    // Media management
    const addPostMedia = async (postId, file) => {
        try {
            const filePath = `posts/${postId}/${Date.now()}-${file.name}`;
            
            // Upload to storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('post-media')  // TODO: Create this bucket
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = await supabase.storage
                .from('post-media')
                .getPublicUrl(filePath);

            // Add to post_media table
            const { data: mediaData, error: mediaError } = await supabase
                .from('post_media')
                .insert([{
                    post_id: postId,
                    storage_path: filePath,
                    mime: file.type,
                    size_bytes: file.size
                }])
                .select()
                .single();

            if (mediaError) throw mediaError;

            // Update local state
            const postIndex = posts.value.findIndex(post => post.id === postId);
            if (postIndex !== -1) {
                if (!posts.value[postIndex].post_media) {
                    posts.value[postIndex].post_media = [];
                }
                posts.value[postIndex].post_media.push(mediaData);
            }

            return { success: true, data: mediaData };

        } catch (err) {
            error.value = err.message;
            console.error('Error adding post media:', err);
            return { success: false, error: err.message };
        }
    }

    // Utility methods
    const setCurrentPost = (post) => {
        currentPost.value = post;
    }

    const clearCurrentPost = () => {
        currentPost.value = null;
    }

    const clearError = () => {
        error.value = null;
    }

    const clearPosts = () => {
        posts.value = [];
        currentPost.value = null;
        page.value = 0;
        hasMore.value = true;
    }

    return {
        // State
        posts,
        loading,
        error,
        currentPost,
        hasMore,
        page,

        // Getters
        postCount,
        publicPosts,
        userPosts,
        popularPosts,

        // Actions
        fetchPosts,
        fetchPostById,
        createPost,
        updatePost,
        deletePost,
        voteOnPost,
        addPostMedia,
        setCurrentPost,
        clearCurrentPost,
        clearError,
        clearPosts
    }
})