<template>
  <div class="drive-open-file--container">
    <div class="icon">
      <f-awesome :icon="iconName"></f-awesome>
    </div>
    <div class="name">{{ name }}</div>
    <div class="download-icon">
      <div @click="download" class="btx btx-sm btx-info">
        <span v-if="!isDownloading"><f-awesome icon="download"></f-awesome></span>
        <span v-if="isDownloading"><f-awesome icon="spinner" spin></f-awesome></span>
        {{ $t('app_download') }}
      </div>
    </div>
    <div class="mrg-t-20" v-show="isDownloading">
      <progress-line :percent="progress"></progress-line>
    </div>
  </div>
</template>

<script>
import fileIconMixin from "@/components/mixins/fileIconMixin.js";
import ProgressLine from "@/components/ProgressLine.vue";

export default {
  name: "DriveOpenFile",
  components: {ProgressLine},
  emits: ["download"],
  mixins: [fileIconMixin],
  data() {
    return {
      name: '',
      iconName: 'question'
    }
  },
  props: {
    file: Object,
    isDownloading: Boolean,
    progress: Number
  },
  watch: {
    file: function(file) {
      this.setData(file);
    }
  },
  methods: {
    setData(file) {
      if (file.id > 0) {
        this.name = file.name;
        this.iconName = this.getIconNameByFilename(file.name);
      } else {
        this.name = '-';
        this.iconName = 'question';
      }
    },
    download() {
      if (!this.isDownloading) {
        this.$emit('download');
      }
    },
  },
}
</script>

<style scoped lang="less">
.drive-open-file--container {
  text-align: center;
}
.icon {
  font-size: 36px;
}
.name {
  font-size: 18px;
  margin-top: 8px;
}
.download-icon {
  margin-top: 17px;
}
</style>