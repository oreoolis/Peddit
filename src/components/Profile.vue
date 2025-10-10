<script setup>
import PetProfileCard from './PetProfileCard.vue';
import goldenImage from '../assets/golden.jpg'
import persianImage from '../assets/persian.jpg';
import ragdollImage from '../assets/ragdoll.jpg';
import { supabase } from '@/lib/supabaseClient';
import router from '@/router';

const signOut = async () => {
    try {
        const {error} = await supabase.auth.signOut();
        if (error) throw error;

        // Redirect to login after loggin out
        router.push('/login');
    } catch (error) {
        // Error logging out
    }
};
</script>

<template>
    <div class="container">
        <!-- Profile -->
        <div class="row justify-content-center pb-4">
            <div class="col-12 text-center position-relative">
                <div class="position-relative d-inline-block mb-1">
                    <img 
                        class="rounded-circle profile-image"
                        src="../assets/person.jpg" 
                        alt="Profile Image"
                    >
                    <button class="btn btn-light position-absolute bottom-0 end-0 settings-btn">
                        <img 
                            class="gear-icon"
                            src="../assets/gear.png" 
                            alt="Settings"
                        >
                    </button>
                </div>
                <p class="">@bernardcks</p>
            </div>
        </div>
        <!-- Follow Counts -->
        <div class="row justify-content-center mb-4">
            <div class="col-3 text-center">
                <h4>56.5k</h4>
                <h4>Following</h4>
            </div>
            <div class="col-3 text-center">
                <h4>10.5k</h4>
                <h4>Followers</h4>
            </div>
        </div>
        <!-- Profile Buttons -->
        <div class="row mb-4">
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-secondary">Edit profile</button>
                <button @click="signOut" type="button" class="btn btn-danger">Logout</button>
            </div>
        </div>
        <!-- Pet display -->
        <!-- Change to view component, vue-for to loop through all pets -->
        <div class="row justify-content-between">
            <div class="col-12 text-center">
                <h2>Pets</h2>
            </div>
            <div class="col-4 mb-4">
                <PetProfileCard 
                    pet-name="Alberto"
                    pet-breed="Golden Retriver"
                    :pet-image="goldenImage"
                />
            </div>
            <div class="col-4 mb-4">
                <PetProfileCard 
                    pet-name="Alfredo"
                    pet-breed="Golden Retriver"
                    :pet-image="goldenImage"
                />
            </div>
            <div class="col-4 mb-4">
                <PetProfileCard 
                    pet-name="Butter"
                    pet-breed="Persian"
                    :pet-image="persianImage"
                />
            </div>
            <div class="col-4 mb-4">
                <PetProfileCard 
                    pet-name="Toastie"
                    pet-breed="Ragdoll"
                    :pet-image="ragdollImage"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
    .profile-image {
        border: 1px solid white;
        width: 120px;
        height: 120px;
        object-fit: cover;
    }

    .settings-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        background-color: rgb(0, 0, 0);
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(10%, 10%);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .gear-icon {
        filter: brightness(0) invert(1) brightness(1);
        width: 20px;
        height: 20px;
    }
</style>