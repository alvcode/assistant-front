/* eslint-disable no-console */

import { register } from "register-service-worker";
import store from "./store";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "Приложение обслуживается сервис-воркером из кеша.\n" +
          "Для деталей посетите: https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("Сервис-воркер был зарегистрирован.");
    },
    cached() {
      console.log("Контент был закэширован для онлайн-использования.");
    },
    updatefound() {
      console.log("Новый контент загружен.");
    },
    updated() {
      console.log("Доступен новый контент. Пожалуйста, обновитесь.");
      caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
      });
      store.dispatch('setManualUpdate');
    },
    offline() {
      console.log(
        "Отсутствует интернет-соединение. Приложение работает в режиме оффлайн."
      );
    },
    error(error) {
      console.error("Ошибка при регистрации сервис-воркера:", error);
    }
  });
}
