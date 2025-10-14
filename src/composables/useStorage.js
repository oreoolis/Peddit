import { supabase } from "@/lib/supabaseClient"

export function useStorage() {
    // For getting imagae from private buckets
    const downloadImage = async (bucket, path) => {
        if (!path || !bucket) return null;
        
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .download(path);

            if (error) throw error;
            
            // Create object URL from blob
            return URL.createObjectURL(data);
        } catch (error) {
            console.error(`Error downloading image from ${bucket}:`, error.message);
            return null;
        }
    }

    // For getting image from public buckets
    const getPublicUrl = (bucket, path) => {
        if (!path) return null
        const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)
        return data.publicUrl
    }

    const uploadImage = async (bucket, file, path) => {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    const deleteImage = async (bucket, path) => {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .remove([path]);

        return { data, error }
        } catch (error) {
            return { data: null, error };
        }
    }

    return {
        downloadImage,
        getPublicUrl,
        uploadImage,
        deleteImage
    }
}