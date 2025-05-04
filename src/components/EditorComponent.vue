<template>
  <div class="editor-component--container">
    <div ref="editor"></div>

    <div class="additional">
      <div class="actions text-right">
        <div class="btx btx-sm btx-outline-info" @click="showInsertTextPopup">{{ $t('app_insert_third_party_text') }}</div>
        <div class="btx btx-sm btx-outline-info" @click="showForCopyPopup">{{ $t('app_for_copy') }}</div>
      </div>
    </div>

    <popup
        :closeButton="forCopyPopup.closeButton"
        :show="forCopyPopup.show"
        :size="'lg'"
        @closePopup="closeForCopyPopup"
    >
      <template v-slot:header>{{ $t('app_text_for_copy') }}</template>
      <template v-slot:body>
        <div class="for-copy--content">
          <div class="copy-item" v-for="fc in data.blocks" :key="fc.id">
            <div
                v-if="
                  fc.type !== 'list' && fc.type !== 'table' && fc.type !== 'code' && fc.type !== 'alert' &&
                  fc.type !== 'image' && fc.type !== 'attaches'
                "
            >
              {{ decodeStringForCopy(fc.data.text) }}
            </div>
            <div
                v-if="fc.type === 'alert'"
            >
              {{ decodeStringForCopy(fc.data.message) }}
            </div>
            <div v-if="fc.type === 'list'" class="mrg-t-10 mrg-b-10">
              <div class="copy-item-list" v-for="fci in fc.data.items" :key="fci.content">{{ decodeStringForCopy(fci.content) }}</div>
            </div>
            <div v-if="fc.type === 'table'" class="mrg-t-10 mrg-b-10">
              <div class="copy-item-list" v-for="(fcr, index) in fc.data.content" :key="index">
                <span v-for="(columnVal, index) in fcr" :key="index">
                  {{columnVal}} |
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </popup>

    <popup
        :closeButton="insertPopup.closeButton"
        :show="insertPopup.show"
        :action-button="insertPopup.actionButton"
        :action-class="insertPopup.actionClass"
        :size="'lg'"
        @closePopup="closeInsertTextPopup"
        @actionPopup="submitInsertTextPopup"
    >
      <template v-slot:header>{{ $t('app_text_for_insert') }}</template>
      <template v-slot:body>
        <div class="input-block">
          <textarea v-model="insertTextModel" rows="16"></textarea>
        </div>
        <div class="input-block">
          <div class="radio">
            <input type="radio" id="full_replace" v-model="insertTextMode" value="full_replace" />
            <label for="full_replace">{{ $t('app_complete_text_replacement') }}</label>
          </div>
          <div class="radio">
            <input type="radio" id="insert_to_end" v-model="insertTextMode" value="insert_end" />
            <label for="insert_to_end">{{ $t('app_insert_at_the_end_document') }}</label>
          </div>
        </div>
      </template>
    </popup>

  </div>
</template>

<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@coolbytes/editorjs-paragraph";
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import Alert from 'editorjs-alert';
import he from 'he';
import ImageTool from "@editorjs/image";
import AttachesTool from '@editorjs/attaches';

import createGenericInlineTool, {
  ItalicInlineTool,
  UnderlineInlineTool,
} from 'editorjs-inline-tool'
import Popup from "@/components/Popup.vue";
import fileRepository from "@/repositories/file/index.js";

export default {
  name: "EditorComponent",
  components: {Popup},
  emits: ['update:insert'],
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
      forCopyPopup: {
        show: false,
        closeButton: this.$t('app_close'),
      },
      insertPopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_add'),
        actionClass: 'btn-success',
      },
      insertTextModel: '',
      insertTextMode: 'full_replace',
    };
  },
  watch: {
    data: {
      handler (val) {
        this.editor.render(val).then(() => {
          console.log('Editor обновлён!');
        })
        .catch((error) => {
          console.error('Ошибка при обновлении редактора:', error);
        });
      },
      deep: true
    },
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
          table: Table,
          code: CodeTool,
          alert: Alert,
          header: Header,
          list: List,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              preserveBlank: true
            },
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
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file) => {
                 return await fileRepository.upload(file).then((resp) => {
                    return {
                      success: 1,
                      file: {
                        id: resp.data.id,
                        url : resp.data.url
                      }
                    };
                  }).catch(err =>  {
                    this.$store.dispatch("addNotification", {
                      text: err.response.data.message,
                      time: 7,
                      color: "danger"
                    });
                    const index = this.editor.blocks.getCurrentBlockIndex();
                    this.editor.blocks.delete(index);
                    return Promise.reject(err);
                  });
                }
              }
            },
          },
          attaches: {
            class: AttachesTool,
            config: {
              uploader: {
                uploadByFile: async (file) => {
                  const response = await fileRepository.upload(file).then((resp) => {
                    return resp.data;
                  }).catch(err =>  {
                    this.$store.dispatch("addNotification", {
                      text: err.response.data.message,
                      time: 7,
                      color: "danger"
                    });
                  });

                  return {
                    success: 1,
                    file: {
                      id: response.id,
                      url : response.url,
                      name: response.original_filename,
                      extension: response.ext,
                      title: response.original_filename,
                      size: response.size_bytes
                    },
                  };
                }
              }
            }
          }
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
    decodeStringForCopy(str) {
      return this.stripHtmlTags(he.decode(str));
    },
    stripHtmlTags(html) {
      return html.replace(/<[^>]*>/g, '');
    },
    closeForCopyPopup() {
      this.forCopyPopup.show = false;
    },
    showForCopyPopup() {
      this.forCopyPopup.show = true;
    },
    destroyEditor() {
      if (this.editor) {
        this.editor.destroy();
        this.editor = null;
      }
    },
    showInsertTextPopup() {
      this.insertPopup.show = true;
    },
    closeInsertTextPopup() {
      this.insertPopup.show = false;
      this.insertTextModel = '';
      this.insertTextMode = 'full_replace';
    },
    submitInsertTextPopup() {
      const lines = this.insertTextModel.split(/\r?\n/);

      let result = {
        type: this.insertTextMode,
        blocks: []
      };

      let existsLine = false;
      for (let key in lines) {
        if (lines[key].trim() === '') {
          continue;
        }
        result.blocks[result.blocks.length] = this.getParagraph(lines[key]);
        existsLine = true;
      }

      if (!existsLine) {
        return false;
      }

      this.$emit('update:insert', result);
      this.closeInsertTextPopup();
    },
    getParagraph(text) {
      return {
        id: this.generateHash(),
        type: 'paragraph',
        data: {
          text: text,
          align: 'left'
        }
      };
    },
    generateHash(length = 10) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
      return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
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
.copy-item {
  margin-top: 5px;
  overflow-wrap: break-word;
}
</style>