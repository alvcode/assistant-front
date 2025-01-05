<template>
  <back-template>
    <template v-slot:page-title>Заметки</template>
    <template v-slot:page-content>
      <div class="notes--container">
        // заметки
      </div>
    </template>
  </back-template>
</template>

<script>
// @ is an alias to /src

import Popup from "@/components/Popup.vue";
import Formatter from "@/components/libraries/Formatter.js";
import EditorComponent from "@/components/EditorComponent.vue";
import BackTemplate from "@/components/BackTemplate.vue";

const formatter = new Formatter();


export default {
  name: "Notes",
  components: {
    BackTemplate,
    EditorComponent,
    Popup,
  },
  data() {
    return {
      editorData: {
        time: Date.now(),
        blocks: [
          {
            type: "header",
            data: {
              text: "Welcome to Editor.js",
              level: 2,
            },
          },
        ],
      },
    };
  },
  watch: {

  },
  computed: {

  },
  methods: {
    handleEditorChange(data) {
      console.log("Editor Data Updated:", data);
    },
  },
  async created() {

  }
};
</script>

<style scoped lang="less">

</style>
