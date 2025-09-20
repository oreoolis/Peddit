<script setup>
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';

const loading = ref(false);
const email = ref('');

const handleLogin = async () => {
    try {
        loading.value = true;
        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
        })
        if(error) throw error;
        alert('Check your email for the login link!');
    } catch (error) {
        if(error instanceof Error){
            alert(error.message);
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <form class="row justify-content-center" @submit.prevent="handleLogin">
        <div class="col-md-6">
            <h1 class="h3 mb-3">Peddit Login</h1>
            <p class="text-muted">Sign in via magic link using your email below</p>

            <div class="mb-3">
                <input 
                    type="email" 
                    class="form-control"
                    placeholder="Enter your email here"
                    v-model="email"
                    required
                />
            </div>

            <div class="d-grid">
                <button 
                    type="submit"
                    class="btn btn-dark"
                    :disabled="loading"
                >
                    {{ loading ? "Loading..." : "Send magic link" }}
                </button>
            </div>
        </div>
    </form>
</template>

<style lang="scss" scoped>

</style>