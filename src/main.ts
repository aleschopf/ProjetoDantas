import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import router from './router'
import Lara from '@primevue/themes/lara';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            prefix: 'p',
            cssLayer: false,
            darkModeSelector: '.dark'
        },
    }
});

app.use(router)

app.mount('#app');
