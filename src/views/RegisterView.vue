<template>
  <div class="register--container">
    <div class="container">
      <div class="header">
        <div class="header-lang">
          <lang-index-component></lang-index-component>
        </div>
      </div>
      <div class="register--form-container shadow-card">
        <div class="auth-title">
          <h3>{{ $t('app_register') }}</h3>
        </div>
        <form @submit.prevent="register">
          <div class="input-block">
            <label for="login-login">{{ $t('app_login') }}</label>
            <input
                type="text"
                @focus="clearError"
                v-model="login"
                id="login-login"
            />
          </div>
          <div class="input-block">
            <label for="login-password">{{ $t('app_password') }}</label>
            <input
                @focus="clearError"
                type="password"
                v-model="password"
                id="login-password"
            />
            <div class="form-error"></div>
          </div>
          <div v-show="errorText" class="mrg-t-10 mrg-b-10">
            <div class="alert alert-sm alert-danger">{{errorText}}</div>
          </div>
          <div class="input-block">
            <button type="submit" class="btn btn-sm btn-success">{{ $t('app_register') }}</button>
          </div>
        </form>

        <div class="mrg-t-30">
          <hr>
          <div class="mrg-t-20 text-right">
            <router-link class="btn btn-sm btn-info" tag="a" :to="`/login`">{{ $t('app_sign_in') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LangIndexComponent from "@/components/LangIndexComponent.vue";

export default {
  name: "LoginView",
  components: {LangIndexComponent},
  data() {
    return {
      login: "",
      password: "",
      errorText: "",
    };
  },
  computed: {
    ...mapState({
      userData: state => state.authorization.userData
    })
  },
  methods: {
    register() {
      let login = this.login;
      let password = this.password;
      // this.$store.dispatch("startPreloader");
      localStorage.setItem("userLogin", login);

      this.$store.dispatch("startPreloader");

      this.$store
          .dispatch("register", { login, password })
          .then(() => {
            //localStorage.setItem("newUser", '1');
            this.$store.dispatch("stopPreloader");
            this.$router.push("/thankyou");
          })
          .catch(err => {
            this.errorText = err.message;
            this.$store.dispatch("stopPreloader");
          });
    },
    clearError() {
      this.errorText = "";
    }
  },
}
</script>

<style scoped lang="less">
.header {
  width: 500px;
  margin: 10px auto;
  text-align: center;

  .header-lang {
    display: inline-block;
  }
}
.register--form-container {
  width: 500px;
  margin: 30px auto 60px auto;
  padding-bottom: 35px;
}
.register--container{
  min-height: 65vh;
  margin-bottom: 100px;
}
@media (max-width: 700px) {
  .register--form-container {
    width: 98%;
  }
}
</style>