<template>
  <div
    id="main-template-container"
    v-bind:class="{ 'main-template-min-sidebar': minSidebar }"
  >
    <div class="main-template--top-sidebar">
      <div class="main-template--top-sidebar--title">
        <h4>
          <router-link tag="a" :to="`/`"><b>myTag</b></router-link>
        </h4>
      </div>
      <div class="main-template--top-sidebar--humburger">
        <f-awesome
          @click="toggleSidebar"
          icon="bars"
          id="main-template-humburger"
        ></f-awesome>
        <!--            <i id="main-template-humburger" class="fas fa-bars"></i>-->
      </div>
      <div class="main-template--top-sidebar--bell">

      </div>
      <div class="main-template--top-sidebar--null">
        <div
          style="background-color:transparent;"
          class="btn-sm cursor-pointer noselect main-template--top-sidebar--notifications">
          <i class="fas fa-bell text-orange"></i>
          <span
            class="badge main-template--top-sidebar--notifications-count"
          ></span>
          <span
            class="display-none main-template--top-sidebar--notifications-list"
          >
          </span>
        </div>
      </div>

      <div class="main-template--top-sidebar--account no-select">
        <div
          @click="toggleAccountBar"
          class="no-select main-template--top-sidebar-email"
        >
          <div class="incognito-icon">
            <img width="30" src="@/assets/img/icons/incognito-form.svg">
          </div>
        </div>
        <div class="no-select main-template--top-sidebar-angle">
          <f-awesome class="angle-account" v-if="showAccountBar" @click="toggleAccountBar" :icon="['fas', 'angle-down']" />
          <f-awesome class="angle-account" v-if="!showAccountBar" @click="toggleAccountBar" :icon="['fas', 'angle-up']" />
        </div>

        <div @click="toggleAccountBar" v-show="showAccountBar" class="backside-account-more"></div>

        <div
          v-show="showAccountBar"
          class="main-template--top-sidebar--account-more"
        >
          <div class="head">
            <div>{{ userEmail }}</div>
          </div>
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

    <div class="main-template--left-sidebar no-select">
      <ul>
        <li>
          <router-link tag="a" :to="`/contacts/`">
            <div>
              <f-awesome :icon="['fas', 'users']" />
            </div>
            <div>
              Мои контакты
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <notificator></notificator>
    <preloader></preloader>

    <div v-if="showContent" class="main-template-content">
      <div class="main-template--page-title">
        <div>
          <div><slot name="page-title"></slot></div>
        </div>
        <div>
          <div><slot name="page-info"></slot></div>
        </div>
      </div>
      <slot name="page-content"></slot>
    </div>

  </div>
</template>

<script>

import Notificator from "@/components/Notificator.vue";
import Preloader from "@/components/Preloader.vue";


