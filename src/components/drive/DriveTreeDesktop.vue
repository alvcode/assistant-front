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
          <div class="row-name-block">
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
          <div>{{ convertDatetime(item.created_at) }}</div>
          <div>
            <span v-if="item.type === 0">-</span>
            <span v-if="item.type === 1">{{ getSize(item.size) }}</span>
          </div>
          <div>
            <div @click="showRenamePopup(item.id, item.name)" class="btx-sm-circle btx-info">
              <f-awesome icon="pen"></f-awesome>
            </div>
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
        :action-class="uploadPopup.actionClass"
        :show="uploadPopup.show"
        @closePopup="closeUploadPopup"
        @actionPopup="submitUploadPopup"
    >
      <template v-slot:header>{{ $t('app_upload_files') }}</template>
      <template v-slot:body>
        <div>
          <div
              class="upload-area"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="openFileDialog"
              :class="{ dragover: isDragging }"
          >
            <div>
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
          <ul class="upload-ul" v-if="filesComputed.length > 0">
            <li v-for="(file, index) in filesComputed" :key="index">
              <div class="icon">
                <span v-if="file.status === 'idle'"><f-awesome :icon="getFileIconName(file.name)"></f-awesome></span>
                <span v-if="file.status === 'process'"><f-awesome icon="spinner" spin></f-awesome></span>
                <span v-if="file.status === 'uploaded'"><f-awesome icon="check" class="text-success"></f-awesome></span>
                <span v-if="file.status === 'error'"><f-awesome icon="times" class="text-danger"></f-awesome></span>
              </div>
              <div class="name">
                <div>{{ file.name }}</div>
                <div v-if="file.status === 'error'" class="file-error text-danger text-small">{{ file.errorText }}</div>
              </div>
              <div @click="clearFile(index)" class="delete">
                <div class=" btn-sm-circle btn-danger">
                  <f-awesome icon="times"></f-awesome>
                </div>
              </div>
            </li>
          </ul>
          <div v-if="filesComputed.length > 0" class="mrg-t-20">
            <div @click="clearFiles" class="btx btx-sm btx-danger">{{ $t('app_clear_list') }}</div>
            <div @click="submitUploadPopup" class="btx btx-sm btx-success">{{ $t('app_upload') }}</div>
          </div>
        </div>
      </template>
    </popup>

    <popup
        :closeButton="renamePopup.closeButton"
        :actionButton="renamePopup.actionButton"
        :action-class="renamePopup.actionClass"
        :show="renamePopup.show"
        @closePopup="closeRenamePopup"
        @actionPopup="submitRenamePopup"
    >
      <template v-slot:header>Переименование</template>
      <template v-slot:body>
        <div class="input-block">
          <label>{{ $t('form_name') }}</label>
          <input type="text" v-model="renameItemName">
        </div>
      </template>
    </popup>

  </div>
</template>

