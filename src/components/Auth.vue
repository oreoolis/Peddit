<script setup>
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);
const { signInWithEmail, signInWithOAuth } = authStore;
const email = ref('');
const rememberMe = ref(false);

const handleLogin = async () => {
    // options:{} can be added for extra supabase stuff
    const result = await signInWithEmail(email.value, {});

    if(result.success){
        alert('Check your email for the login link!');
        email.value = '';
    }
    else{
        alert(result.error.message);
    }
};

const handleOAuthLogin = async () => {
    const result = await signInWithOAuth();

    if(!result.success){
        alert(result.error.message);
    }
}

const handleForgetPW = async () => {
    alert('Coming soon!');
}

</script>

<template>
    <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100 mt-4">
            <div class="col-12 col-md-6 col-lg-5 col-xl-4">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <h2 class="card-title text-center mb-4 brandFont">Peddit</h2>
                        <img src="../assets/Main_Logo.png" class="img-fluid d-block mx-auto w-50" alt="Description">
                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label for="email" class="form-label mb-1 ms-1">Login with email</label>
                                <input type="email" class="form-control" id="email" v-model="email"
                                    placeholder="Enter your email" required />
                            </div>

                            <!-- Handle with supabase.auth.setSession(persistSession: true) -->
                            <!-- supabase.auth.removeSession() -->
                            <div class="mb-3 form-check d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-1" id="remember" v-model="rememberMe" />
                                <label class="form-check-label" for="remember">
                                    Remember me
                                </label>
                            </div>

                            <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
                                {{ loading ? "Loading..." : "Send magic link" }}
                            </button>
                        </form>

                        <div class="position-relative text-center">
                            <hr class="my-4">
                            <span class="hror position-absolute top-50 start-50 translate-middle px-2 text-muted">OR</span>
                        </div>

                        <!-- TODO: implement OAuth -->
                        <button @click="handleOAuthLogin"
                            class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
                            <img src="https://www.google.com/favicon.ico" alt="Google" class="me-2"
                                style="width: 18px; height: 18px;" />
                            Continue with Google
                        </button>

                        <div class="text-center mt-3">
                            <!-- TODO: implement forget password stuff if doing normal login or send email by username -->
                            <a @click="handleForgetPW" class="text-decoration-none small">Forgot account?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container{
        padding-bottom: 110px;
    }
    .hror {
        background-color: white;
    }
</style>