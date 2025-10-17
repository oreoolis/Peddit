<script>
</script>
<template>
    <!-- render prop based on dictionary -->
    <div class="ingredient-card">
        <div class="card-contents">
            <h5 class="headingFont fw-bold">Drum Meat</h5>
            <img src="../../assets/Sprite/Food/Set3-Meat/13.png">
            <p class="bodyFont">200g</p>
        </div>
    </div>
</template>
<style scoped>
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
</style>