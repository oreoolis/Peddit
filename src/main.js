import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/base.css';
import "bootstrap";


import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// Pinia stuff
const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app')
