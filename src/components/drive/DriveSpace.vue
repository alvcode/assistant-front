<template>
  <div class="drive-space--container">
    <div class="main-content">
      <div>
        <progress max="100" :value="usedPercent"></progress>
      </div>
      <div>
        {{ $t('app_drive_space_text', {used: formattedUsed, total: formattedTotal}) }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "DriveSpace",
  components: {},
  data() {
    return {

    }
  },
  props: {
    spaceObj: Object
  },
  computed: {
    usedPercent() {
      if (this.spaceObj.total === 0) {
        return 0;
      } else {
        return (this.spaceObj.used / this.spaceObj.total) * 100;
      }
    },
    formattedTotal() {
      const total = this.spaceObj.total;
      if (total >= 1024 * 1024 * 1024) {
        return (total / (1024 * 1024 * 1024)).toFixed(2) + ' ' +this.$t('app_gb');
      } else {
        return (total / (1024 * 1024)).toFixed(2) + ' ' +this.$t('app_mb');
      }
    },
    formattedUsed() {
      const used = this.spaceObj.used;
      if (used >= 1024 * 1024 * 1024) {
        return (used / (1024 * 1024 * 1024)).toFixed(2) + ' ' +this.$t('app_gb');
      } else {
        return (used / (1024 * 1024)).toFixed(2) + ' ' +this.$t('app_mb');
      }
    }
  },
  methods: {

  },
  created() {

  }
};
</script>

<style scoped lang="less">
.main-content {
  width: 100%;

  progress {
    width: 100%;
  }
}
@media (max-width: 1380px) {
  .main-content {
    flex-wrap: wrap;
    flex-direction: column-reverse;
  }
}
</style>
