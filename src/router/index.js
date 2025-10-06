import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },{
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },{
      path: '/health',
      name: 'health',
      component: () => import('@/views/HealthView.vue'),
    },{
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },{
      path: '/meal',
      name: 'meal',
      component: () => import('@/views/MealView.vue'),
    },{
      path: '/chatbot',
      name: 'chatbot',
      component: () => import('@/views/ChatbotView.vue'),
    },{
      path: '/social',
      name: 'social',
      component: () => import('@/views/SocialView.vue'),
    },{
      path: '/pet',
      name: 'pet',
      component: () => import('@/views/PetView.vue'),
    },
  ],
})

export default router
