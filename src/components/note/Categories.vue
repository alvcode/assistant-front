<template>
  <div class="categories--container">
    <div class="full">
      <div class="actions text-right">
        <div @click="showNewCategoryPopup" class="btn btn-sm btn-outline-info">
          <f-awesome icon="plus"></f-awesome> {{ $t('app_add') }}
        </div>
      </div>
      <div v-show="list.length === 0" class="empty text-bold text-danger text-center">{{ $t('app_empty_for_now') }}</div>
      <div class="list">
        <category-tree
            :categories="categoryTree"
            @update:selectedCat="selectCategory"
            @action:delete="actionDeleteCategory"
        ></category-tree>
      </div>
    </div>
    <div class="mobile">
      <div class="selected">
        <span v-show="selectedCategoryName !== ''">
          {{ $t('app_selected_category') }}: <b>{{ selectedCategoryName }}</b>
        </span>
        <div v-show="list.length === 0" class="empty text-bold text-danger">{{ $t('app_empty_for_now') }}</div>
      </div>
      <div class="action">
        <div class="btn btn-sm btn-outline-info" @click="showManageCategoryPopup">{{ $t('app_manage') }}</div>
      </div>
    </div>

<!--    manage mobile-->
    <popup
        :closeButton="manageCategoryPopup.closeButton"
        :show="manageCategoryPopup.show"
        @closePopup="closeManageCategoryPopup"
    >
      <template v-slot:header>{{ $t('app_categories') }}</template>
      <template v-slot:body>
        <div class="">
          <div class="actions text-right">
            <div @click="showNewCategoryPopup" class="btn btn-sm btn-outline-info">
              <f-awesome icon="plus"></f-awesome> {{ $t('app_add') }}
            </div>
          </div>
          <div class="list">
            <category-tree
                :categories="categoryTree"
                @update:selectedCat="selectCategoryMobile"
                @action:delete="actionDeleteCategory"
            ></category-tree>
          </div>
        </div>
      </template>
    </popup>

    <popup
        :closeButton="newCategoryPopup.closeButton"
        :actionButton="newCategoryPopup.actionButton"
        :action-class="newCategoryPopup.actionClass"
        :show="newCategoryPopup.show"
        @closePopup="closeNewCategoryPopup"
        @actionPopup="submitNewCategoryPopup"
    >
      <template v-slot:header>{{ $t('app_new_category') }}</template>
      <template v-slot:body>
        <category-fields
          :show="newCategoryPopup.show"
          :categories="list"
          @update:data="handleUpdateNewCategoryData"
        ></category-fields>
      </template>
    </popup>

    <popup
        :closeButton="deleteCategoryPopup.closeButton"
        :actionButton="deleteCategoryPopup.actionButton"
        :action-class="deleteCategoryPopup.actionClass"
        :show="deleteCategoryPopup.show"
        @closePopup="closeDeleteCategoryPopup"
        @actionPopup="submitDeleteCategoryPopup"
    >
      <template v-slot:header>{{ $t('app_delete_category') }}</template>
      <template v-slot:body>
        {{ $t('app_delete_category_text') }}
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
  emits: ['update:categoryId', 'update:list'],
  data() {
    return {
      list: [],
      selectedCategoryId: 0,
      //categoryTree: [],
      newCategoryPopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_save'),
        actionClass: 'btn-success',
      },
      newCategoryData: {},

      deletedCategoryId: 0,
      deleteCategoryPopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_continue'),
        actionClass: 'btn-success',
      },

      manageCategoryPopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
      },
    }
  },
  computed: {
    selectedCategoryName() {
      for (let i = 0; i < this.list.length; i++) {
        if (+this.list[i].id === +this.selectedCategoryId) {
          return this.list[i].name;
        }
      }
      return '';
    },
    categoryTree() {
      const categoryMap = new Map();
      const tree = [];

      const copiedList = JSON.parse(JSON.stringify(this.list));

      copiedList.forEach((category, index) => {
        if (this.selectedCategoryId === 0 && index === 0) {
          category.active = true;
          this.selectCategory(category.id);
        } else if (this.selectedCategoryId > 0 && this.selectedCategoryId === category.id) {
          category.active = true;
        } else {
          category.active = false;
        }
        // if (
        //     (this.selectedCategoryId === 0 && index === 0) ||
        //     (this.selectedCategoryId > 0 && this.selectedCategoryId === category.id)
        // ) {
        //   category.active = true;
        // } else {
        //   category.active = false;
        // }

        category.children = [];
        category.isFirstLevel = false;
        categoryMap.set(category.id, category);
      });

      copiedList.forEach(category => {
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
      });

      return tree;
    }
  },
  methods: {
    closeManageCategoryPopup() {
      this.manageCategoryPopup.show = false;
    },
    showManageCategoryPopup() {
      this.manageCategoryPopup.show = true;
    },
    submitDeleteCategoryPopup() {
      this.$store.dispatch("startPreloader");
      noteCategoryRepository.delete(this.deletedCategoryId).then(() => {
        this.getAll();
        this.closeDeleteCategoryPopup();

        if (this.deletedCategoryId === this.selectedCategoryId) {
          this.selectedCategoryId = 0;
        }

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
    closeDeleteCategoryPopup() {
      this.deleteCategoryPopup.show = false;
    },
    actionDeleteCategory(catId) {
      this.deletedCategoryId = catId;
      this.deleteCategoryPopup.show = true;
    },
    selectCategory(catId) {
      this.selectedCategoryId = catId;
      this.$emit('update:categoryId', catId);
    },
    selectCategoryMobile(catId) {
      this.selectCategory(catId);
      this.closeManageCategoryPopup();
    },
    handleUpdateNewCategoryData(data) {
      this.newCategoryData = data;
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
        this.$emit('update:list', this.list);
      }).catch(err =>  {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
      });
    },
  },
  created() {
    this.getAll();
  }
};
</script>

<style scoped lang="less">
.full {
  display: block;
}
.mobile {
  display: none;
}
@media (max-width: 1380px) {
  .full {
    display: none;
  }
  .mobile {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    flex-direction: row;

    .selected {
      width: 70%;
      line-height: 26px;
    }
    .action {
      width: 30%;
      text-align: right;
    }
  }
}
@media (max-width: 420px) {
  .mobile {
    flex-wrap: wrap;

    .selected {
      width: 100%;
    }
    .action {
      margin-top: 15px;
      width: 100%;
    }
  }
}
</style>
