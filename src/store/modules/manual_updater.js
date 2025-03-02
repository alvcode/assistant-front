const manual_updater = {
  state: {
    updateCounter: 0,
  },
  mutations: {
    UPDATE_COUNTER(state) {
      state.updateCounter++;
    },
  },
  actions: {
    setManualUpdate({ commit }) {
      commit("UPDATE_COUNTER");
    },
  }
};

export default manual_updater;
