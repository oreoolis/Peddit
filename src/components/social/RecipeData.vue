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
        not done yet
    </div>
</template>