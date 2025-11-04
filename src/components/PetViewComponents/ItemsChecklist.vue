<script setup>
const props = defineProps({
    /* You can pass in a label prop to customize the text */
    label: {
        type: String,
        default: ''
    },
    ingredient_id: {
        type: Number,
        default: 0
    },
    qty: {
        type: Number,
        default: 0
    },
    isChecked: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['checked', 'delete']);

const checkedIngredient = () => {
    emit('checked', {ingredient_id: props.ingredient_id, isChecked: props.isChecked });
    console.log("check ingredient test")
}

const handleIngredientDelete = () => {
    emit('delete', props.ingredient_id);
    console.log("delete ingredient test")
}

</script>
<template>
    <div class="custom-checkbox-container">
        <input class="custom-checkbox-input" :id="props.ingredient_id" type="checkbox" />
        <label class="custom-checkbox-label" :for="props.ingredient_id" @click="checkedIngredient">
            <span class="custom-checkbox-text bodyFont">{{props.label}}, {{ props.qty }}g</span>
        </label>
        <button class="delete-button mt-2 mx-2" @click="handleIngredientDelete">
            <svg class="delete-svgIcon" viewBox="0 0 448 512">
                <path
                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z">
                </path>
            </svg>
        </button>
    </div>
</template>

<style>
/* CSS (updated with faster focus ring transition) */
.custom-checkbox-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    padding: 5px;
}

.custom-checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.custom-checkbox-label {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
    transition: all 0.2s ease;
}

/* Checkbox box */
.custom-checkbox-label:before {
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    content: "";
    position: absolute;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
    border: 2px solid #ccc;
    transition: all 0.3s ease;
    z-index: 1;
}

/* Checkmark */
.custom-checkbox-label:after {
    content: "";
    position: absolute;
    left: 6px;
    top: 7px;
    width: 7px;
    height: 12px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) scale(0);
    opacity: 0;
    transition: all 0.2s ease;
    z-index: 3;
}

/* Checked state */
.custom-checkbox-input:checked+.custom-checkbox-label:before {
    background: linear-gradient(135deg, var(--bs-primary) 0%,var(--bs-primary) 100%);
    border: none;
    overflow: hidden;
}

/* Shine effect */
.custom-checkbox-label span.custom-checkbox-shine {
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 20px;
    z-index: 2;
    pointer-events: none;
}

.custom-checkbox-input:checked+.custom-checkbox-label span.custom-checkbox-shine:after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 20px;
    height: 100px;
    background: linear-gradient(to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0) 100%);
    transform: rotate(45deg);
    animation: shine 0.6s ease-in-out infinite;
}

/* Checkmark animation */
.custom-checkbox-input:checked+.custom-checkbox-label:after {
    transform: rotate(45deg) scale(1);
    opacity: 1;
}

/* Hover effect */
.custom-checkbox-container:hover .custom-checkbox-label:before {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
}

/* Text styling */
.custom-checkbox-text {
    color: #333;
    font-size: 20px;
    transition: color 0.2s ease;
    position: relative;
    z-index: 1;
}

.custom-checkbox-container:hover .custom-checkbox-text {
    color: var(--bs-primary);
}

/* Focus state with transition */
.custom-checkbox-input:focus+.custom-checkbox-label:before {
    outline-offset: 3px;
    transition: outline 0.1s ease-in-out;
    /* Added fast transition for outline */
}

/* Ensure outline is initially off with transition readiness */
.custom-checkbox-label:before {
    outline: 0 solid transparent;
    /* Initial state for smooth transition */
}

/* Shine animation keyframes */
@keyframes shine {
    0% {
        left: -100%;
    }

    40% {
        left: 100%;
    }

    100% {
        left: 100%;
    }
}

.delete-button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgb(66, 66, 66);
    border: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;
}

.delete-svgIcon {
    width: 10px;
    transition-duration: 0.3s;
}

.delete-svgIcon path {
    fill: white;
}

.delete-button:hover {
    width: 90px;
    border-radius: 50px;
    transition-duration: 0.3s;
    background-color: var(--bs-danger);
    align-items: center;
}

.delete-button:hover .delete-svgIcon {
    width: 10px;
    transition-duration: 0.3s;
    transform: translateY(60%);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
}

.delete-button::before {
    display: none;
    content: "Delete";
    color: white;
    transition-duration: 0.3s;
    font-size: 2px;
}

.delete-button:hover::before {
    display: block;
    padding-right: 10px;
    font-size: 13px;
    opacity: 1;
    transform: translateY(0px);
    transition-duration: 0.3s;
}
</style>