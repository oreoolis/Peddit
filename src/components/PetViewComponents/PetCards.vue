<script setup>
import PetInfoModal from '@/components/PetViewComponents/PetInfoModal.vue';
import { ref } from 'vue';

const showPetInfo = ref(false);
const openPetInfo = () => {
    showPetInfo.value = true;
}

</script>
<template>
    <div class="pet-card card overflow-hidden shadow p-3 mb-5 bg-body-tertiary rounded-4" style="width: 40rem; height: 40rem; ">
        <div class="card-header text-center">
            <div class="row d-flex justify-content-between">
                <div class="col-lg-6">
                    <h2 class="bodyFont fw-bold">Cat 1</h2>
                </div>
                <div class="col-lg-6">
                    <h2 class="bodyFont fw-bold">Male</h2>
                </div>
            </div>
        </div>
        <img src="../../assets/ragdoll.jpg" style="height: 60%; object-fit:cover;"
            class="card-img-top rounded-5 px-3 py-3" alt="...">
        <div class="card-body">
            <div class="card-text py-3">
                <section class="pet-info headingFont">
                    <h5 class="fw-bold">Status: Good</h5>
                    <h5 class="mb-0 d-inline-block fw-bold">Score:</h5>
                    <div class="d-inline-block">
                        <div class="progress ms-2" role="progressbar" aria-label="Success example" aria-valuenow="25"
                            aria-valuemin="0" aria-valuemax="100" style="width: 150px;">
                            <div class="progress-bar bg-success" style="width: 75%"></div>
                        </div>
                    </div>
                    <h5 class="fw-bold">Meal:
                        <p class="meal-tooltip bodyFont">Salmon</p>
                    </h5>
                </section>
            </div>
            <div
                class="summary-container container-fluid position-absolute bottom-0 start-0 end-0 px-3 py-3 bg-primary"
                @click = "openPetInfo">
                <div class="text-center text-light fw-bold h5 bodyFont">
                    Summary
                </div>
            </div>
        </div>
    </div>
    <!-- to pass in props here -->
    <PetInfoModal v-model:show="showPetInfo" />

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
    border-radius: 8px;
    transform: scale(0);
    transition: all 0.4s;
    z-index: 0;
}

.summary-container:hover::before {
    opacity: 1;
    transform: scale(1);
}
</style>