import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import router from './router'
import Lara from '@primevue/themes/lara';
import './assets/tailwind.css';
import 'primeicons/primeicons.css';

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
app.use(ConfirmationService)
app.use(ToastService)
app.mount('#app');
