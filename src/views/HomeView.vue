<template>
  <div class="home--container shadow-card">
    <div class="auth-title">
      <h3>MY-TAG</h3>
    </div>

    <div v-if="userData" class="account-card">
      <div class="email fs-16 text-bold mrg-b-5">{{userData[0].email}}</div>
      <div class="actions">
        <router-link tag="a" class="btn btn-sm btn-info" :to="`/contacts/`">
          <f-awesome :icon="['fas', 'sign-in-alt']" /> В личный кабинет
        </router-link>
        <div @click="logout" class="btn btn-sm btn-orange">Выйти</div>
      </div>
    </div>

    <div v-if="!userData" class="buttons mrg-t-25">
      <router-link tag="a" class="btn btn-sm btn-info" :to="`/login/`">
        <f-awesome :icon="['fas', 'sign-in-alt']" /> Войти
      </router-link>

      <router-link tag="a" class="btn btn-sm btn-orange" :to="`/register/`">
        <f-awesome :icon="['fas', 'user-plus']" /> Регистрация
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "HomeView",
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
    }
  },
}
</script>

<style scoped lang="less">
.home--container {
  width: 800px;
  min-height: 60vh;
  margin: 40px auto 100px auto;
  text-align: center;
}
</style>