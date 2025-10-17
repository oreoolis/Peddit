import { supabase } from '@/lib/supabaseClient';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { validateImageFile } from '@/utils/imageFileValidation';
import { useStorage } from '@/composables/useStorage';

const { uploadImage, downloadImage, deleteImage, getPublicImage } = useStorage();

export const usePetStore = defineStore('pets', () => {
    // State
    const pets = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentPet = ref(null);

    // Getters
    const petCount = computed(() => pets.value.length);
    const petsByKind = computed(() => (kind) => pets.value.filter(pet => pet.kind === kind));
    // const petImages = computed(() => {
    //     let data = {};
    //     for (const pet of pets.value) {
    //         data[pet.value.id] = getPublicImage('pet-images', pet.value.photo_url)
    //     }
    //     return data;
    // });

    // Primary Actions
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
    
    const createPet = async (userId, petData) => {
        try {
            loading.value = true;
            error.value = null;

            // Validate required fields
            if (!petData.name || !petData.kind) {
                throw new Error('Pet name and kind are required');
            }
            console.log(petData);
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
    const uploadPetImage = async (userId, petId, file) => {
        // try {
        //     loading.value = true;
        //     error.value = null;

        //     const filePath = `pets/${petId}/${Date.now()}-${file.name}`;
            
        //     const { data: uploadData, error: uploadError } = await supabase.storage
        //         .from('pet-images')  // You'll need to create this bucket
        //         .upload(filePath, file, {
        //             cacheControl: '3600',
        //             upsert: true
        //         });

        //     if (uploadError) throw uploadError;

        //     // Get public URL for the image
        //     const { data: urlData } = await supabase.storage
        //         .from('pet-images')
        //         .getPublicUrl(filePath);

        //     // Update pet with the new image URL
        //     const { data: petData, error: updateError } = await supabase
        //         .from('pets')
        //         .update({
        //             photo_url: urlData.publicUrl,
        //             updated_at: new Date().toISOString()
        //         })
        //         .eq('id', petId)
        //         .select()
        //         .single();

        //     if (updateError) throw updateError;

        //     // Update local state
        //     const index = pets.value.findIndex(pet => pet.id === petId);
        //     if (index !== -1) {
        //         pets.value[index] = petData;
        //     }

        //     return { success: true, data: petData };

        // } catch (err) {
        //     error.value = err.message;
        //     console.error('Error uploading pet image:', err);
        //     return { success: false, error: err.message };
        // } finally {
        //     loading.value = false;
        // }
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

    const deletePetImage = async (petId) => {
        // try {
        //     const pet = pets.value.find(p => p.id === petId);
        //     if (!pet?.photo_url) return { success: true };

        //     // Extract file path from URL or store it separately
        //     const filePath = extractFilePathFromUrl(pet.photo_url);
            
        //     if (filePath) {
        //         const { error: deleteError } = await supabase.storage
        //             .from('pet-images')
        //             .remove([filePath]);

        //         if (deleteError) throw deleteError;
        //     }

        //     // Remove photo_url from pet
        //     const { data: petData, error: updateError } = await supabase
        //         .from('pets')
        //         .update({
        //             photo_url: null,
        //             updated_at: new Date().toISOString()
        //         })
        //         .eq('id', petId)
        //         .select()
        //         .single();

        //     if (updateError) throw updateError;

        //     // Update local state
        //     const index = pets.value.findIndex(pet => pet.id === petId);
        //     if (index !== -1) {
        //         pets.value[index] = petData;
        //     }

        //     return { success: true, data: petData };

        // } catch (err) {
        //     error.value = err.message;
        //     return { success: false, error: err.message };
        // }
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

    // Helper function to extract file path from URL
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
    
    return {
        // State
        pets,
        loading,
        error,
        currentPet,
        
        // Getters
        petCount,
        petsByKind,
        petImages,
        
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
        downloadPetImage
    }
})