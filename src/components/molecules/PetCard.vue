<script setup>
import PetInfoModal from '@/components/PetViewComponents/PetInfoModal.vue';
import { ref, defineProps } from 'vue';
import Button from '../atoms/button.vue';
const props = defineProps(['name', 'gender', 'breed', 'birthday', 'weight', 'allergies', 'photo_url'])
// TODO: calculation for status, not sure what we can do for this
const status = "Good";
const showPetInfo = ref(false);
const openPetInfo = () => {
    showPetInfo.value = true;
}

</script>
<template>
    <div class="pet-card card overflow-hidden shadow p-3 mb-5 bg-body-tertiary rounded-4 h-100 d-flex flex-column position-relative
    w-100">
        <div class="card-header text-center bg-transparent border-0">
            <div class="row d-fill justify-content-between">
                <div class="col-9 my-auto ">
                    <h4 class="bodyFont fw-bold text-start">{{ name }}</h4>
                </div>
                <div class="col-3  text-end">
                    <!-- <<h2 class="bodyFont fw-bold">{{gender}}</h2>> -->
                    <div v-if="gender == 'male'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="blue"
                            class="bi bi-gender-male" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
                        </svg>
                    </div>
                    <div v-if="gender == 'female'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="red"
                            class="bi bi-gender-female" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5" />
                        </svg>
                    </div>
                    <div v-if="gender == 'unknown'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 64 64" 
                            fill="purple">
                            <g fill-rule="evenodd">
                            <path d="M30.2 2.1Q12.8 3.3 12 21.3h11.7c.1-4.1 2.5-7.2 6.7-7.7s8.2.6 9.4 3.4c1.3 3.1-1.6 6.7-3 8.2-2.6 2.8-6.8 4.9-8.9 7.9s-2.5 6.9-2.7 11.7h10.3c.1-3.1.3-6 1.7-7.9 2.3-3.1 5.7-4.5 8.5-7 2.7-2.3 5.6-5.1 6-9.5 1.6-12.9-9-19.1-21.5-18.3" />
                            <ellipse cx="30.515" cy="55.567" rx="6.532" ry="6.433"/></g></svg>
                    </div>
                </div>
            </div>
        </div>
         <div class="ratio mb-3" style="--bs-aspect-ratio: 75%;">
            <img :src="photo_url" class="w-100 h-100 rounded-5 object-fit-cover" alt="pet photo">
        </div>
        <div class="ratio mb-3 image-area">
            <img :src="photo_url" class="w-100 h-100 rounded-5 object-fit-cover" alt="pet photo">
        </div>

        <div class="card-body d-flex flex-column ">
            <div class="card-text py-1">
                <section class="pet-info headingFont ">
                    <h4 class="fw-bold d-flex">Status: <i class="bi bi-emoji-laughing-fill success mx-2"></i></h4>
                    <div class="d-fill">
                        <div class="d-flex align-items-center gap-2">
                            <h4 class="mb-0 fw-bold">Score:</h4>
                            <div class="flex-grow-1">
                                <div class="progress w-100" role="progressbar" aria-label="Score" aria-valuemin="0" aria-valuemax="100">
                                    <div class="progress-bar bg-success" style="width: 75%" aria-valuenow="75"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4 class="fw-bold d-flex align-items-center">Curent Diet:
                        <Button class="h-75 mx-1" label="Salmon"></Button>
                    </h4>
                </section>
            </div>
            <div class="summary-container container-fluid position-absolute bottom-0 end-0 px-3 py-3 bg-primary"
                @click="openPetInfo">
                <div class="text-center text-light fw-bold h5 bodyFont">
                    Summary
                </div>
            </div>
        </div>       
    </div>
    <!-- to pass in props here -->
    <PetInfoModal v-model:show="showPetInfo"
        :name="name"
        :gender="gender"
        :breed="breed"
        :birthday="birthday"
        :weight="weight"
        :allergies="allergies"
        :photo_url="photo_url"
     />

</template>
<style>
.pet-card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.pet-card:hover {
    transform: scale(1.03);
    /* Zooms in the card by 5% */
    box-shadow: 0 8px 16px rgba(75, 75, 75, 0.2);
    /* Adds a subtle shadow */
    z-index: 1;
}

.pet-info {
    display: block;
}

.meal-tooltip {
    display: inline-block;
    background-color: #237b9f;
    border-radius: 10px;
    color: white;
    padding: 5px 5px 5px 5px;
    font-weight: 100;
}

.summary-container {
    cursor: pointer;
}

.summary-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #3dacd84f;
    opacity: 0;
    transform: scale(0);
    transition: all 0.4s;
    z-index: 0;
}

.summary-container:hover::before {
    opacity: 1;
    transform: scale(1);
}
</style>