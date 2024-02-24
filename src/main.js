import './assets/main.css';
import axios from "axios";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from "./store";
import config from "@/config.js";
import "croppie/croppie.css"; // import the croppie css manually
import VueTheMask from "vue-the-mask";


import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);

const app = createApp(App).component("f-awesome", FontAwesomeIcon)

app.use(router).use(store).use(VueTheMask);

// Устанавливаем axios как глобальное свойство
app.config.globalProperties.$http = axios;
// Устанавливаем базовый URL для всех запросов axios в приложении
app.config.globalProperties.$http.defaults.baseURL = config.api_point;

//app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app')