<script>
import dateFormatMixin from "@/components/mixins/dateFormatMixin.js";
import fileIconMixin from "@/components/mixins/fileIconMixin.js";
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
        closeButton: this.$t('app_close'),
        actionClass: 'btn-success',
      },
      files: [],
      uploadFileStatus: [],
      isDragging: false,

      renamePopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_save'),
        actionClass: 'btn-success',
      },
      renameItemId: 0,
      renameItemName: '',
    }
  },
  mixins: [dateFormatMixin, fileIconMixin],
  props: {
    tree: Array,
    parentId: Number,
    showFallback: Boolean,
  },
  computed: {
    filesComputed() {
      let result = [];
      for (let key in this.files) {
        let status = 'idle';
        let errorText = '';
        for (let keyStat in this.uploadFileStatus) {
          if (this.uploadFileStatus[keyStat].idx === key) {
            status = this.uploadFileStatus[keyStat].status;
            errorText = this.uploadFileStatus[keyStat].errorText;
          }
        }
        const file = {
          name: this.files[key].name,
          size: this.files[key].size,
          lastModified: this.files[key].lastModified,
          status: status,
          errorText: errorText,
        };
        result.push(file);
      }
      return result;
    }
  },
  methods: {
    showRenamePopup(id, name) {
      this.renamePopup.show = true;
      this.renameItemId = id;
      this.renameItemName = name;
    },
    closeRenamePopup() {
      this.renamePopup.show = false;
    },
    submitRenamePopup() {
      this.$store.dispatch("startPreloader");
      driveRepository.rename(this.renameItemId, this.renameItemName).then(resp => {
        this.$emit('update:get-tree');
        this.closeRenamePopup();
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
    getFileIconName(filename) {
      return this.getIconNameByFilename(filename);
    },
    clearFile(idx) {
      this.files.splice(idx, 1);
    },
    clearFiles() {
      this.files = [];
    },
    openFileDialog() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const newFiles = Array.from(event.target.files);
      this.files = [...this.files, ...newFiles];
    },
    handleDrop(event) {
      const newFiles = Array.from(event.dataTransfer.files);
      this.files = [...this.files, ...newFiles];
      this.isDragging = false;
    },

    closeUploadPopup() {
      this.uploadPopup.show = false;
      this.files = [];
      this.uploadFileStatus = [];
    },
    showUploadPopup() {
      this.uploadPopup.show = true;
    },
    submitUploadPopup() {
      for (let key in this.files) {
        let needUpload = true;
        for (let keyStat in this.uploadFileStatus) {
          if (this.uploadFileStatus[keyStat].idx === key) {
            if (
                this.uploadFileStatus[keyStat].status === 'process' ||
                this.uploadFileStatus[keyStat].status === 'uploaded'
            ) {
              needUpload = false;
            }
          }
        }

        if (needUpload) {
          this.upsertUploadFileStatus(key, 'process', '');

          driveRepository.upload(this.files[key], this.parentId).then(resp => {
            this.upsertUploadFileStatus(key, 'uploaded', '');
            this.$emit('update:tree', resp.data);
          }).catch(err => {
            this.upsertUploadFileStatus(key, 'error', err.response.data.message);
            this.$store.dispatch("stopPreloader");
          })
        }
      }
    },
    upsertUploadFileStatus(idx, status, errorText) {
      let exists = false;
      for (let key in this.uploadFileStatus) {
        if (this.uploadFileStatus[key].idx === idx) {
          exists = true;
          this.uploadFileStatus[key].status = status;
          this.uploadFileStatus[key].errorText = errorText;
        }
      }

      if (!exists) {
        this.uploadFileStatus.push({
          idx: idx,
          status: status,
          errorText: errorText,
        })
      }
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
      word-break: break-word;
      overflow-wrap: break-word; /* для лучшей поддержки */
      //width: 550px;
      padding: 8px 8px;
      box-sizing: border-box;
      border-bottom: 1px solid;
      border-color: rgba(212, 212, 212, 0.8);
      font-weight: 700;
    }
    & > div:nth-of-type(1) {
      width: 55%;
    }
    & > div:nth-of-type(2) {
      width: 20%;
    }
    & > div:nth-of-type(3) {
      width: 10%;
    }
    & > div:nth-of-type(4) {
      width: 15%;
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
        //width: 550px;
        padding: 7px 7px;
        box-sizing: border-box;
        border-bottom: 1px solid;
        border-color: rgba(212, 212, 212, 0.8);
        word-wrap: break-word;
      }

      & > div:nth-of-type(1) {
        width: 55%;
      }
      & > div:nth-of-type(2) {
        width: 20%;
      }
      & > div:nth-of-type(3) {
        width: 10%;
      }
      & > div:nth-of-type(4) {
        width: 15%;
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
  .upload-area {
    background-color: #f2f2f3;
    border: 2px dashed #d9d9d9;
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
  .upload-area {
    background-color: #404043;
    border: 2px dashed #535359;
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
  cursor: pointer;
  border-radius: 20px;

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
      text-align: center;
      font-size: 16px;
    }
    .name {
      width: 75%;
    }
    .delete {
      width: 10%;
      text-align: center;
    }
  }
}
@media (max-width: 1380px) {

}
</style>
