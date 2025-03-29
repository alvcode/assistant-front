<template>
  <div
      class="home--container view"
      :class="{'dark-theme': isDarkTheme === true, 'light-theme': isDarkTheme === false}"
      v-show="showContent"
  >
    <div class="container">
      <div class="header">
        <div class="header-actions">
          <theme-button :mode="'bool'" :value="isDarkTheme" @input="setIsDarkTheme"></theme-button>
          <lang-index-component></lang-index-component>
        </div>
      </div>
      <div class="home--form-container shadow-card text-center">
        <div class="auth-title">
          <h3>{{getProjectName()}}</h3>
        </div>

        <div v-if="userData" class="account-card">
          <div class="email fs-16 text-bold mrg-b-5">{{userData[0].login}}</div>
          <div class="actions">
            <router-link tag="a" class="btx btx-sm btx-info" :to="`/notes/`">
              <f-awesome :icon="['fas', 'sign-in-alt']" /> {{ $t('app_to_panel') }}
            </router-link>
            <div @click="logout" class="btx btx-sm btx-orange">{{ $t('app_logout') }}</div>
          </div>
        </div>

        <div v-if="!userData" class="buttons mrg-t-25">
          <router-link tag="a" class="btx btx-sm btx-info" :to="`/login/`">
            <f-awesome :icon="['fas', 'sign-in-alt']" /> {{ $t('app_sign_in') }}
          </router-link>

          <router-link tag="a" class="btx btx-sm btx-orange" :to="`/register/`">
            <f-awesome :icon="['fas', 'user-plus']" /> {{ $t('app_register') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import config from "@/config.js";
import LangIndexComponent from "@/components/LangIndexComponent.vue";
import ThemeButton from "@/components/ui/ThemeButton.vue";

export default {
  name: "HomeView",
  components: {ThemeButton, LangIndexComponent},
  data() {
    return {
      showContent: false,
      isDarkTheme: false,
    }
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
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
    getProjectName() {
      return config.projectName;
    },
  },
  beforeMount() {
    this.initTheme();
    if (this.userData && this.userData[0] && this.userData[0].token) {
      this.$router.push("notes");
    } else {
      this.showContent = true;
    }
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
.home--form-container {
  width: 500px;
  margin: 30px auto 60px auto;
  padding-bottom: 35px;
}
.home--container {
  min-height: 100vh;
  //margin-bottom: 100px;
  box-sizing: border-box;
  padding-top: 1px;
}
@media (max-width: 700px) {
  .header {
    width: 98%;
  }
  .home--form-container {
    width: 98%;
  }
}
</style>