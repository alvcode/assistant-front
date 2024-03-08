<template>
  <div class="text-center">
    <div class="croppie-image--img-container">
      <img :src="image" />
    </div>
    <div class="input-block">
      <label class="btn btn-sm btn-info" :for="cropieId">Выбрать изображение...</label>
      <input :id="cropieId" type="file" @change="changePhoto" />
      <div @click="removeImage" class="btn btn-sm btn-danger">
        <f-awesome :icon="['fas', 'times']"></f-awesome>
      </div>
    </div>
    <croppie-component
        :fileModel="fileModel"
        @update:submit="croppieSubmit"
    ></croppie-component>
  </div>
</template>

<script>
import Popup from "@/components/Popup.vue";
import CroppieComponent from "@/components/CroppieComponent.vue";
import fileRepository from "@/repositories/file/index.js";

export default {
  name: "CroppieImage",
  components: {CroppieComponent, Popup},
  emits: ['update:fileId'],
  props: {
    show: Boolean,
    defaultImage: String,
  },
  data() {
    return {
      cropieId: Math.random()
          .toString(36)
          .substring(7),
      image: null, // основная картинка для отображения. Null если должна быть пустая
      imageBase: null, // хэш из компонента CroppieComponent для передачи в REST
      fileModel: null, // записываем сюда event из инпута с type = file для передачи в CroppieComponent

      uploadedFileId: 0,
      uploadedFileUrl: '',
    }
  },
  watch: {
    defaultImage: function(val) {
      this.image = val;
    },
    show: function(val) {
      if (!val) {
        this.image = null;
        this.imageBase = null;
        if (this.fileModel) {
          this.fileModel.target.value = '';
        }
        this.fileModel = null;
      }
    }
  },
  methods: {
    changePhoto(file) {
      this.fileModel = file;
    },
    croppieSubmit(data){
      this.image = data;
      this.imageBase = data;
      this.uploadImage(data);
    },
    uploadImage(base64) {
      this.$store.dispatch("startPreloader");
      fileRepository.uploadBase64(base64).then(resp => {
        this.uploadedFileId = resp.data.id;
        this.uploadedFileUrl = resp.data.upload_file_url;
        this.emitFileId(resp.data.id);
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
    removeImage() {
      this.image = null;
      this.emitFileId(null);
    },
    emitFileId(id) {
      this.$emit('update:fileId', id);
    },
  },
}
</script>

<style scoped lang="less">
.croppie-image--img-container{
  img{
    width: 130px;
    border-radius: 8px;
  }
}
</style>