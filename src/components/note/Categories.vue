<template>
  <div class="categories--container">
    <div class="actions text-right">
      <div @click="showNewCategoryPopup" class="btn btn-sm btn-outline-info">
        <f-awesome icon="plus"></f-awesome> Добавить
      </div>
    </div>
    <div class="list">
      <category-tree :categories="categoryTree"></category-tree>
    </div>

    <popup
        :closeButton="newCategoryPopup.closeButton"
        :actionButton="newCategoryPopup.actionButton"
        :action-class="newCategoryPopup.actionClass"
        :show="newCategoryPopup.show"
        @closePopup="closeNewCategoryPopup"
        @actionPopup="submitNewCategoryPopup"
    >
      <template v-slot:header>Новая категория</template>
      <template v-slot:body>
        <category-fields
          :show="newCategoryPopup.show"
          :categories="list"
          @update:data="handleUpdateNewCategoryData"
        ></category-fields>
      </template>
    </popup>

  </div>
</template>

<script>

import noteCategoryRepository from "@/repositories/noteCategory/index.js";
import CategoryTree from "@/components/note/CategoryTree.vue";
import Popup from "@/components/Popup.vue";
import CategoryFields from "@/components/note/CategoryFields.vue";

export default {
  name: "Categories",
  components: {CategoryFields, Popup, CategoryTree},
  data() {
    return {
      list: [],
      categoryTree: [],
      newCategoryPopup: {
        show: false,
        closeButton: 'Отмена',
        actionButton: 'Сохранить',
        actionClass: 'btn-success',
      },
      newCategoryData: {},
    }
  },
  computed: {

  },
  methods: {
    handleUpdateNewCategoryData(data) {
      this.newCategoryData = data;
      console.log(this.newCategoryData);
    },
    closeNewCategoryPopup() {
      this.newCategoryPopup.show = false;
    },
    showNewCategoryPopup() {
      this.newCategoryPopup.show = true;
    },
    submitNewCategoryPopup() {
      this.$store.dispatch("startPreloader");
      let request = {name: this.newCategoryData.name};
      if (this.newCategoryData.parent_id > 0) {
        request.parent_id = this.newCategoryData.parent_id;
      }

      noteCategoryRepository.create(request).then(() => {
        this.getAll();
        this.closeNewCategoryPopup();

        this.$store.dispatch("stopPreloader");
      }).catch(err =>  {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.$store.dispatch("stopPreloader");
      });
    },
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
