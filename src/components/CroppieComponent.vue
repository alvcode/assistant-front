<template>
  <popup
    :closeButton="croppiePopup.closeButton"
    :show="croppiePopup.show"
    @closePopup="closeCroppiePopup"
  >
    <template v-slot:header>Позиционирование</template>
    <template v-slot:body>
      <div :id="cropieId"></div>
      <div @click="croppieSubmit" class="btn btn-sm btn-success">Применить</div>
      <div @click="croppieRotate" class="btn btn-sm btn-info">
        <f-awesome :icon="['fas', 'sync']" />
      </div>
    </template>
  </popup>
</template>

<script>
import Croppie from "croppie";
import Popup from "@/components/Popup.vue";

export default {
  name: "CroppieComponent",
  components: { Popup },
  emits: ['update:submit'],
  props: {
    fileModel: Event
  },
  watch: {
    fileModel: function(val) {
      if (val) {
        this.readFile(val);
        this.croppiePopup.show = true;
      }
    }
  },
  mounted() {
    this.setUpCroppie();
  },
  data() {
    return {
      croppie: null,
      imageBase: null,
      croppiePopup: {
        show: false,
        closeButton: "Закрыть"
      },
      cropieId: Math.random()
        .toString(36)
        .substring(3)
    };
  },
  methods: {
    closeCroppiePopup() {
      this.croppiePopup.show = false;
    },
    setUpCroppie() {
      let el = document.getElementById(this.cropieId);
      this.croppie = new Croppie(el, {
        viewport: { width: 200, height: 200, type: "square" },
        boundary: { width: 250, height: 250 },
        showZoomer: true,
        enableOrientation: true,
        enableExif: true
      });

      // this.croppie.bind({
      //   url: 'http://i.imgur.com/fHNtPXX.jpg'
      // });
    },
    readFile(event) {
      let eventt = event.target;
      let croppie = this.croppie;
      if (eventt.files && eventt.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          croppie.bind({
            url: e.target.result
          });
        };
        reader.readAsDataURL(eventt.files[0]);
        // console.log(reader);
        // this.croppie.bind({
        //   url: reader.result
        // });
      }
    },
    croppieRotate() {
      this.croppie.rotate(90);
    },
    croppieSubmit() {
      let thisContext = this;

      this.croppie
        .result({
          type: "canvas",
          size: {
            width: 350,
            height: 350
          },
          quality: 0
        })
        .then(function(resp) {
          thisContext.imageBase = resp;
          thisContext.$emit("update:submit", resp);
          thisContext.croppie.bind();
          thisContext.closeCroppiePopup();
        });
      // this.$emit('croppieSubmit', imgBase);
    }
  }
};
</script>

<style scoped lang="less"></style>
