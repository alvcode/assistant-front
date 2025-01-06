<template>
  <div class="lang-index--container">
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

    <div @click="toggleLang" v-show="showLang" class="backside-click-background"></div>
  </div>
</template>

<script>

export default {
  name: "LangIndexComponent",
  data() {
    return {
      showLang: false,
      selectedLocaleId: "",
      localeList: [
        {id: "ru", name: "RU"},
        {id: "en", name: "EN"},
      ],
    }
  },
  computed: {
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
    toggleLang() {
      this.showLang = !this.showLang;
    },
  },
  created() {
    this.selectedLocaleId = this.$i18n.locale;
  },
};
</script>

<style scoped lang="less">
.lang {
  width: 80px;
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
.backside-click-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  transform: translate3d(0, 0, 0);
}
</style>
