<template>
  <div class="drive-breadcrumbs--container">
    <div class="main-content">
      <div class="breadcrumbs">
        <div class="item" v-if="getAllExceptLastTwo.length > 0">
          <div
              @click="toggleHamburgerMenu"
              class="hamburger"
          >
            <f-awesome icon="bars"></f-awesome>
          </div>
          <div v-show="showHamburgerMenu" class="hamburger-menu shadow-card">
            <div
                class="hm-item"
                v-for="(item, index) in getAllExceptLastTwo"
                :key="index"
                @click="toParent(item.parentId)"
            >
              {{ item.name }}
            </div>
          </div>
          <div
              v-show="showHamburgerMenu"
              @click="toggleHamburgerMenu"
              class="hamburger-menu-back"
          ></div>
        </div>
        <div class="item font-normal" v-if="getAllExceptLastTwo.length > 0">
          <f-awesome icon="angle-right"></f-awesome>
        </div>
        <div class="item" :class="{'font-normal': !compact, 'font-compact': compact}" v-for="(item,index) in getLastTwoElements" :key="index">
          <span v-if="item.type === 'element'" @click="toParent(item.parentId)" class="element">
            {{ item.name }}
          </span>
          <span v-if="item.type === 'angle'" class="font-normal">
            <f-awesome icon="angle-right"></f-awesome>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "DriveBreadcrumbs",
  emits: ["fallTo"],
  components: {},
  data() {
    return {
      showHamburgerMenu: false,
    }
  },
  props: {
    breadcrumbs: Array,
    compact: Boolean,
  },
  computed: {
    getLastTwoElements() {
      if (this.breadcrumbs.length === 0) return [];

      if (this.breadcrumbs.length === 1) {
        let obj = this.breadcrumbs[0];
        obj.type = 'element';
        return [obj];
      }

      let result = [];

      let obj = this.breadcrumbs[this.breadcrumbs.length - 2];
      obj.type = 'element';
      result.push(obj);

      result.push({type: 'angle'});

      obj = this.breadcrumbs[this.breadcrumbs.length - 1];
      obj.type = 'element';
      result.push(obj);

      return result;
    },
    getAllExceptLastTwo() {
      if (this.breadcrumbs.length <= 2) return [];
      return this.breadcrumbs.slice(0, -2);
    }
  },
  methods: {
    toParent(parentId) {
      this.$emit("fallTo", parentId);
      this.showHamburgerMenu = false;
    },
    toggleHamburgerMenu() {
      this.showHamburgerMenu = !this.showHamburgerMenu;
    },
  },
  created() {

  }
};
</script>

<style scoped lang="less">

.main-content {
  width: 100%;
}
.breadcrumbs {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  flex-direction: row;
  cursor: pointer;

  .hamburger {
    font-size: 22px;
  }

  .font-normal {
    font-size: 20px;
  }
  .font-compact {
    font-size: 16px;
  }

  .item {
    line-height: 18px;
    margin-right: 10px;
    margin-left: 10px;
    position: relative;

    & > .element:hover {
      text-decoration: underline;
    }

    .hamburger-menu {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 2;
      width: 240px;

      .hm-item {
        font-size: 16px;
        margin: 10px 0;
      }
      .hm-item:hover {
        text-decoration: underline;
      }
    }
    .hamburger-menu-back {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      margin: auto;
      background-color: transparent;
      z-index: 1;
    }
  }
}

@media (max-width: 1380px) {

}
</style>
