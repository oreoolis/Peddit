<script setup>
import { computed } from 'vue';
const props = defineProps({

    route : {
        type: String,
        default: "/"
    },
    icon: {
        type: String,
        default: "Paw.png" 
    },
    label: {
        type: String,
        default: "NavLabel"
    },
    isSelected: {
        type: Boolean,
        default: false
    },
    avatar:{
        type: String,
        default: null
    }
    

});
const iconSrc = computed(() => {
    // This tells the build tool (Vite) to find the image and provide the correct public path.
    return new URL(`../../assets/Sprite/HomeIcons/${props.icon}`, import.meta.url).href;
});
</script>


<template>
    <!-- icon version -->
     <li class="nav-item flex-fill">
        <RouterLink class="nav-link black" :to="route">
            <div :class="{'selected' : isSelected}">
            <img v-if="avatar" :src="avatar" alt="Profile Image" class="rounded-circle profile-image">
            <img v-else :src="iconSrc" alt="label" class="icon">
            </div>
            <span class="nav-label">{{ label }}</span>
        </RouterLink>


     </li>

</template>

<style scoped>
/* Icon sizing */
.icon { 
    width: 20px; 
    height: 20px; 
    transition: transform .22s cubic-bezier(.2,.9,.2,1);
}

/* Profile image sizing (essential) */
.profile-image{ 
    width: 30px; 
    height: 30px; 
    border-radius: 50%; 
    transition: transform .22s cubic-bezier(.2,.9,.2,1), box-shadow .22s cubic-bezier(.2,.9,.2,1);
    object-fit: cover;
}

/* Label minimal typography — keep consistent with global font rules */
.nav-label {
    font-weight: 600;
    font-size: 0.82rem;
    line-height: 1;
    display: inline-block;
    transition: color .18s ease, transform .22s cubic-bezier(.2,.9,.2,1);
}

/* Selected state — kept as a small visual indicator */
.selected {
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    padding: 6px;
    background: rgba(var(--bs-primary-rgb), 0.12);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(var(--bs-primary-rgb), 0.12);
    transition: background-color .22s cubic-bezier(.2,.9,.2,1),
                transform .22s cubic-bezier(.2,.9,.2,1),
                box-shadow .22s cubic-bezier(.2,.9,.2,1);
}


/* Emphasize icon/profile when selected */
.selected .icon,
.selected .profile-image {
    transform: scale(1.06);
}

/* Change label color when the sibling container is selected */
.nav-link .selected + .nav-label {
    color: var(--bs-primary);
    transform: translateY(-1px);
}

/* Hover micro-interactions applied to nav-link children */
.nav-item .nav-link:hover .icon,
.nav-item .nav-link:focus .icon {
    transform: translateY(-2px) scale(1.03);
}
.nav-item .nav-link:hover .profile-image,
.nav-item .nav-link:focus .profile-image {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 20px rgba(var(--bs-primary-rgb), 0.10);
}

/* Keep label responsive to hover as well */
.nav-item .nav-link:hover .nav-label,
.nav-item .nav-link:focus .nav-label {
    color: var(--bs-primary);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
    .icon,
    .profile-image,
    .nav-label,
    .selected {
        transition: none !important;
        transform: none !important;
        box-shadow: none !important;
    }
}
</style>