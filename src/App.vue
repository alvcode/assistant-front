<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import longPollingBus from "@/services/longPollingBus.js";

const router = useRouter();

function hasToken() {
  const userDataStorage = JSON.parse(localStorage.getItem("userData"));
  return !!(userDataStorage && userDataStorage[0] && userDataStorage[0].token);
}

function syncLongPolling(route) {
  const isPublicPage = route.meta && route.meta.public === true;

  if (hasToken() && !isPublicPage) {
    longPollingBus.start();
  } else {
    longPollingBus.stop();
  }
}

router.afterEach((to) => {
  syncLongPolling(to);
});

onMounted(async () => {
  await router.isReady();
  syncLongPolling(router.currentRoute.value);
});

onBeforeUnmount(() => {
  longPollingBus.stop();
});
</script>

<template>
  <RouterView />
</template>

<style lang="less" src="./style/main.less"></style>
