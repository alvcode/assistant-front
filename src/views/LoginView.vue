<template>
  <div class="login--container">
    <div class="container">
      <div class="header">
        <div class="header-lang">
          <lang-index-component></lang-index-component>
        </div>
      </div>
      <div class="login--form-container shadow-card">
        <div class="auth-title">
          <h3>{{ $t('app_sign_in') }}</h3>
        </div>
        <form @submit.prevent="loginSubmit">
          <div class="input-block">
            <label for="login-email">{{ $t('app_login') }}</label>
            <input
                type="text"
                @focus="clearError"
                v-model="login"
                id="login-login"
            />
          </div>
          <div class="password-block">
            <div v-show="showPassword" @click="toggleShowPassword" class="show-password">
              <f-awesome :icon="['fas', 'eye']" />
            </div>
            <div v-show="!showPassword" @click="toggleShowPassword" class="show-password">
              <f-awesome :icon="['fas', 'eye-slash']" />
            </div>
            <div class="input-block">
              <label for="login-password">{{ $t('app_password') }}</label>
              <input
                  @focus="clearError"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  id="login-password"
              />
              <div class="form-error"></div>
            </div>
          </div>
          <div v-show="errorText" class="mrg-t-10 mrg-b-10">
            <div class="alert alert-sm alert-danger">{{errorText}}</div>
          </div>
          <div class="input-block">
            <button type="submit" class="btn btn-sm btn-success">{{ $t('app_sign_in') }}</button>
          </div>
        </form>

        <div class="mrg-t-30">
          <hr>
          <div class="mrg-t-20 text-right">
            <router-link class="btn btn-sm btn-info" tag="a" :to="`/register/`">{{ $t('app_register') }}</router-link>
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

      showPassword: false,
    };
  },
  computed: {
    ...mapState({
      userData: state => state.authorization.userData
    })
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    loginSubmit() {
      let login = this.login;
      let password = this.password;
      this.$store.dispatch("startPreloader");
      // На всякий случай, для особо одаренных, сохраним это
      //localStorage.setItem("confirmEmail", email);
      this.$store
          .dispatch("login", { login, password })
          .then(() => {
            this.$store.dispatch("stopPreloader");
            localStorage.setItem("userLogin", login);
            this.$router.push("/");
          })
          .catch(err => {
            this.errorText = err.message;
            if (err.status && err.status === 409) {
              this.confirmLink = true;
            }
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
.login--form-container {
  width: 500px;
  margin: 30px auto 60px auto;
  padding-bottom: 35px;
}
.login--container{
  min-height: 65vh;
  margin-bottom: 100px;
}
.password-block {
  position: relative;

  .show-password {
    display: inline-block;
    position: absolute;
    top: 25px;
    right: 7px;
    cursor: pointer;
  }
}
@media (max-width: 700px) {
  .login--form-container {
    width: 98%;
  }
}
</style>