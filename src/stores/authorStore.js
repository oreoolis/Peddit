import { supabase } from "@/lib/supabaseClient";
import { defineStore } from "pinia";

export const useAuthorStore = defineStore('author', () => {
    // State
    const authors = ref({});
    const loading = ref(true);

    // Getters
    

    // TODO: Actions
    const fetchAuthors = async () => {
        try {
            loading.value = true;
            error.value = null;

            authors.value = [];

            const {} = await supabase
                .from('profiles')
                .select('*');

        } catch (error) {
            
        }
    }

    return {
        // State

        // Getters

        // Actions
    };
});