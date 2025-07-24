<template>
  <div class="drive-tree-desktop--container">
    <div class="actions">
      <div @click="fallBack" v-if="showFallback" class="btn btn-sm btn-info">
        <f-awesome icon="arrow-left"></f-awesome>
      </div>
      <div @click="showNewDirectoryPopup" class="btn btn-sm btn-info">
        <f-awesome icon="plus"></f-awesome>
        {{ $t('app_drive_create_folder') }}
      </div>
      <div @click="showUploadPopup" class="btn btn-sm btn-info">
        <f-awesome icon="upload"></f-awesome>
        {{ $t('app_upload_files') }}
      </div>
    </div>
    <div class="table">
      <div class="header">
        <div>{{ $t('app_drive_table_name') }}</div>
        <div>{{ $t('app_created') }}</div>
        <div>{{ $t('app_size') }}</div>
        <div>{{ $t('app_actions') }}</div>
      </div>
      <div class="rows">
        <div
            class="row cursor-pointer no-select"
            v-for="item in tree"
            :key="item.id"
            @dblclick="fallInside(item.id, item.type)"
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
          <div>
            <div @click="showDeletePopup(item.id, item.type, item.name)" class="btx-sm-circle btx-danger">
              <f-awesome icon="times"></f-awesome>
            </div>
          </div>
        </div>
      </div>
    </div>

    <popup
        :closeButton="newDirectoryPopup.closeButton"
        :actionButton="newDirectoryPopup.actionButton"
        :action-class="newDirectoryPopup.actionClass"
        :show="newDirectoryPopup.show"
        @closePopup="closeNewDirectoryPopup"
        @actionPopup="submitNewDirectoryPopup"
    >
      <template v-slot:header>{{ $t('app_drive_create_folder') }}</template>
      <template v-slot:body>
        <div class="input-block">
          <label>{{ $t('form_name') }}</label>
          <input type="text" v-model="newDirectoryModel">
        </div>
      </template>
    </popup>

    <popup
        :closeButton="deletePopup.closeButton"
        :actionButton="deletePopup.actionButton"
        :action-class="deletePopup.actionClass"
        :show="deletePopup.show"
        @closePopup="closeDeletePopup"
        @actionPopup="submitDeletePopup"
    >
      <template v-slot:header>
        <span v-if="deletedType === 0">{{ $t('app_drive_delete_directory', {folder: this.deleteName}) }}</span>
        <span v-if="deletedType === 1">{{ $t('app_drive_delete_file', {file: this.deleteName}) }}</span>
      </template>
      <template v-slot:body>
        <span v-if="deletedType === 0">{{ $t('app_drive_delete_directory_text') }}</span>
        <span v-if="deletedType === 1">{{ $t('app_drive_delete_file_text') }}</span>
      </template>
    </popup>

    <popup
        :closeButton="uploadPopup.closeButton"
        :actionButton="uploadPopup.actionButton"
        :action-class="uploadPopup.actionClass"
        :show="uploadPopup.show"
        @closePopup="closeUploadPopup"
        @actionPopup="submitUploadPopup"
    >
      <template v-slot:header>{{ $t('app_upload_files') }}</template>
      <template v-slot:body>
        <div>
          <div
              v-show="!files.length"
              class="upload-area"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="openFileDialog"
              :class="{ dragover: isDragging }"
          >
            <div v-if="!files.length">
              <div class="mrg-t-30 download-icon"><f-awesome icon="download"></f-awesome></div>
              <div class="mrg-t-10">{{ $t('form_move_files_or_click') }}</div>
            </div>
            <input
                type="file"
                multiple
                ref="fileInput"
                class="input-file"
                @change="handleFileChange"
            />
          </div>
          <ul class="upload-ul" v-if="files.length > 0">
            <li v-for="(file, index) in files" :key="index">
              <div class="icon">ico</div>
              <div class="name">{{ file.name }}</div>
              <div class="delete">
                <div class="btn-badge btn-danger">
                  <f-awesome icon="times"></f-awesome>
                </div>
              </div>
            </li>
          </ul>
          <div v-if="files.length > 0" class="mrg-t-15">
            <div @click="clearFiles" class="btn btn-sm btn-danger">{{ $t('app_delete_all') }}</div>
          </div>
        </div>
      </template>
    </popup>

  </div>
