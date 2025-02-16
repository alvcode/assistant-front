<template>
  <div ref="editor"></div>
</template>

<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@coolbytes/editorjs-paragraph";
//import InlineTool from 'editorjs-inline-tool';
import ImageTool from "@editorjs/image";

import createGenericInlineTool, {
  ItalicInlineTool,
  UnderlineInlineTool,
} from 'editorjs-inline-tool'

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
        inlineToolbar: ['link', 'marker', 'bold', 'italic'],
        data: this.data,
        tools: {
          header: Header,
          list: List,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          bold: {
            class: createGenericInlineTool({
              sanitize: {
                strong: {},
              },
              shortcut: 'CMD+B',
              tagName: 'STRONG',
            }),
          },
          // or use a pre-defined tool instead
          italic: ItalicInlineTool,
          underline: UnderlineInlineTool,
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