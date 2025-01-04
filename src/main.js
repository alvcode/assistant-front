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
app.config.globalProperties.$http.defaults.headers.common["locale"] = `ru`;
// Устанавливаем базовый URL для всех запросов axios в приложении
app.config.globalProperties.$http.defaults.baseURL = config.api_point;

app.config.globalProperties.$http.interceptors.response.use(undefined, error => {
    let res = error.response;

    if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
            let userData = JSON.parse(localStorage.getItem("userData"));
            let formData = new FormData();
            formData.append("refresh_token", userData[0].refresh_token);
            formData.append("token", userData[0].token);

            axios
                .post(`/api/auth/refresh`, formData)
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
