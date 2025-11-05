<script setup>
import AnimatedImage from '@/components/atoms/animated/animatedImage.vue';
</script>

<template>
    <div class="d-flex">
        <div class="mx-auto d-flex align-content-center">
            <AnimatedImage src="/src/assets/Sprite/Dog/Idle.png" :frameWidth="48" :frameHeight="48" :frames="4" :fps="4" :width="64" :height="64" />
            <h1>404 Page Not Found</h1>
            <AnimatedImage src="/src/assets/Sprite/Cat/Idle.png" :frameWidth="48" :frameHeight="48" :frames="4" :fps="4" :width="64" :height="64" />
        </div>
    </div>
</template>

<style scoped>

</style>