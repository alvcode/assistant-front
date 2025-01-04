<template>
  <panel-main-template>
    <template v-slot:page-title>Заметки</template>
    <template v-slot:page-content>
      <div class="notes--container">
        // тут должны быть заметки
      </div>
    </template>
  </panel-main-template>
</template>

<script>
// @ is an alias to /src

import PanelMainTemplate from "@/components/MainTemplate.vue";
import Popup from "@/components/Popup.vue";
import Formatter from "@/components/libraries/Formatter.js";

const formatter = new Formatter();


export default {
  name: "Notes",
  components: {
    Popup,
    PanelMainTemplate
  },
  data() {
    return {

    };
  },
  watch: {

  },
  computed: {

  },
  methods: {

  },
  async created() {

  }
};
</script>

<style scoped lang="less">

</style>
