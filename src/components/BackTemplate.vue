<template>
  <div class="back-template--container">
    <div class="back-template--content">
      <div class="left" v-bind:class="{ 'min-sidebar': !isDesktop, 'max-sidebar': isDesktop }">
        <div class="sidebar-content" v-show="showMainSidebar">
          <left-sidebar></left-sidebar>
        </div>
      </div>
      <div class="right" v-bind:class="{ 'min-sidebar': !isDesktop, 'max-sidebar': isDesktop }">
        <div class="right--main-content">

          <div class="top-bar">
            <div class="top-bar--left">
              <div class="hamburger" v-if="!isDesktop">
                <div class="hamburger-block" @click="toggleMobileSidebar">
                  <f-awesome
                      icon="bars"
                      id="main-template-humburger"
                  ></f-awesome>
                </div>
              </div>
              <div class="page-title">
                <slot name="page-title"></slot>
              </div>
            </div>
            <div class="top-bar--right">
              <div class="lang shadow-card cursor-pointer" :class="{'active': showLang}" @click.self="toggleLang">
                <div class="above" @click="toggleLang">
                  <div class="icon">
                    <f-awesome class="angle-account" :icon="['fas', 'globe']" />
                  </div>
                  <div class="name">{{currentLocale.name}}</div>
                </div>
                <div class="inside shadow-card" v-show="showLang">
                  <div @click="clickSelectLang(item.id)" class="item" v-for="item in notSelectedLocales" :key="item.id">
                    {{item.name}}
                  </div>
                </div>
              </div>
              <div class="bell shadow-card cursor-pointer" :class="{'active': showBell}" @click.self="toggleBell">
                <div class="above" @click="toggleBell">
                  <f-awesome class="angle-account" :icon="['fas', 'bell']" />
                </div>
                <div class="inside shadow-card" v-show="showBell">
                  <div class="item">Тут текст уведомления ла-ла-ла</div>
                  <div class="item">Тут еще один текст уведомления ла-ла-ла</div>
                </div>
              </div>
              <div class="account shadow-card cursor-pointer" :class="{'active': showAccountBar}" @click.self="toggleAccountBar">
                <div class="above no-select" @click="toggleAccountBar">
                  <div class="username">{{ userLogin }}</div>
                  <div class="toggle-account">
                    <f-awesome class="angle-account" v-if="showAccountBar" :icon="['fas', 'angle-down']" />
                    <f-awesome class="angle-account" v-if="!showAccountBar" :icon="['fas', 'angle-up']" />
                  </div>
                </div>
                <div class="inside shadow-card" v-show="showAccountBar">
                  <div class="links">
                    <div @click="logout" class="item">
                      <div>
                        <f-awesome icon="power-off"></f-awesome>
                      </div>
                      <div class="text-underline">
                        {{ $t('app_logout') }}
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

    <div @click="toggleAccountBar" v-show="showAccountBar" class="backside-click-background"></div>
    <div @click="toggleBell" v-show="showBell" class="backside-click-background"></div>
    <div @click="toggleLang" v-show="showLang" class="backside-click-background"></div>

    <transition name="fade">
      <div class="floating-left-sidebar" v-show="showMobileSidebar">
        <div class="left">
          <left-sidebar></left-sidebar>
        </div>
        <div class="right" @click="toggleMobileSidebar"></div>
      </div>
    </transition>

    <notificator></notificator>
    <preloader></preloader>
  </div>
</template>

<script>
const MOBILE_WIDTH_STEP = 1100;

import Notificator from "@/components/Notificator.vue";
import Preloader from "@/components/Preloader.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";

