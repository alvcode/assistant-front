<template>
  <back-template>
    <template v-slot:page-title>{{$t('app_drive')}}</template>
    <template v-slot:page-content>
      <div class="drive--container">
        <drive-main></drive-main>
      </div>
    </template>
  </back-template>
</template>

<script>
import BackTemplate from "@/components/BackTemplate.vue";
import DriveMain from "@/components/drive/DriveMain.vue";

export default {
  name: "Drive",
  components: {
    DriveMain,
    BackTemplate,
  },
  data() {
    return {

    };
  },
  watch: {

  },
  computed: {

  },
  methods: {

  },
  async created() {

  }
};
</script>

<style scoped lang="less">

</style>
