//import Vue from "vue";
import { createStore } from "vuex";

//import authorization from "./modules/authorization";
import preloader from "./modules/preloader";
import notificator from "./modules/notificator";

export default createStore({
  modules: {
    preloader, notificator
  }
});

//Vue.use(Vuex);

// export default new Vuex.Store({
//   modules: {
//     preloader,
//     notificator,
//   }
// });
