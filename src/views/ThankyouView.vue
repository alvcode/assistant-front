<template>
  <div class="thankyou">
    <div class="thankyou--container">
      <div class="header">
        <div class="header-lang">
          <lang-index-component></lang-index-component>
        </div>
      </div>
      <div class="container shadow-card">
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
            class="btn btn-sm btn-info"
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

export default {
  name: "ThankyouView",
  components: {
    LangIndexComponent

  },
  computed: {},
  data() {
    return {
      sendButton: localStorage.getItem("confirmEmail")
    };
  },
  methods: {
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
  created() {
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

  .header-lang {
    display: inline-block;
  }
}
.thankyou--container {
  text-align: center;
  padding: 15px 0;
  min-height: 75vh;
  box-sizing: border-box;
}
</style>
