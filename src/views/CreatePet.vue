<script>
</script>

<template>
    <div class="container-fluid">
        <form>
            <div class="pet-selector px-5 py-5">
                <h1 class="headingFont display-3 text-center">Create Your Pet</h1>
                <div class="row justify-content-center g-3 py-5">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <div class="dog-breed-card">
                            <p class="pet-title brandFont text-light display-1">Dog</p>
                        </div>
                        <!-- <div class="card text-bg-light text-light">
                        <img src="../assets/Pixel Art/dog (3).png" class="card-img" alt="...">
                        <div class="card-img-overlay">
                            <h1 class="card-title text-center brandFont display-1">Dog</h1>
                        </div>
                    </div> -->
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-4">
                        <div class="cat-breed-card brandFont text-light display-1">
                            <p class="pet-title brandFont text-light display-1">Cat</p>
                        </div>
                        <!-- <div class="card text-bg-light text-light">
                        <img class="card-img-top" src="../assets/Pixel Art/cat (5).png" alt="Title" />
                        <div class="card-img-overlay">
                            <h1 class="card-title text-center brandFont display-1">Cat</h1>
                        </div>
                    </div> -->
                    </div>
                </div>
            </div>


            <div class="input-forms container-fluid px-3 py-3">
                <div class="mb-3 input-group-lg">
                    <label for="" class="form-label headingFont fw-bold h5">Pet Name</label>
                    <input type="text" name="" id="" class="form-control input-lg" placeholder=""
                        aria-describedby="helpId" />
                </div>
                <div class="mb-3 input-group-lg">
                    <label for="" class="form-label headingFont fw-bold h5">Birthday</label>
                    <input type="text" name="" id="" class="form-control" placeholder="" aria-describedby="helpId" />
                </div>
                <div class="mb-3 input-group-lg">
                    <label for="" class="form-label headingFont fw-bold h5">Breed</label>
                    <input type="text" name="" id="" class="form-control" placeholder="" aria-describedby="helpId" />
                </div>
                <div class="mb-3 input-group-lg">
                    <label for="" class="form-label headingFont fw-bold h5">Allergies (Optional)</label>
                    <input type="text" name="" id="" class="form-control" placeholder="" aria-describedby="helpId" />
                </div>
            </div>

            <div class="meal-plan container-fluid px-3">
                <div class="row justify-content-between">
                    <div class="col-lg-8 col-sm-4">
                        <h3 class="headingFont fw-bold">Meal Plan</h3>
                    </div>
                    <div class="col-lg-2 col-sm-2">
                        <!-- size: btn-lg -->
                        <button type="button" class="btn btn-secondary w-75 rounded-5 bg-grey headingFont">
                            Auto Recommend
                        </button>
                    </div>
                </div>
            </div>

            <div class="meal-plan-cards container-fluid">
                <div class="row justify-content-center px-5 py-5 g-1">
                    <div class="col-lg-3 d-flex justify-content-center">
                        <div class="card bg-primary" style="width: 18rem;">
                            <img src="../assets/Sprite/Food/Set3-Meat/11.png" class="card-img-top" alt="...">
                            <div class="card-body">
                                <div class="card-text text-center">
                                    <h3 class="headingFont text-light">Recipe</h3>
                                    <p class="bodyFont text-light">Breed type</p>
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
                                    <h3 class="headingFont text-light">Recipe</h3>
                                    <p class="bodyFont text-light">Breed type</p>
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
                                    <h3 class="headingFont text-light">Recipe</h3>
                                    <p class="bodyFont text-light">Breed type</p>
                                    <div class="container-fluid px-3 py-3">
                                        <button type="button" class="btn btn-light btn-lg w-100">
                                            View Info
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 d-flex justify-content-center pt-5">
                        <router-link to="/add-meal-plan" custom v-slot="{ href, navigate }">
                            <button class="icon-btn add-btn shadow" @click="navigate" :href="href">
                                <div class="add-icon"></div>
                                <div class="btn-txt">New Plan</div>
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
            <!-- size: btn-lg -->
            <button type="button" class="btn btn-lg bg-primary w-100 headingFont text-light fw-bold shadow">
                Create Pet
            </button>


        </form>



    </div>
</template>

<style>
.pet-title {
    text-shadow: 1px 5px 5px black;
}

.dog-breed-card {
    box-sizing: border-box;
    width: 500px;
    height: 500px;
    background-image: url("../assets/Pixel Art/dog (1).png");
    background-position: center;
    background-size: cover;
    border: 1px solid white;
    box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
}

.dog-breed-card:hover {
    border: 1px solid black;
    transform: scale(1.05);
}

.dog-breed-card:active {
    transform: scale(0.95) rotateZ(1.7deg);
}

.cat-breed-card {
    box-sizing: border-box;
    width: 500px;
    height: 500px;
    background-image: url("../assets/Pixel Art/cat (5).png");
    background-position: center;
    background-size: cover;
    border: 1px solid white;
    box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
}

.cat-breed-card:hover {
    border: 1px solid black;
    transform: scale(1.05);
}

.cat-breed-card:active {
    transform: scale(0.95) rotateZ(1.7deg);
}
</style>