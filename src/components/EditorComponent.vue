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
        //inlineToolbar: ['link', 'marker', 'bold', 'italic'],
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
              //toolboxIcon: '<svg class="icon icon--bold" width="12px" height="14px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bold"></use></svg>',
              toolboxIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width: 12px; height: 14px;"><path d="M0 64C0 46.3 14.3 32 32 32l48 0 16 0 128 0c70.7 0 128 57.3 128 128c0 31.3-11.3 60.1-30 82.3c37.1 22.4 62 63.1 62 109.7c0 70.7-57.3 128-128 128L96 480l-16 0-48 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-160L48 96 32 96C14.3 96 0 81.7 0 64zM224 224c35.3 0 64-28.7 64-64s-28.7-64-64-64L112 96l0 128 112 0zM112 288l0 128 144 0c35.3 0 64-28.7 64-64s-28.7-64-64-64l-32 0-112 0z"/></svg>',
            }),
          },
          // or use a pre-defined tool instead
          //italic: ItalicInlineTool,
          italic: {
            class: createGenericInlineTool({
              sanitize: {
                em: {},
              },
              shortcut: 'CMD+I',
              tagName: 'EM',
              toolboxIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width: 12px; height: 14px;"><path d="M128 64c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-58.7 0L160 416l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l58.7 0L224 96l-64 0c-17.7 0-32-14.3-32-32z"/></svg>',
            }),
          },
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