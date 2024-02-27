<template>
  <div class="register--container">
    <div class="container">
      <div class="register--form-container shadow-card">
        <div class="auth-title">
          <h3>Регистрация</h3>
        </div>
        <form @submit.prevent="register">
          <div class="input-block">
            <label for="login-email">Адрес электронной почты</label>
            <input
                type="email"
                @focus="clearError"
                v-model="email"
                id="login-email"
            />
          </div>
          <div class="input-block">
            <label for="login-password">Пароль</label>
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
            <button type="submit" class="btn btn-sm btn-success">Регистрация</button>
          </div>
        </form>

        <div class="mrg-t-30">
          <hr>
          <div class="mrg-t-20 text-right">
            <router-link class="btn btn-sm btn-info" tag="a" :to="`/login`">Войти</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
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
      let email = this.email;
      let password = this.password;
      // this.$store.dispatch("startPreloader");
      localStorage.setItem("confirmEmail", email);

      this.$store.dispatch("startPreloader");

      this.$store
          .dispatch("register", { email, password })
          .then(() => {
            localStorage.setItem("newUser", '1');
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