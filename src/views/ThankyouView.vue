<template>
  <div class="thankyou">
    <div class="thankyou--container">
      <div class="container shadow-card">
        <h3>Спасибо, что выбрали MY-TAG!</h3>
        <h4>
          Пожалуйста, перейдите по ссылке, которая была отправлена вам на почту
          для подтверждения!
        </h4>
        <p>
          Если вы не получили письмо в течение 5 минут (проверьте папку СПАМ),
          то воспользуйтесь кнопкой повторной отправки
        </p>

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
          Войти в личный кабинет
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ThankyouView",
  components: {

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
.thankyou--container {
  text-align: center;
  padding: 55px 0;
  min-height: 75vh;
  box-sizing: border-box;
}
</style>
