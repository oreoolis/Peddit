import { supabase } from "@/lib/supabaseClient"

export function useStorage() {
    const downloadImage = async (path) => {
        if (!path) return null;
        
        try {
        const { data, error } = await supabase.storage
            .from('avatars')
            .download(path);

        if (error) throw error;
        
        // Create object URL from blob
        return URL.createObjectURL(data);
        } catch (error) {
            console.error('Error downloading image:', error.message);
            return null;
        }
    }

    const uploadImage = async (file, path) => {
        try {
            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    const deleteImage = async (path) => {
        try {
            const { data, error } = await supabase.storage
                .from('avatars')
                .remove([path]);

        return { data, error }
        } catch (error) {
            return { data: null, error };
        }
    }

    return {
        downloadImage,
        uploadImage,
        deleteImage
    }
}