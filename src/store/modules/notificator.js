const notificator = {
  state: {
    list: [],
    notId: 0
  },
  mutations: {
    ADD_NOTIFICATION(state, notification) {
      state.list.push(notification);
    },
    REMOVE_NOTIFICATION(state, notId) {
      state.list = state.list.filter(item => {
        if (+item.id !== +notId) {
          return item;
        }
      });
    }
  },
  actions: {
    addNotification({ commit, state }, notification) {
      let notId = state.notId;
      notification.id = notId;
      state.notId++;
      commit("ADD_NOTIFICATION", notification);
      setTimeout(() => {
        commit("REMOVE_NOTIFICATION", notId);
      }, notification.time * 1000);
    },
    removeNotification({ commit }, notId) {
      commit("REMOVE_NOTIFICATION", notId);
    }
  }
};

export default notificator;
