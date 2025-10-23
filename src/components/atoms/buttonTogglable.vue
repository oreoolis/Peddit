<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['click']);
const handleClick = () => {
    emit('click');
}

const props = defineProps({
    iconLinkON: {
        type: String,
        default: "bi-heart-fill"
    },
    labelON: {
        type: String,
        default: "Favorited"
    },
    colorON: {
        type: String,
        default: 'danger' // Bootstrap color name
    },
    iconLinkOFF: {
        type: String,
        default: "bi-heart"
    },
    labelOFF: {
        type: String,
        default: "Favorite"
    },
    colorOFF: {
        type: String,
        default: 'secondary' // Bootstrap color name
    },
    initialState: {
        type: Boolean,
        default: false
    }
});

// Define the 'toggle' event
const emit = defineEmits(['toggle']);

// The component uses its own internal state, initialized by the prop
const isToggled = ref(props.initialState);

// When the internal state changes (due to a click), emit the 'toggle' event to the parent
watch(isToggled, (newValue) => {
    emit('toggle', newValue);
});

// Generate a unique ID for the input and label pair
const uniqueId = `toggle-${Math.random().toString(36).substr(2, 9)}`;

const buttonClasses = computed(() => {
    const color = isToggled.value ? props.colorON : props.colorOFF;
    return [
        'btn',
        `btn-outline-${color}`,
        'd-flex',
        'align-items-center',
        'gap-2',
        'rounded-pill',
        'shadow-sm'
    ];
});

const iconClass = computed(() => {
    const color = isToggled.value ? `text-${props.colorON}` : `text-${props.colorOFF}`;
    return [
        isToggled.value ? props.iconLinkON : props.iconLinkOFF,
        color,
        'icon'
    ];
});
</script>

<template>
    <!-- Wrap in a single div to allow class inheritance -->
    <div>
        <!-- The checkbox handles the state, but is visually hidden -->
        <input type="checkbox" :id="uniqueId" v-model="isToggled">

    <!-- The label is the visible, clickable button -->
    <label :for="uniqueId" :class="buttonClasses" @click = "handleClick">
        <i :class="iconClass"></i>
        <div class="action">
            <span class="option-off">{{ labelOFF }}</span>
            <span class="option-on">{{ labelON }}</span>
        </div>
    </label>
</template>

<style scoped>
/* Hide the actual checkbox */
input[type="checkbox"] {
    display: none;
}

/* The label acts as our button, Bootstrap classes handle most of its style */
label {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease, color 0.2s ease;
}

/* The icon itself */
.icon {
    font-size: 1.2rem;
    line-height: 1;
}

/* --- Animations --- */

/* Pop animation for the icon when toggled ON */
input:checked + label .icon {
    animation: pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
    0% { transform: scale(1); }
    50% { transform: scale(1.4); }
    100% { transform: scale(1); }
}

/* Text sliding animation container */
.action {
    position: relative;
    overflow: hidden;
    display: grid;
    line-height: 1.2;
    font-weight: 600;
}

/* Both text spans occupy the same grid cell */
.action span {
    grid-area: 1 / 1;
    transition: transform 0.4s ease, opacity 0.4s ease;
}

/* Initial state (OFF) */
.action .option-off {
    transform: translateY(0%);
    opacity: 1;
}
.action .option-on {
    transform: translateY(100%);
    opacity: 0;
}

/* Toggled state (ON) */
input:checked + label .action .option-off {
    transform: translateY(-100%);
    opacity: 0;
}
input:checked + label .action .option-on {
    transform: translateY(0%);
    opacity: 1;
}
</style>
