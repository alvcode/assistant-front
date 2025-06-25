<template>
  <div class="drive-tree-desktop--container">
    <div class="table">
      <div class="header">
        <div>Название</div>
        <div>Создано</div>
        <div>Размер</div>
        <div>Действия</div>
      </div>
      <div class="rows">
        <div
            class="row cursor-pointer"
            v-for="item in tree"
            :key="item.id"
        >
          <div>
            <div v-if="item.type === 0" class="row--name">
              <div class="icon"><f-awesome :icon="['fas', 'folder']"></f-awesome></div>
              <div class="name">{{ item.name }}</div>
            </div>
            <div v-if="item.type === 1" class="row--name">
              <div class="icon">

              </div>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
          <div>{{ convertDatetime(item.created_at) }}</div>
          <div>
            <span v-if="item.type === 0">-</span>
            <span v-if="item.type === 1">{{ getSize(item.size) }}</span>
          </div>
          <div>actions</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateFormatMixin from "@/components/mixins/dateFormatMixin.js";

export default {
  name: "DriveTreeDesktop",
  components: {},
  data() {
    return {

    }
  },
  mixins: [dateFormatMixin],
  props: {
    tree: Array
  },
  computed: {

  },
  methods: {
    convertDatetime(datetime) {
      return this.phpDateTimeToShortString(datetime);
    },
    getSize(size) {
      if (size >= 1024 * 1024 * 1024) {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + ' ' +this.$t('app_gb');
      } else {
        return (size / (1024 * 1024)).toFixed(2) + ' ' +this.$t('app_mb');
      }
    }
  },
  created() {

  }
};
</script>

<style scoped lang="less">
.table {
  margin-top: 10px;
  overflow: auto;

  .header {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    flex-direction: row;

    &.center {
      text-align: center;
    }

    & > div {
      width: 550px;
      padding: 8px 8px;
      box-sizing: border-box;
      border-bottom: 1px solid;
      border-color: rgba(212, 212, 212, 0.8);
      font-weight: 700;
    }
  }

  .rows {
    //margin-top: 5px;

    &.stripped {
      .row:nth-child(2n) {
        & > div {
          background-color: #f5f5f5;
        }
      }
    }

    .row {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      flex-direction: row;

      &.center {
        text-align: center;
      }

      & > div {
        width: 550px;
        padding: 7px 7px;
        box-sizing: border-box;
        border-bottom: 1px solid;
        border-color: rgba(212, 212, 212, 0.8);
        word-wrap: break-word;
      }
    }

    .row:hover > div {
      background-color: #e6f8ff !important;
    }
  }
}
.row--name {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  flex-direction: row;

  .icon {

  }
  .name {
    margin-left: 8px;
  }
}
@media (max-width: 1380px) {

}
</style>
