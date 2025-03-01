<template>
  <div class="notes-main--container">
    <div class="main-content">
      <div class="notes">
        <div class="shadow-card">
          <div class="card-title">{{$t('app_notes')}}</div>
          <div class="content mrg-t-10">
            <notes-component :category-id="categoryId" :categories="list"></notes-component>
          </div>
        </div>
      </div>
      <div class="categories">
        <div class="shadow-card">
          <div class="card-title">{{$t('app_categories')}}</div>
          <div class="content mrg-t-10">
            <categories @update:category-id="setCategoryId" @update:list="setList"></categories>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Categories from "@/components/note/Categories.vue";
import NotesComponent from "@/components/note/NotesComponent.vue";

export default {
  name: "NotesMain",
  components: {NotesComponent, Categories},
  data() {
    return {
      list: [],
      categoryId: 0,
    }
  },
  computed: {

  },
  methods: {
    setCategoryId(catId) {
      this.categoryId = catId;
    },
    setList(list) {
      this.list = list;
    },
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
    max-height: 100%;
    width: 38%;
    .shadow-card {
      height: 100%;
    }
  }
}
@media (max-width: 1380px) {
  .main-content {
    //display: flex;
    flex-wrap: wrap;
    //justify-content: space-between;
    flex-direction: column-reverse;

    .notes {
      margin-top: 25px;
      width: 100%;
    }
    .categories {
      //max-height: 100%;
      width: 100%;
      //.shadow-card {
      //  height: 100%;
      //}
    }
  }
}
</style>
