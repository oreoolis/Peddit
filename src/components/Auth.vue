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
        if (error) throw error;
        alert('Check your email for the login link!');
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-md-5 col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <h2 class="card-title text-center mb-4">Peddit</h2>
                        <img 
                            src="../assets/logo.svg" 
                            class="img-fluid float-start" 
                            alt="Description"
                        >
                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label for="email" class="form-label">Login with email</label>
                                <input 
                                    type="email" 
                                    class="form-control" 
                                    id="email"
                                    v-model="email"
                                    placeholder="Enter your email" required />
                            </div>

                            <!-- Handle with supabase.auth.setSession(persistSession: true) -->
                            <!-- supabase.auth.removeSession() -->
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="remember" v-model="rememberMe" />
                                <label class="form-check-label" for="remember">
                                    Remember me
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                class="btn btn-primary w-100 mb-3" 
                                :disabled="loading"
                            >
                                {{ loading ? "Loading..." : "Send magic link" }}
                            </button>
                        </form>

                        <div class="position-relative text-center">
                            <hr class="my-4">
                            <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">OR</span>
                        </div>

                        <button @click="handleGoogleLogin"
                            class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
                            <img src="https://www.google.com/favicon.ico" alt="Google" class="me-2"
                                style="width: 18px; height: 18px;" />
                            Continue with Google
                        </button>

                        <div class="text-center mt-3">
                            <!-- TODO: implement forget password stuff if doing normal login -->
                            <a href="#" class="text-decoration-none small">Forgot password?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- <template>
    <form class="row justify-content-center bg-secondary p-2 border rounded-2" @submit.prevent="handleLogin">
        <div class="col-md-6">
            <h1 class="h3 mb-3">Peddit Login</h1>
            <hr>
            <img
                src="../assets/logo.svg"
                class="img-fluid rounded-top"
                alt=""
            />
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
</template> -->

<style lang="scss" scoped></style>