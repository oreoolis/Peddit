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
    const dogs = computed(() => pets.value.filter(pet => pet.kind === 'dog'));
    const cats = computed(() => pets.value.filter(pet => pet.kind === 'cat'));

    // Actions
    const fetchPets = async (userId) => {
        try {
            loading.value = true;
            const { data, error: supabaseError } = await supabase
                .from('pets')
                .select('*')
                .eq('owner_id', userId);
            
            if (supabaseError) throw supabaseError;
            pets.value = data;
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }
    
    const createPet = async (petData) => {
        // TODO: add pets
    }
    
    return {
        // State
        pets,
        loading,
        error,
        currentPet,
        
        // Getters
        petCount,
        dogs,
        cats,
        
        // Actions
        fetchPets,
        createPet,
    }
})