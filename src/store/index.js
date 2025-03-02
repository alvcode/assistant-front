//import Vue from "vue";
import { createStore } from "vuex";

//import authorization from "./modules/authorization";
import preloader from "./modules/preloader";
import notificator from "./modules/notificator";
import authorization from "@/store/modules/authorization.js";
import manual_updater from "@/store/modules/manual_updater.js";

export default createStore({
  modules: {
    preloader, notificator, authorization, manual_updater
  }
});

//Vue.use(Vuex);

// export default new Vuex.Store({
//   modules: {
//     preloader,
//     notificator,
//   }
// });
