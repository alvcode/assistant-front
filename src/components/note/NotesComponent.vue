<template>
  <div class="notes--container">
    <div class="actions">
      <div @click="showNewNotePopup" class="btn btn-sm btn-outline-info">
        <f-awesome icon="plus"></f-awesome> {{ $t('app_add') }}
      </div>
    </div>

    <div class="notes mrg-t-20">
      <div v-show="notes.length === 0" class="empty text-bold text-danger text-center">{{ $t('app_empty_for_now') }}</div>
      <div v-show="notes.length > 0" class="list">
        <div class="note cursor-pointer shadow-card" v-for="item in notes" :key="item.id">
          <div class="title"><b># {{item.title}}</b></div>
          <div class="updated">{{datetimeToUserTimezone(item.updated_at)}}</div>
          <div class="category">
            <f-awesome :icon="['fas', 'list']" />
            {{getCategoryNameById(item.category_id)}}
          </div>
        </div>
      </div>
    </div>

    <popup
        :closeButton="newNotePopup.closeButton"
        :actionButton="newNotePopup.actionButton"
        :action-class="newNotePopup.actionClass"
        :show="newNotePopup.show"
        @closePopup="closeNewNotePopup"
        @actionPopup="submitNewNotePopup"
    >
      <template v-slot:header>Новая заметка</template>
      <template v-slot:body>
        <editor-component :data="editorData" @change="handleEditorChange"></editor-component>
      </template>
    </popup>

  </div>
</template>

<script>

import Popup from "@/components/Popup.vue";
import CategoryFields from "@/components/note/CategoryFields.vue";
import EditorComponent from "@/components/EditorComponent.vue";
import noteRepository from "@/repositories/note/index.js";

export default {
  name: "NotesComponent",
  components: {EditorComponent, CategoryFields, Popup},
  data() {
    return {
      editorData: {
        time: Date.now(),
        blocks: [

        ],
      },
      newNotePopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_save'),
        actionClass: 'btn-success',
      },
      notes: [],
    }
  },
  props: {
    categoryId: {
      type: Number,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
  },
  watch: {
    categoryId: function (val) {
      if (val > 0) {
        this.loadNotes(val);
        //console.log('update notes', val);
      }
    }
  },
  computed: {

  },
  methods: {
    loadNotes(catId) {
      this.$store.dispatch("startPreloader");
      noteRepository.all(catId).then((resp) => {
        this.notes = resp.data;
        this.$store.dispatch("stopPreloader");
      }).catch(err =>  {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.$store.dispatch("stopPreloader");
      });
    },
    datetimeToUserTimezone(datetimeUTC) {
      return this.$dayjs(datetimeUTC).format(this.$t('app_datetime_format'));
    },
    getCategoryNameById(catId) {
      for (let i = 0; i < this.categories.length; i++) {
        if (+this.categories[i].id === +catId) {
          return this.categories[i].name;
        }
      }
    },
    showNewNotePopup() {
      this.editorData.blocks = [
        {
          type: "header",
          data: {
            text: "Title",
            level: 2,
          },
        },
      ];
      this.newNotePopup.show = true;
    },
    closeNewNotePopup() {
      this.newNotePopup.show = false;
    },
    submitNewNotePopup() {
      console.log(this.editorData);
      console.log('submit');
    },
    handleEditorChange(data) {
      this.editorData = data;
      console.log("Editor Data Updated:", data);
    },
  },
  created() {

  }
};
</script>

<style scoped lang="less">
.notes {
  .list {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    flex-direction: row;

    .note {
      margin: 20px 10px;
      width: 300px;

      .title {

      }
      .updated {
        margin-top: 5px;
        font-size: 12px;
        color: gray;
      }
      .category {
        margin-top: 5px;
        font-size: 13px;
        color: gray;
      }
    }
  }
}
</style>
