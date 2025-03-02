<template>
  <div v-if="manualUpdateCounter > 0" class="update-new-version-manual text-center">
    <div class="update-new-version-manual--window">
      <div>
        <h3>Мы стали лучше!</h3><br>
        <b>Доступна новая версия программы!</b> <br><br>
        Нажмите кнопку <b>"Обновить"</b>, чтобы загрузить новую версию и 
        получить доступ ко всем возможностям Enroller.
        <br><br>
        Если возникла проблема с обновлением, то может помочь сочетание 
        клавиш <b>CTRL + F5</b> (на ПК) либо полный сброс кэша 
        через настройки браузера вашего устройства.
      </div>
      <div class="mrg-t-15">
        <div @click="updatePage" class="btn btn-sm btn-success">Обновить</div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
  name: "UpdateNewVersionManual",
  components: {},
  data(){
    return {
      
    }
  },
  computed: {
    ...mapState({
      manualUpdateCounter: state => state.manual_updater.updateCounter,
    })
  },
  methods: {
    updatePage(){
      window.location.reload(true);
    }
  },
  created() {
    
  },
  beforeDestroy() {
    
  }
};
</script>

<style scoped lang="less">
.update-new-version-manual{
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  z-index: 199999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;

  .update-new-version-manual--window{
    max-width: 500px;
    background-color: rgb(255, 255, 255);
    margin: 0 auto 20px auto;
    border-radius: 5px;
    padding: 15px;
    box-sizing: border-box;
    z-index: 199999;
  }
}
</style>
