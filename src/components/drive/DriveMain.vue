<template>
  <div class="drive-main--container">
    <div class="main-content">
      <div class="space">
        <drive-space :space-obj="space"></drive-space>
      </div>
    </div>
  </div>
</template>

<script>

import DriveSpace from "@/components/drive/DriveSpace.vue";
import driveRepository from "@/repositories/drive/index.js";

export default {
  name: "DriveMain",
  components: {DriveSpace},
  data() {
    return {
      space: {total: 0, used: 0}
    }
  },
  computed: {

  },
  methods: {
    getSpace() {
      this.$store.dispatch("startPreloader");
      driveRepository.getSpace().then(resp => {
        this.space = resp.data;
        this.$store.dispatch("stopPreloader");
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.$store.dispatch("stopPreloader");
      });
    }
  },
  created() {
    this.getSpace();
  }
};
</script>

<style scoped lang="less">
//.main-content {
//  display: flex;
//  flex-wrap: nowrap;
//  justify-content: space-between;
//  flex-direction: row;
//}
.space {
  display: flex;
  //flex-direction: column;
  justify-content: right;
}
@media (max-width: 1380px) {
  //.main-content {
  //  flex-wrap: wrap;
  //  flex-direction: column-reverse;
  //}
}
</style>
