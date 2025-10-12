<script setup>
const props = defineProps({
    link: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        default: "Title Text"
    },

    Name: {
        type: String,
        default: "@bernardcks"

    },
    Image:{
        type: String,
        default: "src/assets/person.jpg"
    }

})
</script>


<template>
    <div class="d-flex align-items-start my-2 rounded card btn" onclick="location.href='/viewpost?id={{ link }}'">
        <div class="card-body">
            <h2 class="card-title">{{props.title}}</h2>
            <div class="d-flex align-items-center">
                <img class="rounded-circle float-start pe-2" width="45" :src=props.Image alt="">
                <div>
                <h6 class="card-subtitle mb-2 text-body-secondary bodyFont">{{props.Name}}</h6>                             
                </div>
            </div>
        </div>
    </div>
</template>