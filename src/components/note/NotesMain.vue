<template>
  <div class="notes-main--container">
    <div class="main-content">
      <div class="notes">

      </div>
      <div class="categories">
        <div class="shadow-card">
          <div class="card-title">{{$t('app_categories')}}</div>
          <div class="content mrg-t-10">
            <categories></categories>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Categories from "@/components/note/Categories.vue";

export default {
  name: "NotesMain",
  components: {Categories},
  data() {
    return {
      list: []
    }
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
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  flex-direction: row;

  .notes {
    width: 60%;
  }
  .categories {
    width: 38%;
    .shadow-card {
      height: 100%;
    }
  }
}
</style>
