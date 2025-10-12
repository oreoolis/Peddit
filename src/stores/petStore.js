import { supabase } from '@/lib/supabaseClient';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePetStore = defineStore('pets', () => {
    // State
    const pets = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentPet = ref(null);

    // Getters
    const petCount = computed(() => pets.value.length);
    const petsByKind = computed(() => (kind) => pets.value.filter(pet => pet.kind === kind));

    // Actions
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
            debugger;

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
        
        // Actions
        fetchPets,
        createPet,
        updatePet,
        deletePet,
        setCurrentPet,
        clearCurrentPet,
        getPetById,
        clearError,
        clearPets
    }
})