<template>
  <div class="notificator no-select">
    <transition-group name="slide-fade">
      <div
        v-for="item in list"
        v-bind:key="item.id"
        class="notificator--item"
        v-bind:class="{
          not_danger: item.color === 'danger',
          not_success: item.color === 'success',
          not_warning: item.color === 'warning'
        }"
      >
        <div @click="removeNotification(item)" class="notificator--close">
          <f-awesome icon="times"></f-awesome>
        </div>
        {{ item.text }}
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Notificator",
  computed: {
    ...mapState({
      list: state => state.notificator.list
    })
  },
  methods: {
    removeNotification(item) {
      this.$store.dispatch("removeNotification", item.id);
    }
  }
};
</script>

<style scoped lang="less">
.notificator {
  position: fixed;
  z-index: 99999999999999;
  top: 20px;
  right: 20px;
}
.notificator--item {
  width: 270px;
  text-align: center;
  padding: 18px;
  box-sizing: border-box;
  margin-bottom: 10px;
  color: #fff;
  border-radius: 10px;
  font-size: 15px;
  box-shadow: 1px 5px 9px 1px rgba(0, 0, 0, 0.55);
  font-weight: 500;
  position: relative;
}
.notificator--close {
  display: inline-block;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 9px;
}
.light-theme {
  .not_danger {
    background-color: #fdb7bd;
    color: #842029;
  }
  .not_success {
    background-color: rgb(179, 251, 176);
    color: #333;
  }
}
.dark-theme {
  .not_danger {
    background-color: #7e3435;
    color: #f5cacb;
  }
  .not_success {
    background-color: #477a4c;
    color: #c8e6c9;
  }
}
//.not_danger {
//  background-color: rgba(220, 53, 69, 0.95);
//}
//.not_success {
//  background-color: rgba(49, 199, 154, 0.95);
//}
//.not_warning {
//  background-color: rgba(255, 193, 7, 0.95);
//}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
