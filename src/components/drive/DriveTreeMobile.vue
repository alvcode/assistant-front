<template>
  <div class="drive-tree-mobile--container">
    <div class="actions">
      <div @click="fallBack" v-if="showFallback" class="btx btx-info mrg-t-10">
        <f-awesome icon="arrow-left"></f-awesome>
      </div>
      <div @click="showNewDirectoryPopup" class="btx btx-info mrg-t-10">
        <f-awesome icon="plus"></f-awesome>
        {{ $t('app_drive_create_folder') }}
      </div>
      <div @click="showUploadPopup" class="btx btx-info mrg-t-10">
        <f-awesome icon="upload"></f-awesome>
        {{ $t('app_upload_files') }}
      </div>
      <div @click="selectionModeOn" v-if="treeMode === 0" class="btx btx-outline-info mrg-t-10">
        {{ $t('app_selection_mode') }}
      </div>

      <div @click="cut" v-if="selectedItems.length > 0 && existsSelectedWithoutCut" class="btx btx-outline-info mrg-t-10">
        {{ $t('app_cut') }}
      </div>
      <div @click="renMov" v-if="selectedItems.length > 0 && existsSelectedWithCut" class="btx btx-outline-info mrg-t-10">
        {{ $t('app_insert') }}
      </div>
      <div @click="showDeleteSelected" v-if="selectedItems.length > 0 && treeMode === 1 && !existsSelectedWithCut" class="btx btx-danger mrg-t-10">
        <f-awesome icon="times"></f-awesome>
        {{ $t('app_delete') }}
      </div>

      <div @click="selectionModeOff" v-if="treeMode === 1" class="btx btx-outline-danger mrg-t-10">
        {{ $t('app_selection_mode_cancel') }}
      </div>
    </div>
    <div v-if="existsSelectedWithCut" class="mrg-t-10 text-hint">
      {{ $t('app_entities_cut_for_transfer', {count: this.selectedItems.length}) }}
    </div>
    <div class="table">
      <div class="header">
        <div>{{ $t('app_drive_table_name') }}</div>
        <div></div>
      </div>
      <div class="rows">
        <div
            class="row cursor-pointer no-select"
            :class="{'selected': item.selected === true, 'cut': item.cut === true}"
            v-for="item in treeComputed"
            :key="item.id"
        >
          <div class="row-name-block" @click="clickToItem(item.id, item.type)">
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
            <div class="created-and-size">
              {{ convertDatetime(item.created_at) }} <span v-if="item.type === 1">/ {{ getSize(item.size) }}</span>
            </div>
          </div>
          <div class="text-center">
            <div @click="showItemMenu(item.id, item.name, item.type)" v-if="treeMode === 0" class="btx-sm-circle">
              <f-awesome icon="ellipsis"></f-awesome>
            </div>
            <div v-if="treeMode === 1 && item.selected === true" class="btx-sm-circle">
              <f-awesome icon="check"></f-awesome>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="drive-tree-mobile--item-menu" v-show="itemMenu.show" @click="closeItemMenu">
      <div class="content" @click.stop="false">
        <div class="name">{{ itemMenu.name }}</div>
        <div class="actions mrg-t-30">
          <div>
            <div @click.prevent="showRenamePopup()" class="btx btx-info">
              <f-awesome icon="pen"></f-awesome> {{ $t('app_rename') }}
            </div>
          </div>
          <div class="mrg-t-20">
            <div @click.prevent="showDeletePopup()" class="btx btx-danger">
              <f-awesome icon="times"></f-awesome> {{ $t('app_delete') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <vue-easy-lightbox
        :zoomScale="0.50"
        :visible="lightboxVisible"
        :imgs="lightboxImgs"
        :index="lightboxIndex"
        @hide="handleHide"
        @on-next="lightboxEvent"
        @on-prev="lightboxEvent"
    >
      <template v-slot:prev-btn="{ prev }">
        <div class="lightbox-prev-container" @click="prev">
          <div class="text-info">
            <f-awesome icon="angle-left" v-if="showLightboxPrev"></f-awesome>
          </div>
        </div>
      </template>

      <template v-slot:next-btn="{ next }">
        <div class="lightbox-next-container" @click="next">
          <div class="text-info">
            <f-awesome icon="angle-right" v-if="showLightboxNext"></f-awesome>
          </div>
        </div>
      </template>

      <template v-slot:toolbar="{ toolbarMethods }">
        <div class="lightbox-toolbar">
          <button @click="toolbarMethods.zoomIn" class="btx btx-outline-info">
            <f-awesome icon="magnifying-glass-plus" />
          </button>
          <button @click="toolbarMethods.zoomOut" class="btx btx-outline-info">
            <f-awesome icon="magnifying-glass-minus" />
          </button>
          <button @click="toolbarMethods.rotateLeft" class="btx btx-outline-info">
            <f-awesome icon="rotate-left" />
          </button>
          <button @click="toolbarMethods.rotateRight" class="btx btx-outline-info">
            <f-awesome icon="rotate-right" />
          </button>
          <button @click="downloadImg" class="btx btx-outline-info">
            <f-awesome icon="download" />
          </button>
        </div>
      </template>
    </vue-easy-lightbox>

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
        :closeButton="deleteSelectedPopup.closeButton"
        :actionButton="deleteSelectedPopup.actionButton"
        :action-class="deleteSelectedPopup.actionClass"
        :show="deleteSelectedPopup.show"
        @closePopup="closeDeleteSelectedPopup"
        @actionPopup="submitDeleteSelectedPopup"
    >
      <template v-slot:header>
        {{ $t('app_delete_selected') }}
      </template>
      <template v-slot:body>
        {{ $t('app_delete_selected_text') }}
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
                <div class="progress" v-show="file.status === 'process'">
                  <progress-line :percent="file.progress"></progress-line>
                </div>
              </div>
              <div @click="clearFile(index)" class="delete">
                <div class=" btn-sm-circle btn-danger">
                  <f-awesome icon="times"></f-awesome>
                </div>
              </div>
            </li>
          </ul>
          <div v-if="filesComputed.length > 0" class="mrg-t-20">
            <div @click="clearFiles" class="btx btx-danger">{{ $t('app_clear_list') }}</div>
            <div @click="submitUploadPopup" class="btx btx-success">{{ $t('app_upload') }}</div>
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

    <popup
        :show="openFilePopup.show"
        :closeIfClickBack="true"
        @closePopup="closeOpenFilePopup"
    >
      <template v-slot:header></template>
      <template v-slot:body>
        <drive-open-file
          :file="openedFileObject"
          :is-downloading="openedFileDownloadStatus.process"
          :progress="openedFileDownloadStatus.progress"
          @download="downloadFile"
        ></drive-open-file>
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
import DriveOpenFile from "@/components/drive/DriveOpenFile.vue";
import VueEasyLightbox from 'vue-easy-lightbox'
import ProgressLine from "@/components/ProgressLine.vue";

const MODE_VIEW = 0;
const MODE_SELECT = 1;

const MAX_FILE_SIZE = 64 * 1024 * 1024 // 64 МБ

export default {
  name: "DriveTreeMobile",
  emits: ["fallInside", "fallBack", "update:tree", "update:get-tree"],
  components: {ProgressLine, DriveOpenFile, CategoryFields, Popup, VueEasyLightbox},
  data() {
    return {
      treeMode: 0,
      itemMenu: {
        show: false,
        id: 0,
        name: '',
        type: 0
      },
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

      deleteSelectedPopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_continue'),
        actionClass: 'btn-success',
      },

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

      selectedItems: [],

      openFilePopup: {
        show: false,
      },
      openedFileObject: {id: 0, name: '', size: 0},
      openedFileDownloadStatus: {process: false, progress: 0},

      lightboxVisible: false,
      lightboxIndex: 0,
      lightboxCurrentIndex: 0,
      lightboxImgs: [],
      openImagesIds: [],
    }
  },
  mixins: [dateFormatMixin, fileIconMixin],
  props: {
    tree: Array,
    parentId: Number,
    showFallback: Boolean,
  },
  computed: {
    showLightboxNext() {
      let result = true;
      if (this.lightboxCurrentIndex === (this.openImagesIds.length - 1)) {
        result = false;
      }
      return result;
    },
    showLightboxPrev() {
      return this.lightboxCurrentIndex !== 0;
    },
    existsSelectedWithoutCut() {
      let result = true;
      for (let key in this.selectedItems) {
        if (this.selectedItems[key].type === 'cut') {
          result = false;
          break;
        }
      }
      return result;
    },
    existsSelectedWithCut() {
      let result = false;
      for (let key in this.selectedItems) {
        if (this.selectedItems[key].type === 'cut') {
          result = true;
          break;
        }
      }
      return result;
    },
    treeComputed() {
      let result = [];
      for (let key in this.tree) {
        let item = this.tree[key];
        item.selected = false;
        item.cut = false;

        for (let keySelect in this.selectedItems) {
          if (this.tree[key].id === this.selectedItems[keySelect].id) {
            if (this.selectedItems[keySelect].type === 'select') {
              item.selected = true;
            } else if (this.selectedItems[keySelect].type === 'cut') {
              item.cut = true;
            }
          }
        }
        result.push(item);
      }

      result.sort((a, b) => {
        // Сначала сравниваем type (0 выше 1)
        if (a.type !== b.type) {
          return a.type - b.type; // 0 будет выше 1
        }

        // Если тип одинаковый — сортируем по дате (сначала старые)
        return new Date(a.created_at) - new Date(b.created_at);
      });

      return result;
    },
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
    showItemMenu(itemId, itemName, itemType) {
      this.itemMenu.show = true;
      this.itemMenu.id = itemId;
      this.itemMenu.name = itemName;
      this.itemMenu.type = itemType;
      //this.itemMenu.itemName =
    },
    closeItemMenu() {
      this.itemMenu.show = false;
    },
    selectionModeOn() {
      this.treeMode = MODE_SELECT;
    },
    selectionModeOff() {
      this.treeMode = MODE_VIEW;
      if (this.selectedItems.length > 0 && this.existsSelectedWithoutCut) {
        this.deselectAll();
      }
      if (this.selectedItems.length > 0 && this.existsSelectedWithCut) {
        this.cancelCut();
      }
    },
    setOpenedFileStatus(isProcess, progress) {
      this.openedFileDownloadStatus.process = isProcess;
      this.openedFileDownloadStatus.progress = progress;
    },
    downloadFile() {
      if (this.openedFileObject.is_chunk) {
        this.downloadChunks();
        return;
      }

      this.setOpenedFileStatus(true, 10);
      driveRepository.getFile(this.openedFileObject.id).then(resp => {
        this.setOpenedFileStatus(true, 100);
        const blobUrl = window.URL.createObjectURL(new Blob([resp.data]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", this.getFilenameFromHeaders(resp.headers));
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Освободить память
        window.URL.revokeObjectURL(blobUrl);
        this.setOpenedFileStatus(false, 0);
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.setOpenedFileStatus(false, 0);
      })
    },
    async downloadChunks() {
      const structId = this.openedFileObject.id;

      let maxChunk = 0;
      await driveRepository.getChunksInfo(structId).then(resp => {
        maxChunk = resp.data.end_number;
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
      })

      this.setOpenedFileStatus(true, 2);
      const self = this;
      const stream = new ReadableStream({
        async pull(controller) {
          for (let i = 0; i <= maxChunk; i++) {
            const response = await driveRepository.getChunk(structId, i);
            const chunk = await response.data.arrayBuffer()
            controller.enqueue(new Uint8Array(chunk))
            self.setOpenedFileStatus(true, ((i + 1) / maxChunk) * 100);
          }
          controller.close()
        }
      })

      const response = new Response(stream)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = this.openedFileObject.name
      a.click()

      URL.revokeObjectURL(url)
      this.setOpenedFileStatus(false, 0);
    },
    downloadImg() {
      let blobUrl = this.lightboxImgs[this.lightboxCurrentIndex].src
      let link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", this.lightboxImgs[this.lightboxCurrentIndex].title);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    lightboxEvent(oldIndex, newIndex) {
      this.loadImage(this.openImagesIds[newIndex].id, newIndex);
      this.lightboxImgs[oldIndex] = new URL('../../assets/img/transparent_dot.png', import.meta.url).href;
    },
    lightboxShowImg(index) {
      this.lightboxIndex = index;
      this.lightboxCurrentIndex = index;
      this.lightboxVisible = true;
    },
    loadImage(itemId, setIdx) {
      this.$store.dispatch("startPreloader");
      driveRepository.getFile(itemId).then(resp => {
        this.$store.dispatch("stopPreloader");
        this.lightboxImgs[setIdx] = {src: URL.createObjectURL(resp.data), title: this.getFilenameFromHeaders(resp.headers)};
        this.lightboxCurrentIndex = setIdx;
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.$store.dispatch("stopPreloader");
      })
    },
    handleHide() {
      this.lightboxVisible = false
    },
    closeOpenFilePopup() {
      this.openFilePopup.show = false;
    },
    showOpenFilePopup(file) {
      this.openedFileObject = file;
      this.openFilePopup.show = true;
    },
    renMov() {
      let structIds = [];
      for (let key in this.selectedItems) {
        structIds[structIds.length] = this.selectedItems[key].id;
      }
      this.$store.dispatch("startPreloader");
      driveRepository.renMov(structIds, this.parentId).then(() => {
        this.$emit('update:get-tree');
        this.deselectAll();
        this.selectionModeOff();
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
    cancelCut() {
      this.selectedItems = [];
    },
    cut() {
      for (let key in this.selectedItems) {
        this.selectedItems[key].type = 'cut';
      }
    },
    deselectAll() {
      this.selectedItems = [];
    },
    deselectIfOnlySelected() {
      for (let key in this.selectedItems) {
        if (this.selectedItems[key].type === 'select') {
          this.selectedItems = [];
          break;
        }
      }
    },
    selectItemToggle(id) {
      if (this.existsSelectedWithCut) {
        return;
      }
      for (let key in this.selectedItems) {
        if (this.selectedItems[key].id === id) {
          this.selectedItems.splice(key, 1);
          return;
        }
      }
      this.selectedItems.push({id: id, type: 'select'});
    },
    showRenamePopup() {
      this.renamePopup.show = true;
      this.renameItemId = this.itemMenu.id;
      this.renameItemName = this.itemMenu.name;
      this.closeItemMenu();
    },
    closeRenamePopup() {
      this.renamePopup.show = false;
    },
    submitRenamePopup() {
      this.$store.dispatch("startPreloader");
      driveRepository.rename(this.renameItemId, this.renameItemName).then(() => {
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
          if (this.files[key].size <= MAX_FILE_SIZE) {
            this.upsertUploadFileStatus(key, 'process', '');

            driveRepository.upload(this.files[key], this.parentId).then(resp => {
              this.upsertUploadFileStatus(key, 'uploaded', '');
              this.$emit('update:tree', resp.data);
            }).catch(err => {
              this.upsertUploadFileStatus(key, 'error', err.response.data.message);
              this.$store.dispatch("stopPreloader");
            })
          } else {
            this.uploadByChunks(this.files[key], key, this.parentId);
          }
        }
      }
    },
    async uploadByChunks(file, fileKey, parentId) {
      const CHUNK_SIZE = 45 * 1024 * 1024 // 45 МБ
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

      let structId = 0;
      await driveRepository.chunkPrepare(file.name, file.size, parentId).then(resp => {
        structId = resp.data.struct_id;
      }).catch(err => {
        this.upsertUploadFileStatus(fileKey, 'error', 0, err.response.data.message);
        this.$store.dispatch("stopPreloader");
      })

      if (structId === 0) {
        return false;
      }

      let progressPercent = 0;
      for (let i = 0; i < totalChunks; i++) {
        this.upsertUploadFileStatus(fileKey, 'process', progressPercent, '');
        const start = i * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end)

        let isOK = false;
        await driveRepository.uploadChunk(chunk, structId, i).then(() => {
          isOK = true;
        }).catch(err => {
          this.upsertUploadFileStatus(fileKey, 'error', 0, err.response.data.message);
          this.$store.dispatch("stopPreloader");
        })

        if (!isOK) {
          break;
        }

        progressPercent = ((i + 1) / totalChunks) * 100
      }

      await driveRepository.chunkEnd(structId).then(() => {
        this.upsertUploadFileStatus(fileKey, 'uploaded', 100, '');
        this.$emit('update:get-tree');
      }).catch(err => {
        this.upsertUploadFileStatus(fileKey, 'error', 0, err.response.data.message);
        this.$store.dispatch("stopPreloader");
      })
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
    clickToItem(itemId, itemType) {
      if (this.treeMode === MODE_VIEW) {
        this.fallInside(itemId, itemType);
      } else if (this.treeMode === MODE_SELECT) {
        if (this.existsSelectedWithCut) {
          this.fallInside(itemId, itemType);
        } else {
          this.selectItemToggle(itemId);
        }
      }
      //selectItemToggle
    },
    fallInside(itemId, itemType) {
      if (itemType === 0) {
        this.deselectIfOnlySelected();
        this.$emit('fallInside', itemId);
      } else {
        let isImgAndLight = false;
        for (let key in this.treeComputed) {
          if (
              this.treeComputed[key].id === itemId &&
              this.filenameIsImage(this.treeComputed[key].name) && !this.treeComputed[key].is_chunk
          ) {
            isImgAndLight = true;
          }
        }

        if (isImgAndLight) {
          let clickIdx = 0;
          let x = 0;
          this.openImagesIds = [];
          for (let key in this.treeComputed) {
            if (this.filenameIsImage(this.treeComputed[key].name) && !this.treeComputed[key].is_chunk) {
              this.openImagesIds.push({id: this.treeComputed[key].id});
              if (this.treeComputed[key].id === itemId) {
                clickIdx = x;
              }
              x++;
            }
          }

          this.lightboxImgs = [];
          for (let key in this.openImagesIds) {
            this.lightboxImgs.push(new URL('../../assets/img/transparent_dot.png', import.meta.url).href);
          }

          // открываем файл
          this.$store.dispatch("startPreloader");
          driveRepository.getFile(itemId).then(resp => {
            this.$store.dispatch("stopPreloader");
            this.lightboxImgs[clickIdx] = {src: URL.createObjectURL(resp.data), title: this.getFilenameFromHeaders(resp.headers)};
            this.lightboxShowImg(clickIdx);
          }).catch(err => {
            this.$store.dispatch("addNotification", {
              text: err.response.data.message,
              time: 5,
              color: "danger"
            });
            this.$store.dispatch("stopPreloader");
          })
        } else {
          for (let key in this.treeComputed) {
            if (this.treeComputed[key].id === itemId) {
              this.showOpenFilePopup(this.treeComputed[key]);
            }
          }
        }
      }
    },
    getFilenameFromHeaders(headers) {
      let fileName = "img.jpg";
      const contentDisposition = headers['content-disposition'];
      if (!contentDisposition) return fileName;

      const filenameStar = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
      if (filenameStar && filenameStar[1]) {
        return decodeURIComponent(filenameStar[1]);
      }

      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1]);
      }

      return fileName;
    },
    fallBack() {
      this.deselectIfOnlySelected();
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
    showDeletePopup() {
      this.deletedId = this.itemMenu.id;
      this.deletedType = this.itemMenu.type;
      this.deleteName = this.itemMenu.name;
      this.deletePopup.show = true;
      this.closeItemMenu();
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
    showDeleteSelected() {
      this.deleteSelectedPopup.show = true;
    },
    closeDeleteSelectedPopup() {
      this.deleteSelectedPopup.show = false;
    },
    async submitDeleteSelectedPopup() {
      this.$store.dispatch("startPreloader");
      for (let key in this.selectedItems) {
        await driveRepository.delete(this.selectedItems[key].id).then(() => {}).catch(err => {
          this.$store.dispatch("addNotification", {
            text: err.response.data.message,
            time: 5,
            color: "danger"
          });
          this.$store.dispatch("stopPreloader");
        })
      }

      this.closeDeleteSelectedPopup();
      this.selectionModeOff();
      this.$emit('update:get-tree');
      this.$store.dispatch("stopPreloader");
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
      font-size: 15px;
    }
    & > div:nth-of-type(1) {
      width: 80%;
    }
    & > div:nth-of-type(2) {
      width: 20%;
    }
  }

  .rows {
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
        padding: 7px 7px;
        box-sizing: border-box;
        border-bottom: 1px solid;
        border-color: rgba(212, 212, 212, 0.8);
        word-wrap: break-word;
        font-size: 16px;
      }

      & > div:nth-of-type(1) {
        width: 80%;
      }
      & > div:nth-of-type(2) {
        width: 20%;
      }
    }
  }
}
// theme
.light-theme {
  .table {
    .rows {
      .row:not(.selected):hover > div {
        background-color: #e6f8ff !important;
      }
      .row.selected {
        background-color: #daf3fb !important;
      }
      .row.cut {
        color: #b3b3b3;
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
      .row:not(.selected):hover > div {
        background-color: #404043 !important;
      }
      .row.selected {
        background-color: #48484c !important;
      }
      .row.cut {
        color: #636363;
      }
    }
  }
  .upload-area {
    background-color: #404043;
    border: 2px dashed #535359;
  }
}
.created-and-size {
  margin-top: 5px;
  font-size: 11px;
  color: gray;
}
.row--name {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  flex-direction: row;

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
.lightbox-toolbar {
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
}
.lightbox-prev-container {
  position: fixed;
  width: 36px;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto 0;

  & > div {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    font-size: 20px;
  }
}
.lightbox-next-container {
  position: fixed;
  width: 36px;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto 0;

  & > div {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    font-size: 20px;
  }
}
.drive-tree-mobile--item-menu {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;

  .content {
    width: 100%;
    height: 30vh;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    margin: 0 auto;
    text-align: center;

    .name {
      padding: 20px 10px 0 10px;
      font-size: 16px;
    }
  }
}
.light-theme {
  .drive-tree-mobile--item-menu {
    background-color: rgba(0, 0, 0, 0.7);

    .content {
      background-color: #fff;
    }
  }
}
.dark-theme {
  .drive-tree-mobile--item-menu {
    background-color: rgba(0, 0, 0, 0.5);

    .content {
      background-color: #3c3c3e;
      color: #fff;
    }
  }
}
@media (max-width: 1380px) {

}
</style>
