<template>
  <div class="drive-archive-line--container">
    <div class="main-content">
      <div class="line-container alert alert-sm alert-success mrg-t-20" v-if="isExistsArchive === true"></div>
    </div>
  </div>
</template>

<script>
import longPollingBus from "@/services/longPollingBus.js";

export default {
  name: "DriveArchiveLine",
  emits: [],
  components: {},
  data() {
    return {
      isExistsArchive: true,
    }
  },
  props: {

  },
  computed: {

  },
  methods: {
    handleArchiveStatusUpdate(payload) {
      console.log(payload);
    },
  },
  created() {
    this.unsubscribe = longPollingBus.subscribe("archiveStatusUpdate", this.handleArchiveStatusUpdate);
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
</script>

<style scoped lang="less">

.main-content {
  width: 100%;
}

@media (max-width: 1380px) {

}
</style>
