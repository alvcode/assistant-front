<template>
  <div
      class="shared-drive--container view"
      :class="{'dark-theme': isDarkTheme === true, 'light-theme': isDarkTheme === false}"
  >
    <div class="container">
      <div class="header">
        <div class="header-actions">
          <theme-button :mode="'bool'" :value="isDarkTheme" @input="setIsDarkTheme"></theme-button>
          <lang-index-component></lang-index-component>
        </div>
      </div>
      <div class="shared-drive--content" v-if="showContent">
        <div class="shared-drive--card">
          <div class="file-icon">
            <f-awesome :icon="itemIcon"></f-awesome>
          </div>
          <div class="file-name">{{ item.name }}</div>
          <div class="file-size">{{ $t('app_size') }}: {{ displaySize }}</div>

          <div v-if="item.type === 0 && (archive.pending || archive.ready)" class="archive-info mrg-t-15">
            <div v-if="archive.pending" class="alert alert-success archive-status">
              <span>{{ archiveStatusText }}</span>
              <f-awesome icon="spinner" spin class="mrg-l-10"></f-awesome>
            </div>
            <div v-else-if="archive.ready" class="alert alert-success archive-status">
              {{ $t('app_archive_ready_for_download') }}
            </div>
          </div>

          <div class="download-block mrg-t-20">
            <button
                class="btn btn-success"
                :disabled="downloadDisabled"
                @click="onDownloadClick"
            >
              <span v-if="downloadInProgress"><f-awesome icon="spinner" spin></f-awesome></span>
              <span v-else><f-awesome icon="download"></f-awesome></span>
              {{ downloadButtonText }}
            </button>
          </div>

          <div class="mrg-t-20" v-show="isDownloading">
            <progress-line :percent="progress"></progress-line>
          </div>
        </div>
      </div>
      <div class="error-data text-center" v-if="errorText !== ''">
        <div class="alert alert-danger">{{ errorText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import LangIndexComponent from "@/components/LangIndexComponent.vue";
import ThemeButton from "@/components/ui/ThemeButton.vue";
import ProgressLine from "@/components/ProgressLine.vue";
import fileIconMixin from "@/components/mixins/fileIconMixin.js";
import driveShareRepository from "@/repositories/driveShare/index.js";

const ARCHIVE_STATUS_QUEUED = 0;
const ARCHIVE_STATUS_PROCESSED = 1;
const ARCHIVE_STATUS_COMPLETED = 2;
const ARCHIVE_STATUS_FAILED = 3;

const MAX_ARCHIVE_RESTART_ATTEMPTS = 5;
const ARCHIVE_STATUS_POLL_INTERVAL = 2000;

export default {
  name: "SharedDriveView",
  components: {ProgressLine, ThemeButton, LangIndexComponent},
  mixins: [fileIconMixin],
  data() {
    return {
      data: this.$route.params,
      showContent: false,
      isDarkTheme: false,
      item: null,
      folderSize: null,
      errorText: '',
      isDownloading: false,
      isArchiveChecking: false,
      progress: 0,
      archive: {
        status: -1,
        jobId: null,
        pending: false,
        ready: false,
      },
      pollTimer: null,
    }
  },
  computed: {
    shareHash() {
      return this.data.hash;
    },
    itemIcon() {
      if (!this.item) {
        return 'question';
      }
      return this.item.type === 0 ? ['fas', 'folder'] : this.getIconNameByFilename(this.item.name);
    },
    displaySize() {
      if (!this.item) {
        return '-';
      }
      const bytes = this.item.type === 0 ? this.folderSize : this.item.size;
      if (bytes === null || bytes === undefined) {
        return '-';
      }
      return this.formatSize(bytes);
    },
    downloadInProgress() {
      return this.isDownloading || this.isArchiveChecking || this.archive.pending;
    },
    downloadDisabled() {
      return !this.item || this.downloadInProgress;
    },
    downloadButtonText() {
      if (this.item && this.item.type === 0 && !this.archive.ready) {
        return this.$t('app_download_as_an_archive');
      }
      return this.$t('app_download');
    },
    archiveStatusText() {
      if (this.archive.status === ARCHIVE_STATUS_QUEUED) {
        return this.$t('app_archive_added_to_queue');
      }
      return this.$t('app_archive_is_being_created');
    },
  },
  methods: {
    setIsDarkTheme(val) {
      localStorage.setItem('isDarkTheme', val ? 'true' : 'false');
      this.isDarkTheme = val;
    },
    isDarkThemeEnabled() {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    initTheme() {
      const isDarkTheme = localStorage.getItem('isDarkTheme');
      if (isDarkTheme) {
        this.isDarkTheme = isDarkTheme === 'true';
      } else {
        if (this.isDarkThemeEnabled()) {
          this.setIsDarkTheme(true);
        } else {
          this.setIsDarkTheme(false);
        }
      }
    },
    getErrorMessage(err) {
      if (err && err.response && err.response.data && err.response.data.message) {
        return err.response.data.message;
      }
      return err && err.message ? err.message : this.$t('error_internal_server_error');
    },
    getDetailItem(hash) {
      driveShareRepository.getDetailItem(hash).then((resp) => {
        this.item = resp.data;
        document.title = resp.data.name;
        this.setMeta('og:title', resp.data.name, true);
        this.setMeta('og:type', 'website', true);
        this.showContent = true;

        if (resp.data.type === 0) {
          this.getFolderSize(hash);
        }
      }).catch(err => {
        this.errorText = this.getErrorMessage(err);
      });
    },
    getFolderSize(hash) {
      driveShareRepository.getFullSize(hash).then((resp) => {
        this.folderSize = resp.data.bytes;
      }).catch(err => {
        this.errorText = this.getErrorMessage(err);
      });
    },
    formatSize(size) {
      if (size >= 1024 * 1024 * 1024) {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + ' ' + this.$t('app_gb');
      }
      if (size >= 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + ' ' + this.$t('app_mb');
      }
      return (size / 1024).toFixed(2) + ' KB';
    },
    onDownloadClick() {
      if (!this.item) {
        return;
      }
      if (this.item.type === 0) {
        this.downloadFolder();
        return;
      }
      this.downloadFile();
    },
    async downloadFile() {
      if (this.isDownloading) {
        return;
      }

      this.isDownloading = true;
      this.progress = 0;
      this.errorText = '';

      try {
        if (this.item.is_chunk) {
          const infoResp = await driveShareRepository.getChunksInfo(this.shareHash);
          await this.downloadChunks(
              chunkNumber => driveShareRepository.getChunk(this.shareHash, chunkNumber),
              infoResp.data.start_number,
              infoResp.data.end_number,
              this.item.name
          );
        } else {
          this.progress = 10;
          const resp = await driveShareRepository.getFile(this.shareHash);
          this.progress = 100;
          this.saveBlob(resp.data, this.getFilenameFromHeaders(resp.headers, this.item.name));
        }
      } catch (err) {
        this.errorText = this.getErrorMessage(err);
      } finally {
        this.isDownloading = false;
        this.progress = 0;
      }
    },
    async downloadFolder() {
      if (this.downloadInProgress) {
        return;
      }

      this.isArchiveChecking = true;
      this.errorText = '';

      try {
        let attempts = 0;
        while (attempts < MAX_ARCHIVE_RESTART_ATTEMPTS) {
          attempts++;

          const statusResp = await driveShareRepository.getArchiveStatus(this.shareHash);
          const statusData = statusResp.data;

          if (statusData.existsArchive) {
            this.applyArchiveStatus(statusData);

            if (statusData.status === ARCHIVE_STATUS_COMPLETED) {
              this.stopPolling();
              await this.downloadArchive(statusData.id);
              return;
            }

            this.startPolling();
            return;
          }

          try {
            const createResp = await driveShareRepository.createArchive(this.shareHash);
            this.applyArchiveStatus(createResp.data);
            this.startPolling();
            return;
          } catch (err) {
            if (err && err.response && err.response.data && err.response.data.code === -1) {
              continue;
            }
            throw err;
          }
        }

        this.errorText = this.$t('error_internal_server_error');
      } catch (err) {
        this.errorText = this.getErrorMessage(err);
      } finally {
        this.isArchiveChecking = false;
      }
    },
    async downloadArchive(jobId) {
      if (this.isDownloading) {
        return;
      }

      this.isDownloading = true;
      this.progress = 0;
      this.errorText = '';

      try {
        const infoResp = await driveShareRepository.getArchiveChunksInfo(this.shareHash, jobId);
        await this.downloadChunks(
            chunkNumber => driveShareRepository.getArchiveChunk(this.shareHash, jobId, chunkNumber),
            infoResp.data.start_number,
            infoResp.data.end_number,
            this.item.name + '.zip'
        );
      } catch (err) {
        this.errorText = this.getErrorMessage(err);
      } finally {
        this.isDownloading = false;
        this.progress = 0;
      }
    },
    async downloadChunks(loadChunk, startNumber, endNumber, filename) {
      const total = endNumber - startNumber + 1;
      if (!Number.isInteger(startNumber) || !Number.isInteger(endNumber) || total <= 0) {
        throw new Error(this.$t('error_internal_server_error'));
      }

      const self = this;
      const stream = new ReadableStream({
        async pull(controller) {
          for (let i = startNumber; i <= endNumber; i++) {
            const response = await loadChunk(i);
            const chunk = await response.data.arrayBuffer();
            controller.enqueue(new Uint8Array(chunk));
            self.progress = ((i - startNumber + 1) / total) * 100;
          }
          controller.close();
        }
      });

      const response = new Response(stream);
      const blob = await response.blob();
      this.saveBlob(blob, filename);
    },
    saveBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
    getFilenameFromHeaders(headers, fallback) {
      const contentDisposition = headers ? headers['content-disposition'] : null;
      if (!contentDisposition) {
        return fallback;
      }

      const filenameStar = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
      if (filenameStar && filenameStar[1]) {
        return decodeURIComponent(filenameStar[1]);
      }

      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }

      return fallback;
    },
    applyArchiveStatus(statusData) {
      this.archive.status = statusData.status;
      this.archive.jobId = statusData.id;
      this.archive.pending = statusData.existsArchive &&
          (statusData.status === ARCHIVE_STATUS_QUEUED || statusData.status === ARCHIVE_STATUS_PROCESSED);
      this.archive.ready = statusData.existsArchive && statusData.status === ARCHIVE_STATUS_COMPLETED;
    },
    startPolling() {
      this.stopPolling();
      this.pollTimer = setInterval(() => {
        this.pollArchiveStatus();
      }, ARCHIVE_STATUS_POLL_INTERVAL);
    },
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    },
    async pollArchiveStatus() {
      try {
        const statusResp = await driveShareRepository.getArchiveStatus(this.shareHash);
        const statusData = statusResp.data;

        if (!statusData.existsArchive) {
          this.applyArchiveStatus(statusData);
          this.stopPolling();
          return;
        }

        this.applyArchiveStatus(statusData);

        if (statusData.status === ARCHIVE_STATUS_COMPLETED) {
          this.stopPolling();
        } else if (statusData.status === ARCHIVE_STATUS_FAILED) {
          this.stopPolling();
          this.archive.pending = false;
          this.errorText = this.$t('error_internal_server_error');
        }
      } catch (err) {
        this.stopPolling();
        this.archive.pending = false;
        this.errorText = this.getErrorMessage(err);
      }
    },
    setMeta(nameOrProperty, content, isProperty) {
      let selector = isProperty ? `[property="${nameOrProperty}"]` : `[name="${nameOrProperty}"]`
      let tag = document.head.querySelector(`meta${selector}`)
      if (!tag) {
        tag = document.createElement('meta')
        if (isProperty) tag.setAttribute('property', nameOrProperty)
        else tag.setAttribute('name', nameOrProperty)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }
  },
  beforeMount() {
    this.initTheme();
    this.getDetailItem(this.data.hash);
  },
  beforeUnmount() {
    this.stopPolling();
  },
}
</script>

<style scoped lang="less">
.header {
  margin: 10px auto;
  text-align: center;

  .header-actions {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    flex-direction: row;

    &>div {
      margin: 0 5px;
    }
  }
}
.light-theme {
  &.shared-drive--container {
    position: relative;
    background: #efefef;
  }
  &.shared-drive--container:before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;

    background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>\
<text x='0' y='150' font-size='32' fill='rgba(0,0,0,0.05)' \
font-family='Arial, Helvetica, sans-serif' \
transform='rotate(-45 150 150)'>Assistant</text>\
</svg>");

    background-repeat: repeat;
  }
  .shared-drive--card {
    background-color: #fff;
  }
}
.dark-theme {
  &.shared-drive--container {
    position: relative;
    background: #4a4a4e;
  }
  &.shared-drive--container:before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;

    background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>\
<text x='0' y='150' font-size='32' fill='rgba(0,0,0,0.05)' \
transform='rotate(-45 150 150)'>Assistant</text>\
</svg>");

    background-repeat: repeat;
  }

  .shared-drive--card {
    background-color: #3c3c3e;
  }
}
.error-data {
  width: 700px;
  margin: 30px auto 0 auto;
  position: relative;
  z-index: 1;
}
.shared-drive--content {
  width: 700px;
  margin: 30px auto 0 auto;
  position: relative;
  z-index: 1;
}
.shared-drive--card {
  padding: 35px 25px;
  border-radius: 30px;
  text-align: center;
}
.file-icon {
  font-size: 48px;
}
.file-name {
  margin-top: 12px;
  font-size: 22px;
  word-break: break-all;
}
.file-size {
  margin-top: 8px;
  font-size: 14px;
  color: gray;
}
.archive-status {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
}
.download-block {
  .btn {
    min-width: 200px;
  }
}
.shared-drive--container {
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 1px;
}
@media (max-width: 700px) {
  .header {
    width: 98%;
  }
  .shared-drive--content, .error-data {
    width: 100%;
  }
  .shared-drive--card {
    border-radius: 0;
  }
}
</style>
