import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

// meta tags requiresAuth for route protection
// requiresAuth: true(private), false(public)
// hideWhenAuth: true(hide when logged in)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
	  meta: { requiresAuth: false } 
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
	  meta: { requiresAuth: false } 
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
	  meta: { requiresAuth: false } 
    },{
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
	  meta: { requiresAuth: false, hideWhenAuth: true } 
    },{
      path: '/health',
      name: 'health',
      component: () => import('@/views/HealthView.vue'),
	  meta: { requiresAuth: false } // true
    },{
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
	  meta: { requiresAuth: true } // true
    },{
      path: '/profile/:username',
      name: 'publicProfile',
      component: () => import('@/views/PublicProfileView.vue'),
      props: true,
      meta: { requiresAuth: false } // Public profiles can be viewed without authentication
    },{
      path: '/meal',
      name: 'meal',
      component: () => import('@/views/MealView.vue'),
	  meta: { requiresAuth: false } // true
    },{
      path: '/chatbot',
      name: 'chatbot',
      component: () => import('@/views/ChatbotView.vue'),
	  meta: { requiresAuth: false } 
    },{
      path: '/social',
      name: 'social',
      component: () => import('@/views/SocialView.vue'),
	  meta: { requiresAuth: false } // true
    },{
      path: '/viewpost/:postId',
      name: 'publicPosts',
      component: () => import('@/views/ViewPost.vue'),
      props: true,
      meta: { requiresAuth: false } // Public profiles can be viewed without authentication
    },{
      path: '/pet',
      name: 'pet',
      component: () => import('@/views/PetView.vue'),
	  meta: { requiresAuth: false } // true
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/MapView.vue'),
	  meta: { requiresAuth: false } 
    },
    {
      path: '/create-pet',
      name: 'create-pet',
      component: () => import('@/views/CreatePet.vue'),
	  meta: { requiresAuth: false } 
    },
        {
      path: '/viewpost',
      name: 'viewpost',
      component: () => import('@/views/ViewPost.vue'),
    },
    {
      path: '/add-meal-plan',
      name: 'add-meal-plan',
      component: () => import('@/views/AddMealPlan.vue'),
    },
     {
      path: '/temp',
      name: 'components',
      component: () => import('@/views/Components.vue'),
    },
    {
      path: '/nutrition-test',
      name: 'nutrition-test',
      component: () => import('@/views/PetNutritionTest.vue'),
      meta: { requiresAuth: false }
    }   


    // {
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

import { useAuthStore } from '@/stores/authStore';

// Route protection
router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore();

  if(!authStore.initialized){
    await authStore.initAuth();
  }

	// Redirect to login if destination page requires auth and no session is found
	if(to.meta.requiresAuth && !authStore.isAuthenticated){
		next('/login');
	}
	// Redirect to profile if trying to access auth pages when already authed
	else if (to.meta.hideWhenAuth && authStore.isAuthenticated){
		next('/profile');
	}
	else{
		next();
	}
});

export default router
