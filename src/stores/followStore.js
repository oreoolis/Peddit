// stores/followStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';

export const useFollowStore = defineStore('follow', () => {
  // State
  const isFollowing = ref(false);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Checks if the follower is currently following the followee.
   * @param {string} followerId - The ID of the user who might be following.
   * @param {string} followeeId - The ID of the user who might be followed.
   * @returns {Promise<{ success: boolean, isFollowing?: boolean, error?: string }>}
   */
  const checkFollowStatus = async (followerId, followeeId) => {
    if (!followerId || !followeeId) {
      return { success: false, error: 'Follower and Followee IDs are required.' };
    }

    try {
      loading.value = true;
      error.value = null;

      const { data, error: checkError } = await supabase
        .from('follows')
        .select('id') // We only need to know if a row exists
        .eq('follower_id', followerId)
        .eq('followee_id', followeeId)
        .limit(1); // <-- THE KEY CHANGE: Use .limit(1)

      if (checkError) {
        // This will now only catch "real" database errors, not "not found"
        throw checkError;
      }

      // `data` is now an array. If it has any items, the user is following.
      isFollowing.value = data && data.length > 0;
      return { success: true, isFollowing: isFollowing.value };

    } catch (err) {
      error.value = err.message;
      console.error('Error checking follow status:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Creates a follow relationship.
   * The database trigger `trg_follow_counts` will automatically update the counts.
   * @param {string} followerId - The ID of the user who is following.
   * @param {string} followeeId - The ID of the user to be followed.
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const followUser = async (followerId, followeeId) => {
    if (!followerId || !followeeId) {
      return { success: false, error: 'Follower and Followee IDs are required.' };
    }
    
    // Prevent a user from following themselves
    if (followerId === followeeId) {
      return { success: false, error: 'You cannot follow yourself.' };
    }

    try {
      loading.value = true;
      error.value = null;

      const { error: followError } = await supabase
        .from('follows')
        .insert({
          follower_id: followerId,
          followee_id: followeeId,
        });

      if (followError) {
        // Handle potential race conditions or duplicate follows gracefully
        if (followError.code === '23505') { // Unique violation
          console.warn('Follow relationship already exists.');
          // We can still consider this a success and update the state
          isFollowing.value = true;
          return { success: true };
        }
        throw followError;
      }

      isFollowing.value = true;
      return { success: true };

    } catch (err) {
      error.value = err.message;
      console.error('Error following user:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Removes a follow relationship.
   * The database trigger `trg_follow_counts` will automatically update the counts.
   * @param {string} followerId - The ID of the user who is unfollowing.
   * @param {string} followeeId - The ID of the user to be unfollowed.
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const unfollowUser = async (followerId, followeeId) => {
    if (!followerId || !followeeId) {
      return { success: false, error: 'Follower and Followee IDs are required.' };
    }

    try {
      loading.value = true;
      error.value = null;

      const { error: unfollowError } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('followee_id', followeeId);

      if (unfollowError) throw unfollowError;

      isFollowing.value = false;
      return { success: true };

    } catch (err) {
      error.value = err.message;
      console.error('Error unfollowing user:', err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    isFollowing,
    loading,
    error,
    
    // Actions
    checkFollowStatus,
    followUser,
    unfollowUser
  };
});