<script setup> 


const props = defineProps({
    Name:{
        type: String,
        default: '@bernardcks',

    },
    Picture:{
        type: String,
        default: 'src/assets/person.jpg',
    },
    Content:{
        type: String,
        default: 'Wow very insightful! Thanks for sharing!',
    }
    
})
</script>

<template>
    <div class="card-body">
    <div class="d-flex align-items-center">
        <img class="rounded-circle float-start pe-2" width="45" v-bind:src="props.Picture" alt="">
        <!-- <img class="rounded-circle float-start pe-2" width="45" src="../../assets/person.jpg" alt=""> -->

        <div>
        <h4 class="card-subtitle mb-2 text-body-secondary headingFont fw-bold">{{props.Name}}</h4>                             
        </div>
    </div>
    <div>
        {{props.Content}}
    </div>
</div>
</template>