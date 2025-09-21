<script setup>
    import { supabase } from '@/lib/supabaseClient';
    import { onMounted, ref, toRefs } from 'vue';

    import Avatar from './Avatar.vue';

    const props = defineProps(['session']);
    const { session } = toRefs(props)

    const loading = ref(true);
    const username = ref('');
    const website = ref('');
    const avatar_url = ref('');

    onMounted(() => {
        getProfile();
    });

    async function getProfile() {
        try {
            loading.value = true;
            const { user } = session.value;

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single();

            if (error && status !== 406) throw error;

            if (data){
                username.value = data.username;
                website.value = data.website;
                avatar_url.value = data.avatar_url;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            loading.value = false;
        }
    }

    async function updateProfile() {
        try {
            loading.value = true
            const { user } = session.value;

            const updates = {
                id: user.id,
                username: username.value,
                website: website.value,
                avatar_url: avatar_url.value,
                updated_at: new Date(),
            }

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if(error) throw error;
        } catch (error) {
            alert(error.message);
        } finally {
            loading.value = false;
        }
    }

    async function signOut(){
        try {
            loading.value = true;
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            alert(error.nesaage);
        } finally {
            loading.value = false;
        }
    }
</script>

<template>
    <form class="p-3 border rounded container" @submit.prevent="updateProfile">
        <!-- Email -->
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
                id="email"
                type="text" 
                class="form-control"
                :value="session.user.email"
                disabled
            />
        </div>

        <!-- Username -->
        <div class="mb-3">
            <label for="username" class="form-label">Name</label>
            <input 
                id="username"
                type="text" 
                class="form-control"
                v-model="username"
            />
        </div>

        <!-- Website -->
        <div class="mb-3">
            <label for="website" class="form-label">Website</label>
            <input 
                id="website"
                type="text" 
                class="form-control"
                v-model="website"
            />
        </div>

        <!-- Upload avatar -->
        <Avatar  
            v-model:path="avatar_url"
            @upload ="updateProfile"
            size="10"
        />

        <!-- Update button -->
        <div class="d-grid mb-2">
            <button 
                type="submit"
                class="btn btn-secondary"
                :disabled="loading"
            >
                {{ loading ? "Loading..." : "Update" }}
            </button>
        </div>

        <!-- Sign out button -->
        <div class="d-grid">
            <button 
                type="submit"
                class="btn btn-outline-secondary"
                @click="signOut"
                :disabled="loading"
            >
                Sign Out
            </button>
        </div>
    </form>
</template>

<style>

</style>