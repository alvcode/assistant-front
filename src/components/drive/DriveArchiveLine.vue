<template>
  <div class="drive-archive-line--container">
    <div class="main-content">
      <div class="line-container mrg-t-20" v-if="isExistsArchive === true">
        <div v-if="status === 0" class="line alert alert-success">
          <div class="status-name">{{ $t('app_archive_added_to_queue') }}</div>
          <div class="action mrg-l-15">
            <f-awesome icon="spinner" spin></f-awesome>
          </div>
        </div>
        <div v-if="status === 1" class="line alert alert-success">
          <div class="status-name">{{ $t('app_archive_is_being_created') }}</div>
          <div class="action mrg-l-15">
            <f-awesome icon="spinner" spin></f-awesome>
          </div>
        </div>
        <div v-if="status === 2" class="line alert alert-success">
          <div class="status-name">{{ $t('app_archive_ready_for_download') }}</div>
          <div class="action mrg-l-15">
            <div class="text-info text-underline cursor-pointer" @click="showOpenFilePopup">{{ $t('app_download') }}</div>
          </div>
          <div class="action mrg-l-15">
            <div class="text-danger text-underline cursor-pointer" @click="removeArchive">{{ $t('app_delete') }}</div>
          </div>
        </div>
      </div>
    </div>

    <popup
        :show="openFilePopup.show"
        :closeIfClickBack="true"
        @closePopup="closeOpenFilePopup"
    >
      <template v-slot:header></template>
      <template v-slot:body>
        <div>
          <drive-open-file
              :file="openedFileObject"
              :is-downloading="openedFileDownloadStatus.process"
              :progress="openedFileDownloadStatus.progress"
              @download="downloadArchive"
          ></drive-open-file>
        </div>
      </template>
    </popup>

  </div>
</template>

<script>
import longPollingBus from "@/services/longPollingBus.js";
import driveArchiveRepository from "@/repositories/driveArchive/index.js";
import Popup from "@/components/Popup.vue";
import DriveOpenFile from "@/components/drive/DriveOpenFile.vue";

export default {
  name: "DriveArchiveLine",
  emits: [],
  components: {DriveOpenFile, Popup},
  data() {
    return {
      isExistsArchive: true,
      id: 0,
      status: -1,

      openFilePopup: {
        show: false,
      },
      openedFileObject: {id: 1, name: "archive.zip"},
      openedFileDownloadStatus: {process: false, progress: 0},
    }
  },
  props: {

  },
  computed: {

  },
  methods: {
    setOpenedFileStatus(isProcess, progress) {
      this.openedFileDownloadStatus.process = isProcess;
      this.openedFileDownloadStatus.progress = progress;
    },
    showOpenFilePopup() {
      this.openFilePopup.show = true;
      this.openedFileObject = {id: 1, name: "archive.zip"};
    },
    closeOpenFilePopup() {
      this.openFilePopup.show = false;
    },
    handleArchiveStatusUpdate(payload) {
      if (!payload.existsArchive) {
        this.status = -1;
      } else {
        this.status = payload.status;
      }
      this.isExistsArchive = payload.existsArchive;
      this.id = payload.id;
    },
    getStatus() {
      driveArchiveRepository.getStatus().then(resp => {
        this.handleArchiveStatusUpdate(resp.data)
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
      })
    },
    async downloadArchive() {
      const jobID = this.id;

      let minChunk = 0;
      let maxChunk = 0;
      await driveArchiveRepository.getChunksInfo(jobID).then(resp => {
        minChunk = resp.data.start_number;
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
          for (let i = minChunk; i <= maxChunk; i++) {
            const response = await driveArchiveRepository.getChunk(jobID, i);
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
      this.closeOpenFilePopup();
      this.removeArchive();
    },
    removeArchive() {
      this.$store.dispatch("startPreloader");
      driveArchiveRepository.remove(this.id).then(() => {
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
    this.getStatus();
    this.unsubscribe = longPollingBus.subscribe("archiveStatusUpdate", this.handleArchiveStatusUpdate);
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
</script>

<style scoped lang="less">
.main-content {
  width: 100%;
}
.line {
  display: flex;
  justify-content: left;
}
@media (max-width: 1380px) {

}
</style>
