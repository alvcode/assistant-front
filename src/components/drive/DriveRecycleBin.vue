<template>
  <div class="drive-recycle-bin--container">
    <div class="table--container">
      <div class="table--header">
        <div>{{ $t('app_drive_table_name') }}</div>
        <div>{{ $t('app_added') }}</div>
        <div>{{ $t('app_path') }}</div>
        <div>{{ $t('app_actions') }}</div>
      </div>
      <div class="table--rows">
        <div class="table--row" v-for="item in list" :key="item.id">
          <div class="name-block">
            <div v-if="item.type === 0" class="row--name">
              <div class="icon"><f-awesome :icon="['fas', 'folder']"></f-awesome></div>
              <div class="name">{{ item.name }}</div>
            </div>
            <div v-if="item.type === 1" class="row--name">
              <div class="icon">
                <f-awesome :icon="getFileIconName(item.name)"></f-awesome>
              </div>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>

          <div class="date-block">{{ convertDatetime(item.created_at) }}</div>
          <div class="path-block">{{ item.original_path }}</div>
          <div class="actions-block">
            <div @click="restoreOneStruct(item.id)" class="btx btx-sm btx-success">{{ $t('app_restore') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div @click="restoreAll" class="actions mrg-t-25 text-right">
      <div v-show="list.length > 1" class="btx btx-sm btx-success">{{ $t('app_restore_all') }}</div>
    </div>
  </div>
</template>

<script>
import fileIconMixin from "@/components/mixins/fileIconMixin.js";
import driveRecycleBinRepository from "@/repositories/driveRecycleBin/index.js";
import dateFormatMixin from "@/components/mixins/dateFormatMixin.js";

export default {
  name: "DriveRecycleBin",
  emits: ["restored"],
  mixins: [fileIconMixin, dateFormatMixin],
  data() {
    return {
      list: []
    }
  },
  props: {
    show: Boolean
  },
  watch: {
    show: function (val) {
      if (val) {
        this.showList();
      } else {
        setTimeout(() => {
          this.list = [];
        }, 500);
      }
    }
  },
  methods: {
    getFileIconName(filename) {
      return this.getIconNameByFilename(filename);
    },
    convertDatetime(datetime) {
      return this.phpDateTimeToShortString(datetime);
    },
    showList() {
      this.$store.dispatch("startPreloader");
      driveRecycleBinRepository.getList().then(resp => {
        this.list = resp.data;
        this.$store.dispatch("stopPreloader");
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.$store.dispatch("stopPreloader");
      })
    },
    restoreOneStruct(id) {
      this.$store.dispatch("startPreloader");
      driveRecycleBinRepository.restoreOne(id).then(() => {
        this.showList();
        this.$emit('restored');
        this.$store.dispatch("stopPreloader");
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.$store.dispatch("stopPreloader");
      })
    },
    restoreAll() {
      this.$store.dispatch("startPreloader");
      driveRecycleBinRepository.restoreAll().then(() => {
        this.showList();
        this.$emit('restored');
        this.$store.dispatch("stopPreloader");
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.$store.dispatch("stopPreloader");
      })
    }
  },
}
</script>

<style scoped lang="less">
.row--name {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  flex-direction: row;

  .name {
    margin-left: 8px;
  }
}
</style>