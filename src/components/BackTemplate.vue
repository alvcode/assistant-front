<template>
  <div class="back-template--container">
    <div class="back-template--content">
      <div class="left">
        <div class="logo">
          <h4>
            <router-link tag="a" :to="`/`"><b>Assistant</b></router-link>
          </h4>
        </div>
        <div class="menu">
          <ul>
            <li>
              <router-link tag="a" :to="`/notes/`">
                <div>
                  <f-awesome :icon="['fas', 'note-sticky']" />
                </div>
                <div>
                  Заметки
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="right">
        <div class="right--main-content">

          <div class="top-bar">
            <div class="top-bar--left">
              <div class="page-title">
                <slot name="page-title"></slot>
              </div>
            </div>
            <div class="top-bar--right">
              <div class="account shadow-card">
                <div class="above no-select" @click="toggleAccountBar">
                  <div class="username">{{ userLogin }}</div>
                  <div class="toggle-account">
                    <f-awesome class="angle-account" v-if="showAccountBar" :icon="['fas', 'angle-down']" />
                    <f-awesome class="angle-account" v-if="!showAccountBar" :icon="['fas', 'angle-up']" />
                  </div>
                </div>
                <div class="inside shadow-card" v-show="showAccountBar">
                  <div class="links">
                    <div @click="logout" class="item mrg-t-15">
                      <div>
                        <f-awesome icon="power-off"></f-awesome>
                      </div>
                      <div class="text-underline">
                        Выйти
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="page-content">
            <slot name="page-content"></slot>
          </div>

        </div>
      </div>
    </div>

    <div @click="toggleAccountBar" v-show="showAccountBar" class="backside-account-more"></div>

    <notificator></notificator>
    <preloader></preloader>
  </div>
</template>

<script>

import Notificator from "@/components/Notificator.vue";
import Preloader from "@/components/Preloader.vue";


export default {
  name: "BackTemplate",
  components: {Preloader, Notificator},
  data() {
    return {
      minSidebar: false,
      clientWidth: false,
      showContent: true,
      showAccountBar: false,
      userLogin: '',
      newUserPopup: {
        show: false,
        closeButton: "Закрыть",
      },
    };
  },
  computed: {

  },
  methods: {
    toggleSidebar() {
      this.minSidebar = !this.minSidebar;
      if (this.minSidebar === false && this.clientWidth < 1000) {
        this.showContent = false;
      } else {
        this.showContent = true;
      }
    },
    toggleAccountBar() {
      this.showAccountBar = !this.showAccountBar;
    },
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
  },
  created() {
    this.clientWidth = document.documentElement.clientWidth;
    if (this.clientWidth < 1000) {
      this.minSidebar = true;
    } else {
      this.minSidebar = false;
    }

    let userLogin = localStorage.getItem("userLogin");
    if(userLogin){
      this.userLogin = userLogin;
    }else{
      this.$router.push('/');
      this.$store.dispatch("stopPreloader");
    }
  }
};
</script>

<style scoped lang="less">
.back-template--container {
  width: 100%;
  height: 100vh;
  background-color: #1b1c30;
}
.back-template--content {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;

  .left {
    width: 300px;
    height: 100vh;

    .logo {
      color: #fff;
      text-align: center;
      margin-top: 20px;
      font-size: 26px;
    }
    .menu {
      margin-top: 10px;

      & > ul {
        list-style-type: none;
        padding: 0;
        margin: 0;

        li {
          width: 90%;
          margin: 3px auto 0;
          padding-top: 6px;

          a {
            //font-size: 15px;
            color: #ffffff;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-around;
            flex-direction: row;
            padding: 10px 0;
            box-sizing: border-box;

            & > div:nth-of-type(1) {
              width: 25%;
              font-size: 16px;
              text-align: center;
            }
            & > div:nth-of-type(2) {
              width: 75%;
              font-size: 15px;
            }
          }
          a:hover svg {
            transform: scale(1.1);
          }
        }
        a.router-link-active {
          border-radius: 10px;
          background-color: #2a4063;
          box-shadow: 0 5px 9px 0 rgba(0, 0, 0, 0.25);
        }
      }
    }
  }
  .right {
    width: 90%;
    //background-color: #fafefd;
    height: 100vh;
    position: relative;

    .right--main-content {
      position: absolute;
      background-color: #fafefd;
      top: 10px;
      bottom: 10px;
      right: 0;
      left: 0;
      margin: auto;
      border-radius: 30px;

      .top-bar {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 14px 30px;

        .top-bar--left {
          width: 49%;

          .page-title {
            font-size: 22px;
            font-weight: 700;
          }
        }
        .top-bar--right {
          width: 49%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: right;
        }
      }
    }
  }
}
.account {
  width: 160px;
  position: relative;

  .above {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    cursor: pointer;

    .username {
      width: 130px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700;
    }
    .toggle-account {
      width: 30px;
      text-align: center;
      color: #f97979;
    }
  }
  .inside {
    position: absolute;
    top: 50px;
    right: 0;
    width: 160px;
    text-align: center;
    z-index: 2;

    .links{
      text-align: center;
      padding: 5px 0;
      background-color: #fff;
      line-height: 17px;
      margin-bottom: 5px;

      svg{
        height: 17px;
      }

      .item{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        flex-direction: row;
        color: #333;
        cursor: pointer;

        &>div:nth-of-type(1){
          width: 20%;
          color: #f97979;
        }
        &>div:nth-of-type(2){
          width: 77%;
          color: #333;
        }
      }
    }
  }
}
.backside-account-more{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  transform: translate3d(0, 0, 0);
}
</style>
