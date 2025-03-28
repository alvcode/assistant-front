<template>
  <div class="toggle-button--container" :class="{'toggle-button--flex-start': text, 'toggle-button--space-around': !text}">
    <div class="toggle-button-button shadow-card-sm">
      <div 
        @click="clickToggle"
        class="toggle-button--body" 
        :class="{'active': (mode === 'bool' && value === true) || (mode === 'int' && +value === 1)}"
      >
        <div class="toggle-button--ball">
          <f-awesome
              icon="moon"
              class="icon-check"
              v-show="(mode === 'bool' && value === true) || (mode === 'int' && +value === 1)"
          ></f-awesome>
          <f-awesome
              icon="sun"
              class="icon-check"
              v-show="(mode === 'bool' && value === false) || (mode === 'int' && +value === 0)"
          ></f-awesome>
        </div>
      </div>
    </div>
    <div class="toggle-button--text" v-if="text"> {{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "ThemeButton",
  data() {
    return {
      
    };
  },
  props: {
    mode: String, // bool - true/false; int - 1/0
    value: Number|Boolean,
    text: String, // Текст, который надо разместить рядом с кнопкой
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {
    
  },
  methods: {
    clickToggle(){
      if(this.mode === 'bool'){
        this.model = !this.model;
      }else if(this.mode === 'int'){
        if(+this.model === 1){
          this.model = 0;
        }else{
          this.model = 1;
        }
      }
    }
  },
  created() {}
};
</script>

<style scoped lang="less">
.toggle-button--flex-start{
  justify-content: flex-start;
}
.toggle-button--space-around{
  justify-content: space-around;
}
.toggle-button--container{
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;

  //&>.toggle-button-button{
  //  min-width: 50px;
  //}
  &>.toggle-button--text{
    margin-left: 5px;
  }
}
.toggle-button--body{
  display: inline-block;
  width: 38px;
  height: 21px;
  background-color: rgb(197, 197, 197);
  border-radius: 15px;
  position: relative;
  cursor: pointer;

  .toggle-button--ball{
    width: 21px;
    height: 21px;
    border-radius: 20px;
    background-color: #fff;
    border: 1px solid gray;
    position: absolute;
    text-align: center;
    top: 0;
    bottom: 0;
    margin: auto;

    .icon-check{
      font-size: 15px;
      color: #3c4959;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
  }

  &.active{
    background-color: #3c4959;
    .toggle-button--ball{
      top: 0;
      right: 0;

      .icon-check{
        display: inline;
      }
    }
  }

  &:not(.active){
    .toggle-button--ball{
      top: 0;
      left: 0;

      .icon-check{
        display: inline;
      }
    }
  }
}
</style>
