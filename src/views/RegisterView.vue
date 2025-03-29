<template>
  <div class="register--container view" :class="{'dark-theme': isDarkTheme === true, 'light-theme': isDarkTheme === false}">
    <div class="container">
      <div class="header">
        <div class="header-actions">
          <theme-button :mode="'bool'" :value="isDarkTheme" @input="setIsDarkTheme"></theme-button>
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
          <div class="password-block">
            <div v-show="showRepeatPassword" @click="toggleShowRepeatPassword" class="show-password">
              <f-awesome :icon="['fas', 'eye']" />
            </div>
            <div v-show="!showRepeatPassword" @click="toggleShowRepeatPassword" class="show-password">
              <f-awesome :icon="['fas', 'eye-slash']" />
            </div>
            <div class="input-block">
              <label for="login-repeat-password">{{ $t('app_repeat_password') }}</label>
              <input
                  @focus="clearError"
                  :type="showRepeatPassword ? 'text' : 'password'"
                  v-model="repeatPassword"
                  id="login-repeat-password"
              />
              <div class="form-error"></div>
            </div>
          </div>
          <div v-show="errorText" class="mrg-t-10 mrg-b-10">
            <div class="notification-box danger">{{errorText}}</div>
          </div>
          <div class="input-block">
            <button type="submit" class="btx btx-sm btx-success">{{ $t('app_register') }}</button>
          </div>
        </form>

        <div class="mrg-t-30">
          <hr>
          <div class="mrg-t-20 text-right">
            <router-link class="btx btx-sm btx-info" tag="a" :to="`/login`">{{ $t('app_sign_in') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LangIndexComponent from "@/components/LangIndexComponent.vue";
import ThemeButton from "@/components/ui/ThemeButton.vue";

export default {
  name: "LoginView",
  components: {ThemeButton, LangIndexComponent},
  data() {
    return {
      login: "",
      password: "",
      repeatPassword: "",
      errorText: "",

      showPassword: false,
      showRepeatPassword: false,
      isDarkTheme: false,
    };
  },
  computed: {
    ...mapState({
      userData: state => state.authorization.userData
    })
  },
  methods: {
    setIsDarkTheme(val) {
      localStorage.setItem('isDarkTheme', val ? 'true' : 'false');
      this.isDarkTheme = val;
    },
    isDarkThemeEnabled() {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    initTheme() {
      const isDarkTheme = localStorage.getItem('isDarkTheme');
      if (isDarkTheme) {
        this.isDarkTheme = isDarkTheme === 'true';
      } else {
        if (this.isDarkThemeEnabled()) {
          this.setIsDarkTheme(true);
        } else {
          this.setIsDarkTheme(false);
        }
      }
    },
    toggleShowRepeatPassword() {
      this.showRepeatPassword = !this.showRepeatPassword;
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    register() {
      if (this.password !== this.repeatPassword) {
        this.errorText = this.$t('app_passwords_not_match');
        return false;
      }

      let login = this.login;
      let password = this.password;
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
  async created() {
    this.initTheme();
  },
}
</script>

<style scoped lang="less">
.header {
  //width: 500px;
  margin: 10px auto;
  text-align: center;

  .header-actions {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    flex-direction: row;

    &>div {
      margin: 0 5px;
    }
  }
}
.register--form-container {
  width: 500px;
  margin: 30px auto 60px auto;
  padding-bottom: 35px;
}
.register--container{
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 1px;
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
  .register--form-container {
    width: 98%;
  }
}
</style>