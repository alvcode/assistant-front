<template>
  <div class="categories--container">
    <div class="actions text-right">
      <div class="btn btn-sm btn-outline-info">
        <f-awesome icon="plus"></f-awesome> Добавить
      </div>
    </div>
    <div class="list">
      <category-tree :categories="categoryTree"></category-tree>
    </div>
  </div>
</template>

<script>

import noteCategoryRepository from "@/repositories/noteCategory/index.js";
import CategoryTree from "@/components/note/CategoryTree.vue";

export default {
  name: "Categories",
  components: {CategoryTree},
  data() {
    return {
      list: [],
      categoryTree: []
    }
  },
  computed: {

  },
  methods: {
    getAll() {
      noteCategoryRepository.all().then(resp => {
        this.list = resp.data;
        this.categoryTree = this.buildTree(this.list);
      }).catch(err =>  {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
      });
    },
    buildTree(categories) {
      const categoryMap = new Map();
      const tree = [];

      categories.forEach(category => {
        category.children = [];
        category.isFirstLevel = false;
        category.active = false;
        categoryMap.set(category.id, category);
      });

      categories.forEach(category => {
        if (category.parent_id) {
          const parent = categoryMap.get(category.parent_id);
          if (parent) {
            parent.children.push(category);
          }
        } else {
          tree.push(category);
        }
      });

      tree.forEach(item => {
        item.isFirstLevel = true;
        if (item.id === 9) {
          item.active = true;
        }
      });

      return tree;
    }
  },
  created() {
    this.getAll();
  }
};
</script>

<style scoped lang="less">

</style>
