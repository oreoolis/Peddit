<script>
</script>
<template>
    <div class="card overflow-hidden shadow p-3 mb-5 bg-body-tertiary rounded-4" style="width: 40rem; height: 40rem; ">
        <div class="card-header text-center">
            <div class="row d-flex justify-content-between">
                <div class="col-lg-6">
                    <h3 class="headingFont fw-bold">Cat 1</h3>
                </div>
                <div class="col-lg-6">
                    <h3 class="headingFont fw-bold">Male</h3>
                </div>
            </div>
        </div>
        <img src="../../assets/ragdoll.jpg" style="height: 60%; object-fit:cover;" class="card-img-top rounded-5 px-3 py-3"
            alt="...">
        <div class="card-body">
            <div class="card-text">
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
            <!-- size: none -->
            <div class=" containertext-end px-3 py-3">
                <button type="button" class="btn btn-primary btn-lg w-100 bg-primary bodyFont">
                    Summary
                </button>
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