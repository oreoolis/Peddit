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
    const getPublicImage = (bucket, path) => {
        if (!path) return null;
        const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
        return data.publicUrl;
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

    // Upload multiple images to a bucket
    const uploadMultipleImages = async (bucket, files, prefix = "") => {
        if (!bucket || !files || files.length === 0) return [];

        const base = prefix
            ? String(prefix).replace(/^\/+/, "").replace(/\/+$/, "") + "/"
            : ""

        const now = Date.now();
        const uploads = Array.from(files).map((file, idx) => {
            const safeName = String(file.name)
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^A-Za-z0-9._-]/g, "-")
            const path = `${base}${now}-${idx}-${safeName}`
            return supabase.storage
                .from(bucket)
                .upload(path, file, {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: file.type || undefined
                })
                .then(({ data, error }) => ({ path, data, error }));
        })

        const results = await Promise.all(uploads);
        return results;
    }

    // List all files in a bucket (optionally within a prefix/folder)
    const listAllFiles = async (bucket, prefix = "") => {
        if (!bucket) return [];

        const base = prefix
            ? String(prefix).replace(/^\/+/, "").replace(/\/+$/, "")
            : "";

        const limit = 100;
        let offset = 0;
        let all = [];
        for (;;) {
            const { data, error } = await supabase.storage
                .from(bucket)
                .list(base || undefined, {
                    limit,
                    offset,
                    sortBy: { column: "name", order: "asc" }
                });

            if (error) throw error;
            all = all.concat(data || []);
            if (!data || data.length < limit) break;
            offset += limit;
        }

        // Attach full path for convenience
        return all.map((f) => ({
            ...f,
            path: base ? `${base}/${f.name}` : f.name
        }))
    }

    // Download all files (as Blobs) under an optional prefix
    const downloadAllFiles = async (bucket, prefix = "") => {
        if (!bucket) return [];

        const files = await listAllFiles(bucket, prefix);
        const downloads = files.map(async (f) => {
            const { data, error } = await supabase.storage
                .from(bucket)
                .download(f.path)
            if (error) return { path: f.path, name: f.name, error };
            const objectUrl = URL.createObjectURL(data);
            return { path: f.path, name: f.name, blob: data, objectUrl };
        })

        return Promise.all(downloads);
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
        getPublicImage,
        uploadImage,
        uploadMultipleImages,
        listAllFiles,
        downloadAllFiles,
        deleteImage
    }
}
