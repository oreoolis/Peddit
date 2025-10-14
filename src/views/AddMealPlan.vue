<script setup>
import IngredientCard from '@/components/PetViewComponents/IngredientCard.vue';



</script>
<template>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    <!-- End of Modal-->
    <div class="add-meal-plan">

        <h1 class="headingFont display-3 text-center px-5 py-5 fw-semibold">Create Meal Plan</h1>
        <div class="meal-form container-fluid px-3 py-3">
            <form>
                <div class="row d-flex justify-content-center">
                    <div class="col-lg-8">
                        <div class="mb-3 input-group-lg">
                            <label for="" class="form-label headingFont fw-bold h5">Meal Name</label>
                            <input type="text" name="" id="" class="form-control input-lg" placeholder=""
                                aria-describedby="helpId" />
                        </div>
                    </div>
                </div>
                <div class="row d-flex justify-content-center">
                    <div class="col-lg-8">
                        <div class="mb-3 input-group-lg">
                            <label for="" class="form-label headingFont fw-bold h5">Meal Description</label>
                            <input type="text" name="" id="" class="form-control input-lg" placeholder=""
                                aria-describedby="helpId" />
                        </div>
                    </div>
                </div>
                <div class="row d-flex justify-content-center">
                    <div class="col-lg-8">
                        <h5 class="headingFont fw-bold">Ingredients</h5>
                    </div>
                </div>
                <!-- Limit to 3 cards per row, else generate new row -->
                <div class="container-fluid px-3 py-3">
                    <div class="row d-flex justify-content-center gx-4 gy-3">
                        <div class="col-12 col-sm-12 col-md-4 col-lg-2 d-flex justify-content-center">
                            <IngredientCard />
                        </div>
                        <div class="col-12 col-sm-12 col-md-4 col-lg-2 d-flex justify-content-center">
                            <IngredientCard />
                        </div>
                        <div class="col-12 col-sm-12 col-md-4 col-lg-2 d-flex justify-content-center">
                            <IngredientCard />
                        </div>
                    </div>
                </div>
                <div class="container-fluid px-3 py-3">
                    <div class="row d-flex justify-content-center gx-4 gy-3">
                        <div class="col-12 col-sm-12 col-md-4 col-lg-2 d-flex justify-content-center">
                            <IngredientCard />
                        </div>
                        <div
                            class="col-12 col-sm-12 col-md-4 col-lg-2 d-flex justify-content-center d-flex justify-content-center pt-5">
                            <button class="icon-btn add-btn shadow" data-bs-toggle="modal"
                                data-bs-target="#exampleModal" type="button">
                                <div class="add-icon"></div>
                                <div class="btn-txt">New Item</div>
                            </button>
                        </div>
                    </div>
                </div>
                <br></br>
                <!-- End of ingredient container -->
                <div class="meal-plan-output container-fluid bg-primary-light px-3 py-3 rounded-4 shadow">
                    <h3 class="headingFont fw-bold text-end px-3 py-3">Estimated Cost: $X/Week</h3>
                    <!-- max items per row: 2 -->
                    <div class="row d-flex justify-content-center px-3 py-3">
                        <div class="col-lg-4">
                            <h5 class="headingFont fw-bold d-inline mb-0">Protein</h5>
                            <p class="bodyFont d-inline ms-2 mb-0">20mg</p>
                        </div>
                        <div class="col-lg-4">
                            <h5 class="headingFont fw-bold d-inline mb-0">Carbohydrates</h5>
                            <p class="bodyFont d-inline mb-0 ms-2">20mg</p>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-center px-3 py-3">
                        <div class="col-lg-4">
                            <h5 class="headingFont fw-bold d-inline mb-0">Salt</h5>
                            <p class="bodyFont d-inline ms-2 mb-0">20mg</p>
                        </div>
                        <div class="col-lg-4">
                            <h5 class="headingFont fw-bold d-inline mb-0">Water</h5>
                            <p class="bodyFont d-inline mb-0 ms-2">20mg</p>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-center px-3 py-3">
                        <div class="col-lg-4">
                            <h5 class="headingFont fw-bold d-inline mb-0">Fiber</h5>
                            <p class="bodyFont d-inline ms-2 mb-0">20mg</p>
                        </div>
                        <div class="col-lg-4">
                            <h5 class="headingFont fw-bold d-inline mb-0">Vitamin A</h5>
                            <p class="bodyFont d-inline mb-0 ms-2">20mg</p>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-center px-3 py-3">
                        <div class="col-lg-4">
                            <h5 class="headingFont fw-bold d-inline mb-0">Vitamin B</h5>
                            <p class="bodyFont d-inline ms-2 mb-0">20mg</p>
                        </div>
                        <div class="col-lg-4">
                            <h5 class="headingFont fw-bold d-inline mb-0">Vitamin C</h5>
                            <p class="bodyFont d-inline mb-0 ms-2">20mg</p>
                        </div>
                    </div>
                </div>
                <!-- size: btn-lg -->
                <div class="container-fluid px-5 py-5">
                    <button type="button" class="btn btn-primary btn-lg w-100 text-light fw-bold headingFont shadow">
                        Create Meal Plan
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>
<style scoped>
/* From Uiverse.io by mrhyddenn */

.add-meal-plan {
    position: static !important;
}

.icon-btn {
    width: 50px;
    height: 50px;
    border: 1px solid #cdcdcd;
    background: white;
    border-radius: 25px;
    overflow: hidden;
    position: relative;
    transition: width 0.2s ease-in-out;
    font-weight: 500;
    font-family: inherit;
}

.add-btn:hover {
    width: 120px;
}

.add-btn::before,
.add-btn::after {
    transition: width 0.2s ease-in-out, border-radius 0.2s ease-in-out;
    content: "";
    position: absolute;
    height: 4px;
    width: 10px;
    top: calc(50% - 2px);
    background: rgb(0, 0, 0);
}

.add-btn::after {
    right: 14px;
    overflow: hidden;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
}

.add-btn::before {
    left: 14px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
}

.icon-btn:focus {
    outline: none;
}

.btn-txt {
    opacity: 0;
    transition: opacity 0.2s;
}

.add-btn:hover::before,
.add-btn:hover::after {
    width: 4px;
    border-radius: 2px;
}

.add-btn:hover .btn-txt {
    opacity: 1;
}

.add-icon::after,
.add-icon::before {
    transition: all 0.2s ease-in-out;
    content: "";
    position: absolute;
    height: 20px;
    width: 2px;
    top: calc(50% - 10px);
    background: rgb(0, 0, 0);
    overflow: hidden;
}

.add-icon::before {
    left: 22px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
}

.add-icon::after {
    right: 22px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
}

.add-btn:hover .add-icon::before {
    left: 15px;
    height: 4px;
    top: calc(50% - 2px);
}

.add-btn:hover .add-icon::after {
    right: 15px;
    height: 4px;
    top: calc(50% - 2px);
}
</style>