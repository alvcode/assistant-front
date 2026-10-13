<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { RouterView } from 'vue-router'
import longPollingBus from "@/services/longPollingBus.js";

onMounted(() => {
  const userDataStorage = JSON.parse(localStorage.getItem("userData"));
  const token = userDataStorage && userDataStorage[0] && userDataStorage[0].token;

  if (token) {
    longPollingBus.start();
  }
});

onBeforeUnmount(() => {
  longPollingBus.stop();
});
</script>

<template>
  <RouterView />
</template>

<style lang="less" src="./style/main.less"></style>
