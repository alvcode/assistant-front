<template>
  <div ref="editor"></div>
</template>

<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";

export default {
  name: "EditorComponent",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    onChange: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      this.editor = new EditorJS({
        holder: this.$refs.editor,
        data: this.data,
        tools: {
          header: Header,
          list: List,
          // image: {
          //   class: ImageTool,
          //   config: {
          //     endpoints: {
          //       byFile: "http://localhost:8000/uploadFile", // Загрузка файла
          //       byUrl: "http://localhost:8000/fetchUrl",   // Загрузка по URL
          //     },
          //   },
          // },
        },
        onChange: () => {
          if (this.onChange) {
            this.editor.save().then((outputData) => {
              this.onChange(outputData);
            });
          }
        },
      });
    },
    destroyEditor() {
      if (this.editor) {
        this.editor.destroy();
        this.editor = null;
      }
    },
  },
  beforeUnmount() {
    this.destroyEditor();
  },
};
</script>

<style scoped lang="less">
/* Добавьте стили для редактора */
.editor {
  border: 1px solid #ddd;
  padding: 10px;
}
</style>