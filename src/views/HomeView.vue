<template>
  <div class="home--container" v-show="showContent">
    <div class="container">
      <div class="header">
        <div class="header-lang">
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
            <router-link tag="a" class="btn btn-sm btn-info" :to="`/notes/`">
              <f-awesome :icon="['fas', 'sign-in-alt']" /> {{ $t('app_to_panel') }}
            </router-link>
            <div @click="logout" class="btn btn-sm btn-orange">{{ $t('app_logout') }}</div>
          </div>
        </div>

        <div v-if="!userData" class="buttons mrg-t-25">
          <router-link tag="a" class="btn btn-sm btn-info" :to="`/login/`">
            <f-awesome :icon="['fas', 'sign-in-alt']" /> {{ $t('app_sign_in') }}
          </router-link>

          <router-link tag="a" class="btn btn-sm btn-orange" :to="`/register/`">
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

export default {
  name: "HomeView",
  components: {LangIndexComponent},
  data() {
    return {
      showContent: false,
    }
  },
  computed: {
    ...mapState({
      userData: state => state.authorization.userData
    })
  },
  methods: {
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
  width: 500px;
  margin: 10px auto;
  text-align: center;

  .header-lang {
    display: inline-block;
  }
}
.home--form-container {
  width: 500px;
  margin: 30px auto 60px auto;
  padding-bottom: 35px;
}
.home--container {
  min-height: 65vh;
  margin-bottom: 100px;
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