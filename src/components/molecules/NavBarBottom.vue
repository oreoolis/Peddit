<script setup>
import { RouterLink,useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import NavItem from '@/components/atoms/NavItem.vue';
import personImage from '@/assets/person.jpg'



// 2. Define the list of navigation items as data

const defaultAvatar = personImage;
const userStore = useUserStore();
const authStore = useAuthStore();
const route = useRoute();

const { user } = storeToRefs(authStore);
const { profile, avatarUrl } = storeToRefs(userStore);

const isLoggedIn = computed(() => !!user.value);

const navItems = computed(()=>{
    const items = [
        { name: 'pet', route: '/pet', icon: 'Paw.png', label: 'Pet' },
        { name: 'home', route: '/home', icon: 'Home.png', label: 'Home' },
        { name: 'social', route: '/social', icon: 'Social.png', label: 'Social' },
        { name: 'meal', route: '/meal', icon: 'Burger.png', label: 'Meals' },
    ];
    if (isLoggedIn) {
        items.push({
            name: 'profile',
            route: '/profile',
            avatar: displayAvatar.value, // Pass avatar as a unique prop
            label: 'Profile',
        });
    }
    console.log(items);
    return items;
})
const activeItemName = computed(() => {
    // Assumes your routes are named. e.g., { path: '/home', name: 'home', component: ... }
    return route.name;
});
const displayAvatar = computed(() => avatarUrl.value || defaultAvatar);



onMounted(async () => {
    if (!profile.value && user.value) {
        await userStore.fetchProfile();
    }


});

</script>

<template> 
        <!-- Bottom navbar: xs–md -->
        <nav class="navbar fixed-bottom bg-white headingFont d-block d-lg-none navbar-bottom" >
            <div class="container-fluid">
                <ul class="navbar-nav w-100 d-fill justify-content-around flex-row text-center mb-0 align-items-center">
                <NavItem
                    v-for="item in navItems"
                    :key="item.name"
                    :label="item.label"
                    :route="item.route"
                    :icon="item.icon"
                    :avatar="item.avatar"
                    :isSelected="activeItemName === item.name"
                />
                </ul>
            </div>
        </nav>
</template>
<style scoped>
.navbar-bottom {
    padding: 0.45rem 0.6rem;
    box-shadow: 0 8px 24px rgba(16,24,40,0.18), 0 2px 6px rgba(0,0,0,0.08);
}


/* small profile image used in bottom bar */
.profile-image { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; }

/* icon sizing used by NavItem */
.icon { width: 20px; height: 20px; }


</style>