export default {
  name: "BackTemplate",
  components: {LeftSidebar, Preloader, Notificator},
  data() {
    return {
      showMainSidebar: true,
      showMobileSidebar: false,
      clientWidth: false,
      showAccountBar: false,
      showBell: false,
      showLang: false,
      selectedLocaleId: "",
      localeList: [
        {id: "ru", name: "RU"},
        {id: "en", name: "EN"},
      ],
      userLogin: '',
    };
  },
  computed: {
    isDesktop() {
      let result = true;
      if (this.clientWidth < MOBILE_WIDTH_STEP) {
        result = false;
      }
      return result;
    },
    notSelectedLocales() {
      let result = [];
      for (let key in this.localeList) {
        if (this.localeList[key].id !== this.selectedLocaleId) {
          result[result.length] = this.localeList[key];
        }
      }
      return result;
    },
    currentLocale() {
      let result = null;
      if (this.selectedLocaleId !== "") {
        for (let key in this.localeList) {
          if (this.localeList[key].id === this.selectedLocaleId) {
            result = this.localeList[key];
          }
        }
      }
      return result;
    },
  },
  methods: {
    clickSelectLang(langId) {
      this.selectLanguage(langId);
      this.toggleShowList();
    },
    selectLanguage(langId) {
      localStorage.setItem('lang', langId);
      this.reloadPage();
    },
    reloadPage() {
      window.location.reload();
    },
    toggleShowList() {
      this.showList = !this.showList;
    },
    handleResize() {
      this.clientWidth = document.documentElement.clientWidth;
      this.initSidebars(this.clientWidth);
    },
    initSidebars(clientWidth) {
      this.showMobileSidebar = false;
      this.showMainSidebar = clientWidth >= MOBILE_WIDTH_STEP;
    },
    toggleMobileSidebar() {
      this.showMobileSidebar = !this.showMobileSidebar;
    },
    toggleAccountBar() {
      this.showAccountBar = !this.showAccountBar;
    },
    toggleBell() {
      this.showBell = !this.showBell;
    },
    toggleLang() {
      this.showLang = !this.showLang;
    },
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
  },
  created() {
    this.clientWidth = document.documentElement.clientWidth;
    this.initSidebars(this.clientWidth);

    let userLogin = localStorage.getItem("userLogin");
    if (userLogin) {
      this.userLogin = userLogin;
    } else {
      this.$router.push('/');
      this.$store.dispatch("stopPreloader");
    }

    this.selectedLocaleId = this.$i18n.locale;
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped lang="less">
.floating-left-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  z-index: 9999;

  .left {
    width: 300px;
    background-color: #1b1c30;
  }
  .right {
    width: 90%;
    background: rgba(27, 28, 48, 0.4);
    cursor: pointer;
  }
}
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
    height: 100vh;

    &.min-sidebar {
      width: 0;
    }
    &.max-sidebar {
      width: 280px;
    }
  }
  .right {
    height: 100vh;
    position: relative;

    &.min-sidebar {
      width: 100%;
    }
    &.max-sidebar {
      width: 90%;
    }

    .right--main-content {
      position: absolute;
      background-color: #fafefd;
      top: 10px;
      bottom: 10px;
      right: 10px;
      left: 10px;
      margin: auto;
      border-radius: 30px;

      .top-bar {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 14px 30px;

        .top-bar--left {
          width: 50%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: left;

          .hamburger {
            margin-right: 25px;
            cursor: pointer;

            .hamburger-block {
              width: 30px;
              height: 30px;
              background-color: #1b1c30;
              color: #fff;
              text-align: center;
              line-height: 30px;
              border-radius: 20px;
            }
          }

          .page-title {
            font-size: 22px;
            font-weight: 700;
          }
        }
        .top-bar--right {
          width: 50%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: right;

          & > div {
            margin-left: 10px;
          }
        }
      }

      .page-content {
        padding: 5px 20px;
      }
    }
  }
}

// ================ account ===========
.account {
  width: 160px;
  position: relative;

  &.active {
    background-color: #F97979;
  }

  .above {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;

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
      //padding: 5px 0;
      background-color: #fff;
      line-height: 17px;

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
.backside-click-background{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  transform: translate3d(0, 0, 0);
}

// ================ bell ===========
.bell {
  position: relative;

  &.active {
    background-color: #F97979;
  }

  .inside {
    position: absolute;
    top: 50px;
    right: 0;
    width: 200px;
    z-index: 2;
    background-color: #fff;

    .item {
      margin-bottom: 9px;
    }
  }
}

// ================ lang ===========
.lang {
  position: relative;

  &.active {
    background-color: #F97979;
  }

  .above {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    flex-direction: row;

    .icon {
      margin-right: 7px;
    }
  }

  .inside {
    position: absolute;
    top: 50px;
    right: 0;
    width: 50px;
    z-index: 2;
    background-color: #fff;

    .item {
      text-align: center;
      line-height: 20px;
      cursor: pointer;
    }
  }
}

.fade-enter-active {
  transition: all .3s ease;
}
.fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter, .fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
@media (max-width: 550px) {
  .back-template--content {
    .right {
      .right--main-content {
        .top-bar {
          flex-wrap: wrap;
          flex-direction: column-reverse;
          padding: 10px 15px;

          .top-bar--left {
            margin-top: 12px;
            width: 100%;
          }
          .top-bar--right {
            width: 100%;
            flex-wrap: nowrap;

            & > div {
              margin-left: 6px;
            }
          }
        }
        .page-content {
          padding: 5px 8px;
        }
      }
    }
  }
  .bell {
    .inside {
      top: 50px;
      left: 0;
    }
  }
}
</style>
