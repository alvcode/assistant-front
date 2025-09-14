<template>
  <div class="drive-open-file--container">
    <div class="icon">
      <f-awesome :icon="iconName"></f-awesome>
    </div>
    <div class="name">{{ name }}</div>
    <div class="download-icon">
      <div @click="download" class="btx btx-sm btx-info">
        <f-awesome icon="download"></f-awesome>
        {{ $t('app_download') }}
      </div>
    </div>
  </div>
</template>

<script>
import fileIconMixin from "@/components/mixins/fileIconMixin.js";

export default {
  name: "DriveOpenFile",
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
      this.$emit('download');
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