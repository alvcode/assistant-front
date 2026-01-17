<template>
  <transition name="fade">
    <div v-show="show" class="pop-up" id="popup" @click.self="handleCloseIfClickBack">
      <div
        v-bind:class="{
          'pop_up__modal_lg': size === 'lg',
          'pop_up__modal_sm': size !== 'lg' && size !== 'full',
          'pop_up__modal_full': size === 'full',
        }"
        class="modal"
      >
        <div class="pop-up--content">
          <div class="pop-up--modal-header">
            <div class="pop-up--title">
              <slot name="header"></slot>
            </div>
            <div v-on:click="closePopup" class="pop-up--close cursor-pointer">
              <f-awesome icon="times"></f-awesome>
            </div>
          </div>
          <div class="pop-up--modal-body">
            <slot name="body"></slot>
          </div>
          <div class="pop-up--modal-footer">
            <div
              v-on:click="closePopup"
              v-if="closeButtonShow"
              class="btx btx-sm btx-danger"
            >
              {{ closeButton }}
            </div>
            <div
              v-on:click="actionPopup"
              v-if="actionButtonShow"
              class="btx btx-sm"
              v-bind:class="actionClass"
            >
              {{ actionButton }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * $emit closePopup
 * $emit actionPopup
 */
export default {
  name: "Popup",
  data() {
    return {
      overflowIsHidden: false
    }
  },
  props: {
    show: Boolean, // true/false - Показать/Скрыть
    closeButton: String, // Название кнопки, которая скрывает окно
    actionButton: String, // Название кнопки какого-либо действия
    actionClass: String, // Класс кнопки действия, например btn-success
    size: String, // 'lg' - широкое окно, если не указывать- узкое окно
    dontHideOverflow: Boolean, // Если true - не скрывает прокрутку при открытии
    closeIfClickBack: Boolean, // Если true, то popup будет скрываться при клике на пустую область
    scrollTopCounter: Number, // Крутим счетчик на +1 и страница прокручивается вверх
  },
  watch: {
    show: function(val) {
      if (val === true && !this.dontHideOverflow) {
        // Если во время открытия overflow уже 'hidden', то значит какому-то компоненту это нужно и не будем менять при закрытии
        if(document.body.style.overflow === 'hidden'){
          this.overflowIsHidden = true;
        }
        document.body.style.overflow = "hidden";
      } else {
        if(!this.overflowIsHidden){
          document.body.style.overflow = "auto";
        }
      }
    },
    scrollTopCounter: function() {
      setTimeout(() => {
        document.getElementById('popup').scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 400);
    },
  },
  computed: {
    closeButtonShow() {
      return !!this.closeButton;
    },
    actionButtonShow() {
      return !!this.actionButton;
    }
  },
  methods: {
    handleCloseIfClickBack() {
      if (this.closeIfClickBack) {
        this.closePopup();
      }
    },
    closePopup() {
      this.$emit("closePopup");
    },
    actionPopup() {
      this.$emit("actionPopup");
    }
  }
};
</script>

<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.pop-up {
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  z-index: 199999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.light-theme .modal {
  background-color: #fff;
}
.dark-theme .modal {
  background: rgba(60, 60, 62, 1);
}

//.pop_up__background-white{
//  background-color: #fff;
//}
//.pop_up__background-wgray{
//  background-color: #f0f0fb;
//}
.pop_up__modal_sm {
  max-width: 500px;
  margin: 20px auto 20px auto;
  border-radius: 5px;
  padding: 15px;
  box-sizing: border-box;
  z-index: 199999;
}
.pop_up__modal_lg {
  max-width: 750px;
  margin: 20px auto 20px auto;
  border-radius: 5px;
  padding: 15px;
  box-sizing: border-box;
  z-index: 199999;
}
.pop_up__modal_full{
  width: 100%;
  height: 100vh;
  //background-color: #fff;
  margin: 0;
  padding: 25px;
  box-sizing: border-box;
  z-index: 199999;
}
.pop-up--modal-header {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  //color: #4f4f4f;
}
.pop-up--title {
  width: 90%;
  margin-top: 5px;
  font-size: 18px;
  font-weight: 500;
  word-break: break-all;
}
.pop-up--modal-body {
  padding: 15px 5px;
  box-sizing: border-box;
  //color: #4f4f4f;
  //font-size: 14px !important;
  font-weight: 400;
}
.pop-up--modal-footer {
  padding: 10px 5px;
  box-sizing: border-box;
  text-align: right;
}
.pop-up--close{
  width: 6%;
  font-size: 24px;
}
@media (max-width: 700px) {
  .pop_up__modal_sm {
    padding: 9px;
  }
  .pop_up__modal_lg {
    padding: 9px;
  }
  .pop_up__modal_full{
    padding: 15px;
  }
}
</style>
