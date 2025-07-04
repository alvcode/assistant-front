<template>
  <div class="drive-breadcrumbs--container">
    <div class="main-content">
      <div class="breadcrumbs">
        {{breadcrumbs}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "DriveBreadcrumbs",
  components: {},
  data() {
    return {

    }
  },
  props: {
    breadcrumbs: Array
  },
  computed: {

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
}

@media (max-width: 1380px) {

}
</style>
