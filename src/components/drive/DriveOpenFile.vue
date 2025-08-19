<template>
  <div class="drive-open-file--container">
    <div>{{ type }}</div>
    <div>{{ name }}</div>
    <div>{{ iconName }}</div>
  </div>
</template>

<script>
import fileIconMixin from "@/components/mixins/fileIconMixin.js";

export default {
  name: "DriveOpenFile",
  mixins: [fileIconMixin],
  data() {
    return {
      type: 'none',
      name: '',
      iconName: ''
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
        if (this.filenameIsImage(file.name)) {
          this.type = "image";
        } else {
          this.type = "file";
        }
        this.name = file.name;
        this.iconName = this.getIconNameByFilename(file.name);
      } else {
        this.type = "none";
      }
    }
  },
}
</script>

<style scoped lang="less">

</style>