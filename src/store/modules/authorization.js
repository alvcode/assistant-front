import axios from "axios";
import Formatter from "../../components/libraries/Formatter";

const formatter = new Formatter();

const authorization = {
  state: {
    status: "",
    errorText: "",
    userData: JSON.parse(localStorage.getItem("userData"))
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, data) {
      state.status = "success";
      state.userData = data;
    },
    auth_error(state, errorText) {
      state.status = "error";
      state.errorText = errorText;
      state.userData = undefined;
    },
    logout(state) {
      state.status = "logout";
      state.userData = undefined;
    }
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("email", user.email);
        formData.append("password", user.password);

        commit("auth_request");
        axios
          .post(`/auth/login`, formData)
          .then(resp => {
            const token = resp.data.token;
            const refresh_token = resp.data.refresh_token;
            const email = resp.data.email;
            const perms = resp.data.permissions;
            let userData = [{}];
            userData[0].token = token;
            userData[0].refresh_token = refresh_token;
            userData[0].email = email;
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("permissions", JSON.stringify(perms));
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Установим browser_id
            const browserIdStorage = localStorage.getItem('enroller_browser_id');
            let enrollerBrowserId = false;
            if(browserIdStorage){
              enrollerBrowserId = browserIdStorage;
            }else{
              let newBrowserId = formatter.generateHash(20);
              localStorage.setItem('enroller_browser_id', newBrowserId);
              enrollerBrowserId = newBrowserId;
            }
            axios.defaults.headers.common["EnrollerBrowserId"] = enrollerBrowserId;
            // =================

            commit("auth_success", userData);
            resolve(resp);
          })
          .catch(err => {
            commit("auth_error", err.response.data.message);
            localStorage.removeItem("userData");
            reject(err.response.data);
          });
      });
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("email", user.email);
        formData.append("username", user.name);
        formData.append("password", user.password);
        formData.append("phone_number", user.phone_number);
        formData.append("iAgree", user.iAgree);
        formData.append("promocode", user.promocode);
        formData.append("user_contract", JSON.stringify(user.userContract));

        axios
          .post(`/auth/register`, formData)
          .then(resp => {
            resolve(resp);
          })
          .catch(err => {
            commit("auth_error", err.response.data.message);
            reject(err.response.data);
          });
      });
    },
    sendConfirm({ commit }, email) {
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("email", email.userEmail);

        axios
          .post(`/auth/send-confirm`, formData)
          .then(resp => {
            resolve(resp);
          })
          .catch(err => {
            commit("auth_error", err.response.data.message);
            reject(err.response.data);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit("logout");
        localStorage.removeItem("userData");
        delete axios.defaults.headers.common["Authorization"];
        delete axios.defaults.headers.common["EnrollerBrowserId"];
        if (localStorage.getItem("userData")) {
          reject();
        } else {
          resolve();
        }
      });
    }
  }
};

export default authorization;
