const preloader = {
  state: {
    isShow: false
  },
  mutations: {
    startPreloader(state) {
      state.isShow = true;
    },
    stopPreloader(state) {
      state.isShow = false;
    }
  },
  actions: {
    startPreloader({ commit }) {
      commit("startPreloader");
    },
    stopPreloader({ commit }) {
      setTimeout(() => {
        commit("stopPreloader");
      }, 200);
    }
  }
};

export default preloader;