export default {
  name: "PanelMainTemplate",
  components: {Preloader, Notificator},
  data() {
    return {
      minSidebar: false,
      clientWidth: false,
      showContent: true,
      showAccountBar: false,
      userEmail: '',
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
    checkNewUserWindow(){
      let newUser = localStorage.getItem("newUser");
      if(newUser == '1'){
        this.newUserPopup.show = true;
        localStorage.removeItem('newUser');
      }
    }
  },
  created() {
    this.checkNewUserWindow();
    this.clientWidth = document.documentElement.clientWidth;
    if (this.clientWidth < 1000) {
      this.minSidebar = true;
    } else {
      this.minSidebar = false;
    }
    let userEmail = localStorage.getItem("confirmEmail");
    if(userEmail){
      this.userEmail = userEmail;
    }else{
      this.$router.push('/');
      this.$store.dispatch("stopPreloader");
    }
  }
};
</script>

<style scoped lang="less">
.main-template--page-title {
  display: inline-block;
  padding: 0 10px;
  box-sizing: border-box;
  margin-bottom: 25px;

  & > div:nth-of-type(1) {
    display: inline-block;
    color: #4f4f4f;
    font-weight: 400;
    font-size: 28px;
  }
  & > div:nth-of-type(2) {
    margin-top: 3px;
    font-size: 12px;
    color: gray;
  }
}
.main-template--top-sidebar {
  width: 100%;
  height: 40px;
  position: fixed;
  top: 0;
  background-color: #2b333c;
  color: #fff;
  line-height: 40px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  flex-direction: row;
  z-index: 3;

  .main-template--top-sidebar--humburger {
    width: 45px;
    font-size: 26px;
    position: relative;

    & > svg {
      cursor: pointer;
      transition: all 0.2s;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
    & > svg:hover {
      transform: scale(1.1);
    }
  }
  .main-template--top-sidebar--bell{
    width: 80px;
    text-align: center;
  }
  .main-template--top-sidebar--title {
    padding: 0 15px;

    & > h4 {
      line-height: 40px;
      font-size: 1.5rem;
    }
  }
  .main-template--top-sidebar--null {
    width: 70%;
  }
  .main-template--top-sidebar--account {
    width: 150px;
    text-align: right;
    padding-right: 20px;
    color: #f97979;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    flex-direction: row;

    .main-template--top-sidebar-email {
      width: 90%;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      margin-right: 8px;

      .incognito-icon{
        height: 40px;
        position: relative;

        img{
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          margin: auto 0;
        }
      }
    }

    .main-template--top-sidebar-angle{
      .angle-account{
        height: 20px;
      }
    }

    svg {
      display: inline-block;
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

    .main-template--top-sidebar--account-more {
      position: absolute;
      box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.25);
      top: 40px;
      right: 0;
      width: 180px;
      text-align: center;

      .head{
        font-size: 13px;
        text-align: left;
        background-color: #2b333c;
        color: #fff;
        padding: 5px 10px;
        box-sizing: border-box;
        line-height: 25px;
      }
      .links{
        text-align: left;
        padding: 5px 10px;
        background-color: #fff;
        line-height: 18px;
        margin-bottom: 12px;

        svg{
          height: 18px;
        }

        .item{
          //display: inline-block;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-around;
          flex-direction: row;
          color: #333;

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
}

.main-template--top-sidebar--notifications {
  display: none;
  position: relative;

  .main-template--top-sidebar--notifications-count {
    position: absolute;
    top: -2px;
    right: -5px;
    color: #fff;
    font-weight: 700;
  }
}
.main-template--top-sidebar--notifications-list {
  width: 200px;
  max-height: 250px;
  overflow: auto;
  position: absolute;
  top: 35px;
  left: 0;
  padding: 18px;
  background-color: #fff;
  color: #333;
  -webkit-box-shadow: 0px 5px 89px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 5px 89px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 5px 89px 0px rgba(0, 0, 0, 0.75);
}
.main-template--top-sidebar--not-item {
  width: 100%;
  margin-top: 12px;
  border-bottom: 0.55px solid #f97979;

  & > div:nth-of-type(1) {
    font-size: 13px;
    /*font-weight: 700;*/
    color: #2b333c;
  }
  & > div:nth-of-type(2) {
    font-size: 11px;
  }
}

.main-template-min-sidebar {
  .main-template-content {
    position: relative;
    margin-left: 0;
  }
  .main-template--left-sidebar {
    display: none;
  }
}
.main-template-content {
  padding-bottom: 35px;
  padding-left: 5px;
  padding-right: 5px;
  box-sizing: border-box;
  margin-top: 45px;
  margin-left: 220px;
}
.main-template--left-sidebar {
  position: fixed;
  top: 40px;
  left: 0;
  bottom: 0;
  width: 210px;
  background-color: #182b49;
  padding: 35px 0 35px 0;
  overflow: auto;
  -webkit-box-shadow: 2px 1px 12px 0px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 2px 1px 12px 0px rgba(50, 50, 50, 0.75);
  box-shadow: 2px 1px 12px 0px rgba(50, 50, 50, 0.75);

  & > ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      width: 90%;
      margin: 0 auto;
      margin-top: 3px;
      padding-top: 6px;

      a {
        font-size: 14px;
        color: #ffffff;
        display: inline-block;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        flex-direction: row;
        padding: 10px 0;
        box-sizing: border-box;

        & > div:nth-of-type(1) {
          width: 25%;
          font-size: 12px;
          text-align: center;
        }
        & > div:nth-of-type(2) {
          width: 75%;
          font-size: 13px;
        }
      }
      a:hover svg {
        transform: scale(1.1);
      }
    }
    a.router-link-active {
      border-radius: 10px;
      background-color: #2a4063;
      box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.25);
    }
  }
}
@media (max-width: 700px) {
  .main-template--top-sidebar {

    .main-template--top-sidebar--humburger {
      width: 25%;
    }
    .main-template--top-sidebar--bell{
      width: 80px;
    }
    .main-template--top-sidebar--title {
      & > h4 {
        font-size: 1.2rem;
      }
    }
    .main-template--top-sidebar--null {
      width: 70%;
    }
  }
}
@media (max-width: 480px) {
  .main-template--top-sidebar {

    .main-template--top-sidebar--humburger {
      width: 25%;
    }
    .main-template--top-sidebar--bell{
      width: 80px;
    }
    .main-template--top-sidebar--title {
      display: none;
      & > h4 {
        font-size: 1rem;
      }
    }
    .main-template--top-sidebar--null {
      width: 30%;
    }
  }
}
</style>
