<template>
    <div v-show="isShow" class="preloader no-select">
      <img src="@/assets/img/loader_6.svg" />
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Preloader",
  computed: {
    ...mapState({
      isShow: state => state.preloader.isShow
    })
  },
  methods: {}
};
</script>

<style scoped lang="less">
.preloader {
  width: 100%;
  height: 100%;
  // background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  z-index: 200000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;

  & > img,
  div {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 50px;
  }
}
</style>
