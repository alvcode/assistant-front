<template>
  <div class="progress-line no-select">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: percent + '%' }"></div>
      </div>
  </div>
</template>

<script>

export default {
  name: "ProgressLine",
  props: {
    percent: Number
  },
  methods: {

  }
};
</script>

<style scoped lang="less">
.progress-bar {
  width: 100%;
  height: 7px;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background-color: #4da9c7;
  width: 0;
  transition: width 0.3s ease;
}
</style>
