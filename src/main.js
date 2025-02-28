import './assets/main.css';
import axios from "axios";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from "./store";
import config from "@/config.js";
import "croppie/croppie.css"; // import the croppie css manually
import VueTheMask from "vue-the-mask";
import {messages} from './locales';
import {createI18n} from 'vue-i18n';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
//Vue.prototype.$dayjs = dayjs;


import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);

const app = createApp(App).component("f-awesome", FontAwesomeIcon)
app.config.globalProperties.$dayjs = dayjs;

// ========= LOCALE =========
let chooseLocale = null;
const langList = [
    {id: "ru", name: "RU"},
    {id: "en", name: "EN"},
];

const storageLang = localStorage.getItem('lang');
if (storageLang) {
    chooseLocale = storageLang;
    localStorage.setItem('lang', chooseLocale);
} else {
    const language = navigator.language || navigator.userLanguage;
    const langCode = language.split('-')[0];
// Формируем массив поддерживаемых языков из списка `list`
    const supportedLanguages = langList.map(item => item.id);
// Возвращаем язык, если он поддерживается, иначе 'ru'
    chooseLocale = supportedLanguages.includes(langCode) ? langCode : 'ru';
    localStorage.setItem('lang', chooseLocale);
}

app.config.globalProperties.$dayjs.locale(chooseLocale)

const i18n = createI18n({
    legacy: false,
    locale: chooseLocale, // set current locale
    fallbackLocale: 'en', // Резервный язык
    messages
})

app.use(router).use(store).use(VueTheMask).use(i18n);

// Устанавливаем axios как глобальное свойство
app.config.globalProperties.$http = axios;
app.config.globalProperties.$http.defaults.headers.common["locale"] = chooseLocale;
// Устанавливаем базовый URL для всех запросов axios в приложении
app.config.globalProperties.$http.defaults.baseURL = config.api_point;

app.config.globalProperties.$http.interceptors.response.use(undefined, error => {
    let res = error.response;

    if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
            let userData = JSON.parse(localStorage.getItem("userData"));

            axios
                .post(`/api/auth/refresh-token`, {token: userData[0].token, refresh_token: userData[0].refresh_token})
                .then(resp => {
                    const tokenT = resp.data.token;
                    const refresh_token = resp.data.refresh_token;
                    let userData = [{}];
                    let getThisData = JSON.parse(localStorage.getItem("userData"));
                    userData[0].token = tokenT;
                    userData[0].refresh_token = refresh_token;
                    //userData[0].email = getThisData[0].email;
                    localStorage.setItem("userData", JSON.stringify(userData));
                    //localStorage.setItem("permissions", JSON.stringify(perms));
                    app.config.globalProperties.$http.defaults.headers.common[
                        "Authorization"
                        ] = `Bearer ${tokenT}`;
                    error.config.headers.Authorization = `Bearer ${tokenT}`;
                    error.config.__isRetryRequest = true;
                    // axios(error.config);
                    resolve(axios(error.config));
                })
                .catch(err => {
                    store.dispatch("logout").then(() => {
                        router.push("/");
                    });
                    // commit("auth_error", err.response.message);
                    reject(err);
                });
        });
    }
    // else if(res.status === 499){
    //     router.push("/service-work");
    // }
    return Promise.reject(error);
});

const userDataStorage = JSON.parse(localStorage.getItem("userData"));
let token = false;
if (userDataStorage) {
    token = userDataStorage[0].token;
}
if (token) {
    app.config.globalProperties.$http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}


app.mount('#app')
