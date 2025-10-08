<script setup lang="ts">
// TODO: link social here
// import Social from '../components/Social.vue';
</script>

<template>
    <main>
        
        <!-- <Social /> -->
         <div class="input-group w-75 mx-auto py-3 bodyFont">
            <button class="btn btn-outline-secondary rounded-start-pill" type="button" id="SearchButton"><img src="../assets/Sprite/HomeIcons/Search.png" alt=""></button>
            <input type="text" class="form-control rounded-end-pill " placeholder="Search" aria-label="Search" aria-describedby="visible-addon">
            <input type="text" class="form-control d-none " placeholder="Hidden input" aria-label="Hidden input" aria-describedby="visible-addon">
        </div>
        <div class="text-center headingFont fw-bold fs-1">Profiles</div>
        <div class="w-75 mx-auto" id="ProfileList">
            <div class="d-flex align-items-center my-2">
                <img class="rounded-circle float-start" width="65" src="../assets/person.jpg" alt="">
                <span class="bodyFont px-3">@bernardcks</span>
            </div>
        </div>
        <div class="text-center headingFont fw-bold fs-1">Posts</div>

        <div class="w-75 mx-auto" id="PostList">
            <div class="d-flex align-items-start my-2 rounded  card">
                <div class="card-body">
                    <h2 class="card-title">Best Meal for a Puppy</h2>
                    <div class="d-flex align-items-center">
                    <img class="rounded-circle float-start pe-2" width="45" src="../assets/person.jpg" alt="">
                    <h6 class="card-subtitle mb-2 text-body-secondary">@bernardcks</h6>
                    </div>


                </div>

            </div>
        </div>

    </main>
</template>