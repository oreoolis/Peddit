<script setup>
import { RouterLink,useRoute } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from 'vue';
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
console.log(isLoggedIn.value);

const navItems = computed(()=>{
    let items = [
        { name: 'about', route: '/about', icon: 'Home.png', label: 'About' },
        { name: 'social', route: '/social', icon: 'Social.png', label: 'Social' },
        { name: 'meal', route: '/meal', icon: 'Burger.png', label: 'Meals' },
        { name: 'login', route: '/login', icon: 'Heart.png', label: 'Log In' },
    ];
    if (isLoggedIn.value) {
        items = [
        { name: 'pet', route: '/pet', icon: 'Paw.png', label: 'Pet' },
        { name: 'social', route: '/social', icon: 'Social.png', label: 'Social' },
        { name: 'home', route: '/home', icon: 'Home.png', label: 'Home' }, 
        { name: 'meal', route: '/meal', icon: 'Burger.png', label: 'Meals' },
        ]
        items.push({
            name: 'profile',
            route: '/profile',
            avatar: displayAvatar.value, // Pass avatar as a unique prop
            label: 'Profile',
        });
 
    }
    return items;
})
const activeItemName = computed(() => {
    // Assumes your routes are named. e.g., { path: '/home', name: 'home', component: ... }
    return route.name;
});
const displayAvatar = computed(() => avatarUrl.value || defaultAvatar);



const navRef = ref(null);

onMounted(async () => {
    if (!profile.value && user.value) {
        await userStore.fetchProfile();
    }

    // If any modal/backdrop exists in the DOM, slide the bottom nav away so it doesn't overlay.
    // Some custom modals don't add `body.modal-open`, so observe DOM mutations and react.
    const checkForModal = () => {
        try {
            // look for common modal/backdrop markers
            const hasBackdrop = !!document.querySelector('.modal-backdrop, .modal, [role="dialog"]');
            if (hasBackdrop) {
                document.body.classList.add('has-modal');
            } else {
                document.body.classList.remove('has-modal');
            }
        } catch (e) {
            // ignore when not in browser
        }
    };

    // initial check
    checkForModal();

    const observer = new MutationObserver(() => checkForModal());
    try {
        observer.observe(document.body, { childList: true, subtree: true });
    } catch (e) {
        // ignore in non-browser environments
    }

    onUnmounted(() => {
        try { observer.disconnect(); } catch (e) {}
        try { document.body.classList.remove('has-modal'); } catch (e) {}
    });
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
    padding: calc(env(safe-area-inset-bottom, 0px) + 0.45rem) 0.6rem 0.25rem;
    box-shadow: 0 8px 24px rgba(16,24,40,0.18), 0 2px 6px rgba(0,0,0,0.08);
    z-index: 400; /* keep below typical modal z-index (Bootstrap modal ~1050) */
    transform: translateY(0);
    transition: transform .18s ease;
}


/* small profile image used in bottom bar */
.profile-image { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; }

/* icon sizing used by NavItem */
.icon { width: 20px; height: 20px; }


/* when a modal is open (Bootstrap adds .modal-open to body), slide the bottom nav out of view
     so modals/popups won't be visually obstructed by the navbar */
body.modal-open .navbar-bottom {
    transform: translateY(110%);
}

/* also respond to our generic has-modal class (set via MutationObserver) for custom modals */
body.has-modal .navbar-bottom {
    transform: translateY(110%);
}

</style>