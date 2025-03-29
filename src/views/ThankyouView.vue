<template>
  <div class="thankyou view" :class="{'dark-theme': isDarkTheme === true, 'light-theme': isDarkTheme === false}">
    <div class="thankyou--container">
      <div class="header">
        <div class="header-actions">
          <theme-button :mode="'bool'" :value="isDarkTheme" @input="setIsDarkTheme"></theme-button>
          <lang-index-component></lang-index-component>
        </div>
      </div>
      <div class="container shadow-card mrg-t-25">
        <h3>{{ $t('app_thank_for_choosing') }} {{ getProjectName() }}!</h3>
        <p>
          {{ $t('app_you_can_login') }}
        </p>
<!--        <p>-->
<!--          Если вы не получили письмо в течение 5 минут (проверьте папку СПАМ),-->
<!--          то воспользуйтесь кнопкой повторной отправки-->
<!--        </p>-->

<!--        <div-->
<!--            v-if="sendButton"-->
<!--            @click="sendConfirm"-->
<!--            class="btn btn-sm btn-orange"-->
<!--        >-->
<!--          Отправить повторно-->
<!--        </div>-->
        <router-link
            class="btx btx-sm btx-info"
            tag="a"
            :to="`/login`"
        >
          {{ $t('app_sign_in') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import LangIndexComponent from "@/components/LangIndexComponent.vue";
import config from "@/config.js";
import ThemeButton from "@/components/ui/ThemeButton.vue";

export default {
  name: "ThankyouView",
  components: {
    ThemeButton,
    LangIndexComponent

  },
  computed: {},
  data() {
    return {
      sendButton: localStorage.getItem("confirmEmail"),
      isDarkTheme: false,
    };
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
    sendConfirm() {
      this.$store.dispatch("startPreloader");
      let userEmail = localStorage.getItem("confirmEmail");
      this.$store
          .dispatch("sendConfirm", { userEmail })
          .then(() => {
            this.sendButton = false;
            localStorage.removeItem("confirmEmail");
            this.$store.dispatch("stopPreloader");
          })
          .catch(err => {
            alert(err.message);
            // this.errorText = err.message;
            this.$store.dispatch("stopPreloader");
          });
    },
    getProjectName() {
      return config.projectName;
    }
  },
  async created() {
    this.initTheme();
    if (this.userData) {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped lang="less">
.header {
  width: 500px;
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
.thankyou--container {
  text-align: center;
  padding: 15px 0;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
