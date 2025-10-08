<script setup lang="ts">
// TODO: link Pet here
// import Pet from '../components/Pet.vue';
</script>

<template>
    <div class="pet-view container-fluid">
        <div class="pet-card-container">
            <h1 class="text-center px-5 py-5 headingFont fw-bold">My Pets</h1>
            <!-- To do v-if if there is no pets rendered from DB, else show current screen -->
            <div class="row justify-content-center g-3">
                <div class="col-lg-5 d-flex justify-content-center">
                    <div class="card overflow-hidden shadow p-3 mb-5 bg-body-tertiary rounded"
                        style="width: 40rem; height: 40rem; ">
                        <div class="card-header text-center">
                            <div class="row justify-around">
                                <div class="col-lg-6">
                                    <h3 class="bodyFont">Cat 1</h3>
                                </div>
                                <div class="col-lg-6">
                                    <h3 class="bodyFont">Male</h3>
                                </div>
                            </div>
                        </div>
                        <img src="../assets/ragdoll.jpg" style="height: 60%; object-fit:cover;"
                            class="card-img-top rounded-5 px-3 py-3" alt="...">
                        <div class="card-body">
                            <div class="card-text">
                                <section class="pet-info headingFont">
                                    <h5 class="fw-bold">Status: Good</h5>
                                    <h5 class="mb-0 d-inline-block fw-bold">Score:</h5>
                                    <div class="d-inline-block">
                                        <div class="progress ms-2" role="progressbar" aria-label="Success example"
                                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
                                            style="width: 150px;">
                                            <div class="progress-bar bg-success" style="width: 75%"></div>
                                        </div>
                                    </div>
                                    <h5 class="fw-bold">Meal:
                                        <p class="meal-tooltip bodyFont">Salmon</p>
                                    </h5>
                                </section>
                            </div>
                            <!-- size: none -->
                            <div class=" containertext-end px-3 py-3">
                                <button type="button" class="btn btn-primary bg-primary w-100 bodyFont">
                                    Summary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5 d-flex justify-content-center">
                    <div class="card overflow-hidden shadow p-3 mb-5 bg-body-tertiary rounded"
                        style="width: 40rem; height: 40rem; ">
                        <div class="card-header text-center">
                            <div class="row justify-around">
                                <div class="col-lg-6">
                                    <h3 class="bodyFont">Cat 1</h3>
                                </div>
                                <div class="col-lg-6">
                                    <h3 class="bodyFont">Male</h3>
                                </div>
                            </div>
                        </div>
                        <img src="../assets/ragdoll.jpg" style="height: 60%; object-fit:cover;"
                            class="card-img-top rounded-5 px-3 py-3" alt="...">
                        <div class="card-body">
                            <div class="card-text">
                                <section class="pet-info headingFont">
                                    <h5 class="fw-bold">Status: Good</h5>
                                    <h5 class="mb-0 d-inline-block fw-bold">Score:</h5>
                                    <div class="d-inline-block">
                                        <div class="progress ms-2" role="progressbar" aria-label="Success example"
                                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
                                            style="width: 150px;">
                                            <div class="progress-bar bg-success" style="width: 75%"></div>
                                        </div>
                                    </div>
                                    <h5 class="fw-bold">Meal:
                                        <p class="meal-tooltip bodyFont">Salmon</p>
                                    </h5>
                                </section>
                            </div>
                            <!-- size: none -->
                            <div class=" containertext-end px-3 py-3">
                                <button type="button" class="btn btn-primary bg-primary w-100 bodyFont">
                                    Summary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container px-3 py-3 text-end">
            <button type="button" class="btn btn-primary bg-primary w-30 bodyFont">
                Add Pet
            </button>
        </div>

        <div class="grocery-checklist">
            <h1 class="text-center px-5 py-5 headingFont fw-bold">Weekly Grocery Checklist</h1>
            <div class="container-fluid bg-info bodyFont fw-bold">
                <div class="row px-3 py-3 justify-evenly ">
                    <div class="col-lg-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Default checkbox
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Default checkbox
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Default checkbox
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row px-3 py-3 justify-evenly">
                    <div class="col-lg-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Default checkbox
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Default checkbox
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Default checkbox
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row px-3 py-3 justify-evenly">
                    <div class="col-lg-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Default checkbox
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Default checkbox
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Default checkbox
                            </label>
                        </div>
                    </div>
                </div>
                <div class="text-end px-1 py-1">
                    <!-- size: none -->
                    <button type="button" class="btn btn-warning ">
                        Edit
                    </button>
                </div>
            </div>
        </div>

        <div class="meal-plans-container">
            <h1 class="text-center px-5 py-5 fw-bold headingFont">My Meal Plans</h1>
            <div class="row justify-content-center px-5 py-5 g-1">
                <div class="col-lg-3 d-flex justify-content-center">
                    <div class="card bg-primary" style="width: 18rem;">
                        <img src="../assets/Sprite/Food/Set3-Meat/11.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <div class="card-text text-center">
                                <h3 class = "headingFont text-light">Recipe</h3>
                                <p class = "bodyFont text-light">Breed type</p>
                                <div class="container-fluid px-3 py-3">
                                    <button type="button" class="btn btn-light btn-lg w-100">
                                        View Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 d-flex justify-content-center">
                    <div class="card bg-primary" style="width: 18rem;">
                        <img src="../assets/Sprite/Food/Set3-Meat/11.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <div class="card-text text-center">
                                <h3 class = "headingFont text-light">Recipe</h3>
                                <p class = "bodyFont text-light">Breed type</p>
                                <div class="container-fluid px-3 py-3">
                                    <button type="button" class="btn btn-light btn-lg w-100">
                                        View Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 d-flex justify-content-center">
                    <div class="card bg-primary" style="width: 18rem;">
                        <img src="../assets/Sprite/Food/Set3-Meat/11.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <div class="card-text text-center">
                                <h3 class = "headingFont text-light">Recipe</h3>
                                <p class = "bodyFont text-light">Breed type</p>
                                <div class="container-fluid px-3 py-3">
                                    <button type="button" class="btn btn-light btn-lg w-100">
                                        View Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 d-flex justify-content-center">
                    <div class="card bg-light" style="width: 18rem;">
                        <div class="card-body">
                            <div class="card-text text-center">
                                <h1>+</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
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
</style>