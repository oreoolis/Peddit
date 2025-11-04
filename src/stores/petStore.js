import { supabase } from '@/lib/supabaseClient';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { validateImageFile } from '@/utils/imageFileValidation';
import { useStorage } from '@/composables/useStorage';

const { uploadImage, downloadImage, deleteImage, getPublicImage } = useStorage();

/**
 * Pet store for managing user's pets
 * Handles pet CRUD operations and pet image management
*/
export const usePetStore = defineStore('pets', () => {
    // State
    const pets = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentPet = ref(null);

    // Getters
    const petCount = computed(() => pets.value.length);
    const petsByKind = computed(() => (kind) => pets.value.filter(pet => pet.kind === kind));

    // Primary Actions
    /**
     * Fetches all pets for a specific user
     * @param {string} userId - The ID of the user whose pets to fetch
     * @returns {Promise<void>}
    */
    const fetchPets = async (userId) => {
        try {
            loading.value = true;
            error.value = null;

            const { data, error: supabaseError } = await supabase
                .from('pets')
                .select('*')
                .eq('owner_id', userId)
                .order('created_at', { ascending: false });
            
            if (supabaseError) throw supabaseError;
            pets.value = data || [];
        } catch (err) {
            error.value = err.message;
            console.error('Error fetching pets:', err);
        } finally {
            loading.value = false;
        }
    }
    
    /**
     * Creates a new pet for the user
     * @param {string} userId - The ID of the user creating the pet
     * @param {object} petData - The pet data (name, kind, breed, birthdate, gender, weight_kg, body_condition_scale, neutered, photo_url, allergies)
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const createPet = async (userId, petData) => {
        try {
            loading.value = true;
            error.value = null;

            // Validate required fields
            if (!petData.name || !petData.kind) {
                throw new Error('Pet name and kind are required');
            }
            
            const { data, error: supabaseError } = await supabase
                .from('pets')
                .insert([{
                    owner_id: userId,
                    name: petData.name.trim(),
                    kind: petData.kind,
                    breed: petData.breed?.trim() || null,
                    birthdate: petData.birthdate || null,
                    gender: petData.gender || 'unknown',
                    weight_kg: petData.weight_kg || null,
                    body_condition_scale: petData.body_condition_scale || null,
                    neutered: petData.neutered || null,
                    photo_url: petData.photo_url || null,
                    allergies: petData.allergies || null,
                    preferred_recipe: petData.preferred_recipe || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (supabaseError) throw supabaseError;

            // Add to local state (at beginning for newest first)
            pets.value.unshift(data);
            return { success: true, data };

        } catch (err) {
            error.value = err.message;
            console.error('Error creating pet:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Updates an existing pet's information
     * @param {string} petId - The ID of the pet to update
     * @param {object} updates - The pet fields to update
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const updatePet = async (petId, updates) => {
        try {
            loading.value = true;
            error.value = null;

            const { data, error: supabaseError } = await supabase
                .from('pets')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', petId)
                .select()
                .single();

            if (supabaseError) throw supabaseError;

            // Update in local state
            const index = pets.value.findIndex(pet => pet.id === petId);
            if (index !== -1) {
                pets.value[index] = data;
            }

            // Update currentPet if it's the one being edited
            if (currentPet.value?.id === petId) {
                currentPet.value = data;
            }

            return { success: true, data };

        } catch (err) {
            error.value = err.message;
            console.error('Error updating pet:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Deletes a pet and its associated image
     * @param {string} petId - The ID of the pet to delete
     * @returns {Promise<{ success: boolean, error?: string }>}
    */
    const deletePet = async (petId) => {
        try {
            loading.value = true;
            error.value = null;

            // First, delete the pet's image if it exists
            const pet = pets.value.find(p => p.id === petId);
            if (pet?.photo_url) {
                await deletePetImage(petId);
            }

            const { error: supabaseError } = await supabase
                .from('pets')
                .delete()
                .eq('id', petId);

            if (supabaseError) throw supabaseError;

            // Remove from local state
            pets.value = pets.value.filter(pet => pet.id !== petId);

            // Clear currentPet if it's the one being deleted
            if (currentPet.value?.id === petId) {
                currentPet.value = null;
            }

            return { success: true };

        } catch (err) {
            error.value = err.message;
            console.error('Error deleting pet:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    // Image Actions
    /**
     * Uploads a new image for a pet
     * Deletes the old image if it exists and updates the pet's photo_url
     * @param {string} userId - The ID of the user uploading the image
     * @param {string} petId - The ID of the pet
     * @param {File} file - The image file to upload
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const uploadPetImage = async (userId, petId, file) => {
        try {
            loading.value = true;
            error.value = null;

            // Validate image file using the utility
            validateImageFile(file);

            // Delete old pet image if exists
            const pet = pets.value.find(p => p.id === petId);
            if (pet?.photo_url) {
                await deletePetImage(petId);
            }

            // Upload image using composable - organized by owner folder
            const storagePath = `${userId}/${petId}/${Date.now()}-${file.name}`;
            const { data: uploadData, error: uploadError } = await uploadImage('pet-images', file, storagePath);

            if (uploadError) throw uploadError;

            // Get public URL using composable
            const publicUrl = getPublicImage('pet-images', storagePath);

            // Update pet with the new image URL
            const result = await updatePet(petId, {
                photo_url: publicUrl
            });

            if (!result.success) throw new Error(result.error);

            return { success: true, data: result.data };

        } catch (err) {
            error.value = err.message;
            console.error('Error uploading pet image:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    }

    /**
     * Deletes a pet's image from storage and updates the pet record
     * @param {string} petId - The ID of the pet whose image to delete
     * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
    */
    const deletePetImage = async (petId) => {
        try {
            const pet = pets.value.find(p => p.id === petId);
            if (!pet?.photo_url) return { success: true };

            // Extract file path from URL
            const filePath = extractFilePathFromUrl(pet.photo_url);
            
            if (filePath) {
                // Delete image using composable
                const { error: deleteError } = await deleteImage('pet-images', filePath);
                if (deleteError) throw deleteError;
            }

            // Remove photo_url from pet
            const result = await updatePet(petId, {
                photo_url: null
            });

            if (!result.success) throw new Error(result.error);

            return { success: true, data: result.data };

        } catch (err) {
            error.value = err.message;
            console.error('Error deleting pet image:', err);
            return { success: false, error: err.message };
        }
    }

    /**
     * Downloads a pet's image from storage
     * @param {string} petId - The ID of the pet whose image to download
     * @returns {Promise<Blob|null>}
    */
    const downloadPetImage = async (petId) => {
        try {
            const pet = pets.value.find(p => p.id === petId);
            if (!pet?.photo_url) return null;

            // Extract file path from URL
            const filePath = extractFilePathFromUrl(pet.photo_url);
            if (!filePath) return null;

            // Download image using composable
            return await downloadImage('pet-images', filePath);
        } catch (err) {
            console.error('Error downloading pet image:', err);
            return null;
        }
    }

    /**
     * Helper function to extract storage file path from a Supabase URL
     * @param {string} url - The full Supabase storage URL
     * @returns {string|null} The extracted file path or null
    */
    const extractFilePathFromUrl = (url) => {
        if (!url) return null;
        const matches = url.match(/pet-images\/(.+)$/);
        return matches ? matches[1] : null;
    }

    const setCurrentPet = (pet) => {
        currentPet.value = pet;
    }

    const clearCurrentPet = () => {
        currentPet.value = null;
    }

    const getPetById = (petId) => {
        return pets.value.find(pet => pet.id === petId);
    }

    const clearError = () => {
        error.value = null;
    }

    const clearPets = () => {
        pets.value = [];
        currentPet.value = null;
    }

    /**
     * Fetch pets joined with their appropriate nutrition profile.
     * @param {string|undefined|null} ownerId Optional: filter to a specific owner UUID.
     * @returns {Promise<Array<{
     *   pet_id: string,
     *   owner_id: string,
     *   name: string,
     *   kind: string,
     *   birthdate: string | null,
     *   computed_life_stage: 'growth_and_reproduction'|'adult_maintenance',
     *   profile: { id: number|null, nutrition: object|null, source_document: string|null }
     * }>>}
     */
    const fetchPetsWithProfiles = async (ownerId = null) => {
        const { data, error } = await supabase.rpc('get_pets_with_profile', {
            p_owner_id: ownerId ?? null
        });

        if (error) {
            console.error('get_pets_with_profile error:', error);
            throw error;
        }

        return (data ?? []).map(row => ({
            pet_id: row.pet_id,
            owner_id: row.owner_id,
            name: row.name,
            kind: row.kind,
            birthdate: row.birthdate,
            computed_life_stage: row.computed_life_stage,
            profile: row.profile_id
            ? {
                id: row.profile_id,
                nutrition: row.nutrition,
                source_document: row.source_document
                }
            : { id: null, nutrition: null, source_document: null }
        }));
    }
    
    return {
        // State
        pets,
        loading,
        error,
        currentPet,
        
        // Getters
        petCount,
        petsByKind,
        
        // Actions
        fetchPets,
        createPet,
        updatePet,
        deletePet,
        setCurrentPet,
        clearCurrentPet,
        getPetById,
        clearError,
        clearPets,
        uploadPetImage,
        deletePetImage,
        downloadPetImage,
        fetchPetsWithProfiles
    }
})