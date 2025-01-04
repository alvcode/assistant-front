<template>
  <div class="home--container">
    <div class="container">
      <div class="home--form-container shadow-card text-center">
        <div class="auth-title">
          <h3>Assistant</h3>
        </div>

        <div v-if="userData" class="account-card">
          <div class="email fs-16 text-bold mrg-b-5">{{userData[0].email}}</div>
          <div class="actions">
            <router-link tag="a" class="btn btn-sm btn-info" :to="`/notes/`">
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
  .home--form-container {
    width: 98%;
  }
}
</style>