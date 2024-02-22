<template>
  <croppie-component
      :fileModel="fileModel"
      @update:submit="croppieSubmit"
  ></croppie-component>
</template>

<script>
import Popup from "@/components/Popup.vue";
import CroppieComponent from "@/components/CroppieComponent.vue";

/**
 * image: null, // основная картинка для отображения. Null если должна быть пустая
 *       imageBase: null, // хэш из компонента CroppieComponent для передачи в REST
 *       fileModel: null, // записываем сюда event из инпута с type = file для передачи в CroppieComponent
 */
export default {
  name: "CroppieImage",
  components: {CroppieComponent, Popup},
  props: {

  },
  data() {
    return {
      editCroppie: {
        image: null, // основная картинка для отображения. Null если должна быть пустая
        imageBase: null, // хэш из компонента CroppieComponent для передачи в REST
        fileModel: null, // записываем сюда event из инпута с type = file для передачи в CroppieComponent
        stImage: null
      },
      image: null, // основная картинка для отображения. Null если должна быть пустая
      imageBase: null, // хэш из компонента CroppieComponent для передачи в REST
      fileModel: null, // записываем сюда event из инпута с type = file для передачи в CroppieComponent
    }
  },
  methods: {
    croppieSubmit(data){
      this.image = data;
      this.imageBase = data;
    },
  }
}
</script>