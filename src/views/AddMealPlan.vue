<script>

</script>
<template>
    <div class="add-meal-plan">
        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
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
        <h1 class="headingFont display-3 text-center px-5 py-5">Create Meal Plan</h1>
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
                    <div class="row d-flex justify-content-center">
                        <div class="col-lg-2">
                            <div class="ingredient-card">
                                <div class="card-contents">
                                    <h5 class="headingFont fw-bold">Drum Meat</h5>
                                    <img src="../assets/Sprite/Food/Set3-Meat/13.png">
                                    <p class="bodyFont">200g</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="ingredient-card">
                                <div class="card-contents">
                                    <h5 class="headingFont fw-bold">Drum Meat</h5>
                                    <img src="../assets/Sprite/Food/Set3-Meat/13.png">
                                    <p class="bodyFont">200g</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="ingredient-card">
                                <div class="card-contents">
                                    <h5 class="headingFont fw-bold">Drum Meat</h5>
                                    <img src="../assets/Sprite/Food/Set3-Meat/13.png">
                                    <p class="bodyFont">200g</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container-fluid px-3 py-3">
                    <div class="row d-flex justify-content-center">
                        <div class="col-lg-2">
                            <div class="ingredient-card">
                                <div class="card-contents">
                                    <h5 class="headingFont fw-bold">Drum Meat</h5>
                                    <img src="../assets/Sprite/Food/Set3-Meat/13.png">
                                    <p class="bodyFont">200g</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-2 d-flex justify-content-center pt-5">
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
                    <button type="button" class="btn bg-primary btn-lg w-100 text-light fw-bold headingFont shadow">
                        Create Meal Plan
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>
<style>
/* From Uiverse.io by SteveBloX */
.ingredient-card {
    box-sizing: border-box;
    width: 190px;
    height: 254px;
    background: rgba(217, 217, 217, 0.58);
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

.ingredient-card:hover {
    border: 1px solid black;
    transform: scale(1.05);
}

.ingredient-card:active {
    transform: scale(0.95) rotateZ(1.7deg);
}

.card-contents {
    display: block;
}

img {
    width: 7em;
    height: 7em;
}

/* From Uiverse.io by mrhyddenn */
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