</template>

<script>
import dateFormatMixin from "@/components/mixins/dateFormatMixin.js";
import Popup from "@/components/Popup.vue";
import CategoryFields from "@/components/note/CategoryFields.vue";
import driveRepository from "@/repositories/drive/index.js";

export default {
  name: "DriveTreeDesktop",
  emits: ["fallInside", "fallBack", "update:tree", "update:get-tree"],
  components: {CategoryFields, Popup},
  data() {
    return {
      newDirectoryPopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_save'),
        actionClass: 'btn-success',
      },
      newDirectoryModel: '',

      deletePopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_continue'),
        actionClass: 'btn-success',
      },
      deletedId: 0,
      deletedType: 0,
      deleteName: '',

      uploadPopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_upload'),
        actionClass: 'btn-success',
      },
      files: [],
      //fileInput: null,
      isDragging: false,
    }
  },
  mixins: [dateFormatMixin],
  props: {
    tree: Array,
    parentId: Number,
    showFallback: Boolean,
  },
  computed: {

  },
  methods: {
    clearFiles() {
      this.files = [];
    },
    openFileDialog() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      this.files = Array.from(event.target.files);
    },
    handleDrop(event) {
      this.files = Array.from(event.dataTransfer.files);
      this.isDragging = false;
    },

    closeUploadPopup() {
      this.uploadPopup.show = false;
    },
    showUploadPopup() {
      this.uploadPopup.show = true;
    },
    submitUploadPopup() {
      console.log('upload');
    },
    convertDatetime(datetime) {
      return this.phpDateTimeToShortString(datetime);
    },
    getSize(size) {
      if (size >= 1024 * 1024 * 1024) {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + ' ' +this.$t('app_gb');
      } else {
        return (size / (1024 * 1024)).toFixed(2) + ' ' +this.$t('app_mb');
      }
    },
    fallInside(itemId, itemType) {
      if (itemType === 0) {
        this.$emit('fallInside', itemId);
      }
    },
    fallBack() {
      this.$emit('fallBack');
    },
    closeNewDirectoryPopup() {
      this.newDirectoryPopup.show = false;
    },
    showNewDirectoryPopup() {
      this.newDirectoryPopup.show = true;
    },
    submitNewDirectoryPopup() {
      this.$store.dispatch("startPreloader");
      driveRepository.createDirectory(this.newDirectoryModel, this.parentId).then(resp => {
        this.closeNewDirectoryPopup();
        this.newDirectoryModel = '';
        this.$emit('update:tree', resp.data);

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

    closeDeletePopup() {
      this.deletePopup.show = false;
    },
    showDeletePopup(itemId, type, itemName) {
      this.deletedId = itemId;
      this.deletedType = type;
      this.deleteName = itemName;
      this.deletePopup.show = true;
    },
    submitDeletePopup() {
      this.$store.dispatch("startPreloader");
      driveRepository.delete(this.deletedId).then(() => {
        this.closeDeletePopup();
        this.$emit('update:get-tree');
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

    //.row:hover > div {
    //  background-color: #e6f8ff !important;
    //}
  }
}
// theme
.light-theme {
  .table {
    .rows {
      .row:hover > div {
        background-color: #e6f8ff !important;
      }
    }
  }
}
.dark-theme {
  .table {
    .rows {
      .row:hover > div {
        background-color: #404043 !important;
      }
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
.input-file {
  display: none;
}
.upload-area {
  width: 100%;
  height: 140px;
  text-align: center;
  //line-height: 120px;
  cursor: pointer;
  background-color: #f2f2f3;
  border-radius: 20px;
  border: 2px dashed #d9d9d9;

  .download-icon {
    font-size: 30px;
  }
}
.upload-ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    flex-direction: row;
    text-decoration: none;
    margin-top: 16px;

    .icon {
      width: 10%;
    }
    .name {
      width: 75%;
    }
    .delete {
      width: 10%;
    }
  }
}
@media (max-width: 1380px) {

}
</style>
