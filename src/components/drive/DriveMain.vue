<template>
  <div class="drive-main--container">
    <div class="main-content">
      <div class="space mrg-t-10">
        <drive-space :space-obj="space"></drive-space>
      </div>
      <div class="drive-tree-desktop mrg-t-20">
        <drive-breadcrumbs
            :breadcrumbs="breadcrumbs"
            @fall-to="fallTo"
        ></drive-breadcrumbs>
        <drive-tree-desktop
            class="mrg-t-15"
            :tree="tree"
            :parent-id="parentId"
            :show-fallback="breadcrumbs.length > 1"
            @fall-inside="fallInside"
            @fall-back="fallBack"
            @update:tree="setTree"
            @update:get-tree="getTree"
        ></drive-tree-desktop>
      </div>
      <div class="drive-tree-mobile">
        // mobile
      </div>
    </div>
  </div>
</template>

<script>

import DriveSpace from "@/components/drive/DriveSpace.vue";
import driveRepository from "@/repositories/drive/index.js";
import DriveTreeDesktop from "@/components/drive/DriveTreeDesktop.vue";
import DriveBreadcrumbs from "@/components/drive/DriveBreadcrumbs.vue";

export default {
  name: "DriveMain",
  components: {DriveBreadcrumbs, DriveTreeDesktop, DriveSpace},
  data() {
    return {
      space: {total: 0, used: 0},
      tree: [],
      breadcrumbs: [{name: this.$t('app_drive'), parentId: null}],
      parentId: null,
    }
  },
  computed: {

  },
  methods: {
    getSpace() {
      driveRepository.getSpace().then(resp => {
        this.space = resp.data;
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
      });
    },
    getTree() {
      this.$store.dispatch("startPreloader");
      driveRepository.getTree(this.parentId).then(resp => {
        this.tree = resp.data;
        this.$store.dispatch("stopPreloader");
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.$store.dispatch("stopPreloader");
      });
    },
    fallInside(rowId) {
      this.parentId = rowId;
      for (let i = 0; i < this.tree.length; i++) {
        if (this.tree[i].id === rowId) {
          this.breadcrumbs.push({name: this.tree[i].name, parentId: this.parentId});
        }
      }
      this.getTree();
    },
    fallBack() {
      if (this.breadcrumbs.length > 1) {
        this.parentId = this.breadcrumbs[this.breadcrumbs.length - 2].parentId;
        this.getTree();
        this.breadcrumbs.pop();
      }
    },
    fallTo(parentId) {
      let newBreadcrumbs = [];
      for (let key in this.breadcrumbs) {
        newBreadcrumbs.push(this.breadcrumbs[key]);
        if (parentId === this.breadcrumbs[key].parentId) {
          break;
        }
      }
      this.breadcrumbs = newBreadcrumbs;
      this.parentId = parentId;
      this.getTree();
    },
    setTree(data) {
      this.tree = data;
    }
  },
  created() {
    this.getSpace();
    this.getTree();
  }
};
</script>

<style scoped lang="less">
//.main-content {
//  display: flex;
//  flex-wrap: nowrap;
//  justify-content: space-between;
//  flex-direction: row;
//}
.space {
  display: flex;
  //flex-direction: column;
  justify-content: right;
}
.drive-tree-desktop {
  display: block;
  width: 100%;
}
.drive-tree-mobile {
  display: none;
}
@media (max-width: 1380px) {
  //.main-content {
  //  flex-wrap: wrap;
  //  flex-direction: column-reverse;
  //}
}
@media (max-width: 980px) {
  .drive-tree-desktop {
    display: none;
  }
  .drive-tree-mobile {
    display: block;
  }
}
</style>
