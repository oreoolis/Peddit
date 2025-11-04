// stores/userStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { validateImageFile } from '@/utils/imageFileValidation';
import { useStorage } from '@/composables/useStorage';
import { useAuthStore } from './authStore';

const { uploadImage, deleteImage } = useStorage();

/**
 * User store for managing the current user's profile data
 * Handles fetching, updating, and managing user profile information
*/
export const useUserStore = defineStore('user', () => {
    // Private
    const authStore = useAuthStore();
    const userId = computed(() => authStore.userId);

    // State
    const profile = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const shoppingList = ref([]);

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
     * Fetches the profile of the current authenticated user
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const fetchProfile = async () => {
        if (!userId.value) {
            console.warn('No authenticated user found');
            return { success: false, error: 'No authenticated user' };
        }

        try {
            loading.value = true;
            error.value = null;

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId.value)
                .single();

            if (fetchError) throw fetchError;

            profile.value = data;
            
            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            profile.value = null;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    // Update current user profile
    // Things allowed to update:
    // username(Maybe not?), bio, display_name, is_private(Change this to to hide from other users)
    // Changing image is handled by uploadProfileImage
    // TODO: handle is_private
    /**
     * Updates the current user's profile information
     * @param {object} updates - The profile fields to update (username(Maybe not?), bio, display_name, is_private(Change this to to hide from other users))
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const updateProfile = async (updates) => {
        if (!userId.value) {
            return { success: false, error: 'No authenticated user' };
        }

        try {
            loading.value = true;
            error.value = null;

            const { data, error: updateError } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId.value)
                .select()
                .single();

            if (updateError) throw updateError;

            profile.value = data;
            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Uploads a new profile image for the current user
     * Deletes the old profile image and uploads the new one using Supabase storage
     * Also calls updateProfile to update image link (Do not need to handle this)
     * @param {File} file - The image file to upload
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const uploadProfileImage = async (file) => {
        if (!userId.value) {
            return { success: false, error: 'No authenticated user' };
        }

        try {
            validateImageFile(file);

            // Delete old profile image if exists
            if (profile.value?.avatar_url) {
                await deleteImage('avatars', profile.value.avatar_url);
            }

            // Upload new profile image
            const storagePath = `${userId.value}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await uploadImage('avatars', file, storagePath);
            if (uploadError) throw uploadError;

            // Update profile image url
            const result = await updateProfile({
                avatar_url: storagePath
            });

            return result;
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Deletes the user's profile image
     * Removes the image from storage and updates the profile
     * This will force it to use the OG Rick Astley image
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const deleteProfileImage = async () => {
        if (!userId.value) {
            return { success: false, error: 'No authenticated user' };
        }

        try {
            if (!profile.value?.avatar_url) return { success: true };

            // Delete from storage
            const { error: deleteError } = await deleteImage('avatars', profile.value.avatar_url);
            if (deleteError) throw deleteError;

            const result = await updateProfile({
                avatar_url: null
            });

            return result;
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetches the shopping list of the current authenticated user
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const fetchShoppingList = async () => {
        if (!userId.value) {
            console.warn('No authenticated user found');
            return { success: false, error: 'No authenticated user' };
        }

        try {
            loading.value = true;
            error.value = null;

            const { data, error: fetchError } = await supabase
                .from('shopping_list_items')
                .select(`
                    *,
                    food_ingredients:ingredient_id (
                        id,
                        name,
                        type,
                        nutrition
                    )
                `)
                .eq('user_id', userId.value)
                .order('is_purchased')
                .order('created_at');

            if (fetchError) throw fetchError;


            shoppingList.value = data;
            
            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            shoppingList.value = null;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Adds multiple ingredients to the user's shopping list.
     * If an ingredient exists, its quantity is increased.
     * @param {Array<Object>} ingredients - An array of objects, e.g., [{ ingredient_id: 1, quantity_g: 500 }]
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const addMultipleToShoppingList = async (ingredients) => {
        if (!userId.value) {
            return { success: false, error: 'No authenticated user' };
        }
        if (!ingredients || ingredients.length === 0) {
            return { success: true, data: [] }; // Nothing to add
        }

        try {
            loading.value = true;
            error.value = null;

            // Call the database function we created
            const { data, error: rpcError } = await supabase.rpc('add_to_shopping_list', {
                p_user_id: userId.value,
                p_items: ingredients
            });

            if (rpcError) throw rpcError;

            await fetchShoppingList();

            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Adds multiple ingredients to the user's shopping list.
     * If an ingredient exists, its quantity is increased.
     * @param {Array<Object>} ingredients - An array of recipe_ingredients
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const addUnformattedToShoppingList = async (unfJSON) => {
        const formatted = recipeJsonFormatter(unfJSON);
        return addMultipleToShoppingList(formatted);
    };

    const recipeJsonFormatter = (recipeJson) => {
        return recipeJson.map(r => ({ ingredient_id: r.food_ingredients.id, quantity_g: r.quantity_g}));
    };

    /**
     * Updates is_purchased for a shopping list item
     * @param {number} ingredientId
     * @param {boolean} isPurchased
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const updateShoppingListItem = async (ingredientId, isPurchased) => {
        if (!userId.value) {
            console.warn('No authenticated user found');
            return { success: false, error: 'No authenticated user' };
        }

        try {
            loading.value = true;
            error.value = null;

            const { data, error: updateError } = await supabase
                .from('shopping_list_items')
                .update({
                    is_purchased: isPurchased,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId.value)
                .eq('ingredient_id', ingredientId)
                .select();

            if (updateError) throw updateError;

            // Update local state
            if (Array.isArray(shoppingList.value)) {
                shoppingList.value = shoppingList.value.map((item) =>
                    item.ingredient_id === ingredientId ? { ...item, is_purchased: isPurchased } : item
                );
            }

            return { success: true, data };
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    /**
     * Deletes a shopping list item by ingredient_id
     * @param {number} ingredientId
     * @returns {Promise<{ success: boolean, error?: string }>}
     */
    const deleteShoppingListItem = async (ingredientId) => {
        if (!userId.value) {
            console.warn('No authenticated user found');
            return { success: false, error: 'No authenticated user' };
        }

        try {
            loading.value = true;
            error.value = null;

            const { error: deleteError } = await supabase
                .from('shopping_list_items')
                .delete()
                .eq('user_id', userId.value)
                .eq('ingredient_id', ingredientId);

            if (deleteError) throw deleteError;

            // Remove from local state
            if (Array.isArray(shoppingList.value)) {
            shoppingList.value = shoppingList.value.filter(
                (item) => item.ingredient_id !== ingredientId
            );
            }

            return { success: true };
        } catch (err) {
            error.value = err.message;
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    // Clear profile value and errors, call this when sign out
    // const clearProfile = () => {
    //     profile.value = null;
    //     error.value = null;
    // };

    return {
        // State
        profile,
        loading,
        error,
        shoppingList,

        // Getters
        hasProfile,
        username,
        avatarUrl,
        follows,
        followers,

        // Actions 
        fetchProfile,
        updateProfile,
        uploadProfileImage,
        deleteProfileImage,
        fetchShoppingList,
        addMultipleToShoppingList,
        addUnformattedToShoppingList,
        deleteShoppingListItem,
        updateShoppingListItem
    };
});