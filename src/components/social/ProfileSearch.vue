<script setup>
const props = defineProps({
    Name: {
        required: true,
        type : String,
        default: "@bernardcks"
    },
    Image: {
        type: String,
        default: "/src/assets/person.jpg"

    },
})

</script>


<template>
    <div class="d-flex align-items-center my-2">
        <img class="rounded-circle float-start" width="65" v-bind:src=props.Image alt="">
        <span class="bodyFont px-3">{{ props.Name }}</span>
    </div>

</template>