<template>
  <div class="categories--container">
    <div class="full">
      <div class="actions text-right">
        <div @click="showNewCategoryPopup" class="btn btn-sm btn-outline-info">
          <f-awesome icon="plus"></f-awesome> {{ $t('app_add') }}
        </div>
      </div>
      <div v-show="list.length > 0" class="search-line mrg-t-15">
        <div class="input-with-icons">
          <div class="left-icon">
            <f-awesome :icon="['fas', 'magnifying-glass']" />
          </div>
          <div class="right-icon cursor-pointer" @click="clearSearch" v-show="searchQuery !== ''">
            <f-awesome :icon="['fas', 'xmark']" />
          </div>
          <div class="input-block">
            <input type="text" v-model="searchQuery">
          </div>
        </div>
      </div>
      <div v-show="list.length === 0" class="empty text-bold text-danger text-center">{{ $t('app_empty_for_now') }}</div>
      <div class="list">
        <category-tree
            :categories="categoryTree"
            @update:selectedCat="selectCategory"
            @action:delete="actionDeleteCategory"
            @action:edit="actionEditCategory"
            @action:up="actionUpCategory"
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
          <div v-show="list.length > 0" class="search-line mrg-t-15">
            <div class="input-with-icons">
              <div class="left-icon">
                <f-awesome :icon="['fas', 'magnifying-glass']" />
              </div>
              <div class="right-icon cursor-pointer" @click="clearSearch" v-show="searchQuery !== ''">
                <f-awesome :icon="['fas', 'xmark']" />
              </div>
              <div class="input-block">
                <input type="text" v-model="searchQuery">
              </div>
            </div>
          </div>
          <div class="list">
            <category-tree
                :categories="categoryTree"
                @update:selectedCat="selectCategoryMobile"
                @action:delete="actionDeleteCategory"
                @action:edit="actionEditCategory"
                @action:up="actionUpCategory"
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
        :closeButton="updateCategoryPopup.closeButton"
        :actionButton="updateCategoryPopup.actionButton"
        :action-class="updateCategoryPopup.actionClass"
        :show="updateCategoryPopup.show"
        @closePopup="closeUpdateCategoryPopup"
        @actionPopup="submitUpdateCategoryPopup"
    >
      <template v-slot:header>{{ $t('app_edit_category') }}</template>
      <template v-slot:body>
        <category-fields
            :show="newCategoryPopup.show"
            :categories="list"
            :default-values="updateCategoryData"
            @update:data="handleUpdateEditCategoryData"
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

const SELECTED_CATEGORY_LS_KEY = 'selectedCategoryId';

export default {
  name: "Categories",
  components: {CategoryFields, Popup, CategoryTree},
  emits: ['update:categoryId', 'update:list'],
  data() {
    return {
      searchQuery: '',
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

      updateCategoryId: 0,
      updateCategoryData: {},
      updateCategoryDataForSubmit: {},
      updateCategoryPopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_save'),
        actionClass: 'btn-success',
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

      if (this.list.length === 0) {
        return tree;
      }

      let copiedList = JSON.parse(JSON.stringify(this.list));

      if (this.searchQuery !== '') {
        const searchedIds = [];
        for (let key in copiedList) {
          if (copiedList[key].name.toLowerCase().includes(this.searchQuery.toLowerCase())) {
            const recursiveItems = this.recursiveSearchParentHierarchy(copiedList[key].id, copiedList);
            for (let keyR in recursiveItems) {
              if (!searchedIds.includes(recursiveItems[keyR])) {
                searchedIds[searchedIds.length] = recursiveItems[keyR];
              }
            }
          }
        }

        copiedList = copiedList.filter((item) => {
          return searchedIds.includes(item.id);
        });
      }

      copiedList.forEach((category, index) => {
        if (this.selectedCategoryId === 0 && index === 0) {
          category.active = true;
          //this.selectCategory(category.id);
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
    recursiveSearchParentHierarchy(startId, catArr) {
      const result = [];
      for (let key in catArr) {
        if (catArr[key].id === startId) {
          result.push(catArr[key].id);

          if (catArr[key].parent_id) {
            result.push(...this.recursiveSearchParentHierarchy(catArr[key].parent_id, catArr));
          }
        }
      }
      return result;
    },
    clearSearch() {
      this.searchQuery = '';
    },
    handleUpdateEditCategoryData(data) {
      this.updateCategoryDataForSubmit = data;
    },
    submitUpdateCategoryPopup() {
      let request = {name: this.updateCategoryDataForSubmit.name};
      if (this.updateCategoryDataForSubmit.parent_id > 0) {
        request.parent_id = this.updateCategoryDataForSubmit.parent_id;
      }

      this.$store.dispatch("startPreloader");
      noteCategoryRepository.update(this.updateCategoryId, request).then(() => {
        this.getAll();
        this.closeUpdateCategoryPopup();

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
    showUpdateCategoryPopup() {
      this.updateCategoryPopup.show = true;
    },
    closeUpdateCategoryPopup() {
      this.updateCategoryPopup.show = false;
    },
    actionEditCategory(catId) {
      this.updateCategoryId = catId;
      for (let key in this.list) {
        if (+this.list[key].id === +catId) {
          this.updateCategoryData = this.list[key];
        }
      }
      this.showUpdateCategoryPopup();
    },

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
          this.selectCategory(0);
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
      let newCatId = catId;

      if (newCatId > 0) {
        let existsSelectedCategory = false;

        this.list.forEach((category) => {
          if (+newCatId === +category.id) {
            existsSelectedCategory = true;
          }
        });

        if (!existsSelectedCategory) {
          // установим первую категорию в списке
          this.list.forEach((category, index) => {
            if (index === 0) {
              newCatId = category.id;
            }
          });
        }
      } else if (+newCatId === 0) {
        this.list.forEach((category, index) => {
          if (index === 0) {
            newCatId = category.id;
          }
        });
      }

      this.selectedCategoryId = newCatId;
      localStorage.setItem(SELECTED_CATEGORY_LS_KEY, newCatId);
      this.$emit('update:categoryId', newCatId);
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
        this.getAll().then(() => {
          if (this.list.length === 1) {
            this.selectCategory(0);
          }
        });
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
    actionUpCategory(catId) {
      this.$store.dispatch("startPreloader");
      noteCategoryRepository.positionUp(catId).then(resp => {
        this.getAll();
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
    async getAll() {
      await noteCategoryRepository.all().then(resp => {
        this.list = resp.data.sort((a, b) => a.position - b.position)
        //this.list = resp.data;
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
  async created() {
   await this.getAll();

    let selectedCategoryId = localStorage.getItem(SELECTED_CATEGORY_LS_KEY);
    if (selectedCategoryId) {
      this.selectCategory(+selectedCategoryId);
    } else {
      this.selectCategory(0);
    }
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
