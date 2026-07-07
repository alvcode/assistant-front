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
            <div @click="restoreOneStruct(item.id)" class="btx btx-sm btx-success mrg-t-5 mrg-b-5">{{ $t('app_restore') }}</div>
            <div @click="showDeleteOnePopup(item.id, item.name, item.type)" class="btx btx-sm btx-danger mrg-t-5 mrg-b-5">{{ $t('app_delete') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions mrg-t-25 text-right">
      <div v-show="list.length > 1" @click="restoreAll" class="btx btx-sm btx-success">{{ $t('app_restore_all') }}</div>
      <div v-show="list.length > 1" @click="showDeleteAllPopup" class="btx btx-sm btx-danger">{{ $t('app_delete_all') }}</div>
    </div>

    <popup
        :closeButton="deleteOnePopup.closeButton"
        :actionButton="deleteOnePopup.actionButton"
        :action-class="deleteOnePopup.actionClass"
        :show="deleteOnePopup.show"
        @closePopup="closeDeleteOnePopup"
        @actionPopup="submitDeleteOnePopup"
    >
      <template v-slot:header>
        <span v-if="deletedType === 0">{{ $t('app_drive_delete_directory', {folder: this.deletedName}) }}</span>
        <span v-if="deletedType === 1">{{ $t('app_drive_delete_file', {file: this.deletedName}) }}</span>
      </template>
      <template v-slot:body>
        <div>
          {{ $t('app_drive_delete_file_text') }}
        </div>
      </template>
    </popup>

    <popup
        :closeButton="deleteAllPopup.closeButton"
        :actionButton="deleteAllPopup.actionButton"
        :action-class="deleteAllPopup.actionClass"
        :show="deleteAllPopup.show"
        @closePopup="closeDeleteAllPopup"
        @actionPopup="submitDeleteAllPopup"
    >
      <template v-slot:header>
        {{ $t('app_permanently_delete') }}
      </template>
      <template v-slot:body>
        <div>
          {{ $t('app_all_items_will_be_permanently_deleted') }}
        </div>
      </template>
    </popup>
  </div>
</template>

<script>
import fileIconMixin from "@/components/mixins/fileIconMixin.js";
import driveRecycleBinRepository from "@/repositories/driveRecycleBin/index.js";
import dateFormatMixin from "@/components/mixins/dateFormatMixin.js";
import Popup from "@/components/Popup.vue";

export default {
  name: "DriveRecycleBin",
  components: {Popup},
  emits: ["restored"],
  mixins: [fileIconMixin, dateFormatMixin],
  data() {
    return {
      list: [],

      deleteOnePopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_continue'),
        actionClass: 'btn-success',
      },
      deletedId: 0,
      deletedName: '',
      deletedType: 0,

      deleteAllPopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_continue'),
        actionClass: 'btn-success',
      },
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
    },

    showDeleteOnePopup(id, name, type) {
      this.deletedId = id;
      this.deletedName = name;
      this.deletedType = type;
      this.deleteOnePopup.show = true;
    },
    closeDeleteOnePopup() {
      this.deleteOnePopup.show = false;
    },
    submitDeleteOnePopup() {
      this.$store.dispatch("startPreloader");
      driveRecycleBinRepository.deleteOne(this.deletedId).then(() => {
        this.showList();
        this.$emit('restored');
        this.closeDeleteOnePopup();
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

    closeDeleteAllPopup() {
      this.deleteAllPopup.show = false;
    },
    showDeleteAllPopup() {
      this.deleteAllPopup.show = true;
    },
    submitDeleteAllPopup() {
      this.$store.dispatch("startPreloader");
      driveRecycleBinRepository.deleteAll().then(() => {
        this.showList();
        this.$emit('restored');
        this.closeDeleteAllPopup();
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