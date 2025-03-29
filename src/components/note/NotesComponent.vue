<template>
  <div class="notes--container">
    <div class="actions">
      <div @click="showNewNotePopup" class="btx btx-sm btx-outline-info">
        <f-awesome icon="plus"></f-awesome> {{ $t('app_add') }}
      </div>
    </div>

    <div class="search-and-note-actions mrg-t-25" v-show="notes.length > 0">
      <div class="input-with-icons">
        <div class="left-icon">
          <f-awesome :icon="['fas', 'magnifying-glass']" />
        </div>
        <div class="right-icon cursor-pointer" @click="clearSearch" v-show="searchQuery !== ''">
          <f-awesome :icon="['fas', 'xmark']" />
        </div>
        <div class="input-block">
          <input type="text" v-model="searchQuery">
        </div>
      </div>
      <div class="note-actions">
        <div class="sort">
          <div class="sort-btn">
            <div class="">
              <f-awesome :icon="['fas', 'arrow-down-wide-short']" />
              {{$t('app_sort')}}:
              <select class="row-min-select" v-model="selectedSortType">
                <option v-for="item in sortTypes" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="notes mrg-t-10">
      <div v-show="notes.length === 0" class="empty text-bold text-danger text-center">{{ $t('app_empty_for_now') }}</div>
      <div v-show="notes.length > 0" class="list">
        <div class="pinned" v-show="computedPinnedNotes.length > 0">
          <div class="text-hint">{{ $t('app_pinned') }}</div>
          <div class="pinned-cards mrg-b-15">
            <div @click="openNote(item.id)" class="note cursor-pointer shadow-card" v-for="item in computedPinnedNotes" :key="item.id">
              <note-card
                  :note="item"
                  @action:delete="deleteNote"
                  @action:unpin="unpinNote"
              ></note-card>
            </div>
          </div>
        </div>
        <div class="unpinned">
          <div v-if="computedPinnedNotes.length > 0" class="text-hint">{{ $t('app_other_notes') }}</div>
          <div class="unpinned-cards">
            <div @click="openNote(item.id)" class="note cursor-pointer shadow-card" v-for="item in computedUnpinnedNotes" :key="item.id">
              <note-card
                  :note="item"
                  @action:delete="deleteNote"
                  @action:pin="pinNote"
              ></note-card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <popup
        :closeButton="newNotePopup.closeButton"
        :actionButton="newNotePopup.actionButton"
        :action-class="newNotePopup.actionClass"
        :show="newNotePopup.show"
        :size="'lg'"
        @closePopup="closeNewNotePopup"
        @actionPopup="submitEditor"
    >
      <template v-slot:header>
        <span v-if="isNewEditor">{{ $t('app_new_note') }}</span>
        <span v-if="!isNewEditor">{{ $t('app_edit_note') }}</span>
      </template>
      <template v-slot:body>
        <div class="notes--editor">
          <editor-component
              :data="editorData"
              @change="handleEditorChange"
              @update:insert="handleEditorChangeForInsert"
          ></editor-component>
        </div>
        <div v-show="updatedDatetime !== ''" class="notes--updated mrg-t-20">
          {{$t('app_updated')}}: {{updatedDatetime}}
        </div>
      </template>
    </popup>

    <popup
        :closeButton="deleteNotePopup.closeButton"
        :actionButton="deleteNotePopup.actionButton"
        :action-class="deleteNotePopup.actionClass"
        :show="deleteNotePopup.show"
        @closePopup="closeDeleteNotePopup"
        @actionPopup="submitDeleteNotePopup"
    >
      <template v-slot:header>{{ $t('app_deleting_note') }}</template>
      <template v-slot:body>
        {{ $t('app_deleting_note_text') }}
      </template>
    </popup>

  </div>
</template>

<script>

import Popup from "@/components/Popup.vue";
import CategoryFields from "@/components/note/CategoryFields.vue";
import EditorComponent from "@/components/EditorComponent.vue";
import noteRepository from "@/repositories/note/index.js";
import NoteCard from "@/components/note/NoteCard.vue";

export default {
  name: "NotesComponent",
  components: {NoteCard, EditorComponent, CategoryFields, Popup},
  data() {
    return {
      editorData: {
        time: Date.now(),
        blocks: [],
      },
      editorOtherData: {
        id: '',
        categoryId: 0,
        blocks: [],
        updatedAt: ''
      },
      newNotePopup: {
        show: false,
        closeButton: this.$t('app_close'),
        actionButton: this.$t('app_save'),
        actionClass: 'btn-success',
      },
      notes: [],
      blocks: [],
      isNewEditor: false,
      searchQuery: '',
      sortTypes: [
        {id: 1, name: this.$t('app_sort_updated_descending')},
        {id: 2, name: this.$t('app_sort_updated_ascending')},
        {id: 3, name: this.$t('app_sort_created_descending')},
        {id: 4, name: this.$t('app_sort_created_ascending')},
      ],
      selectedSortType: 0,
      //noteIdSubmenu: 0,

      deletedNoteId: 0,
      deleteNotePopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_continue'),
        actionClass: 'btn-success',
      },
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
    categoryId: function(val) {
      if (val > 0) {
        this.loadNotes(val);
      }
    },
    selectedSortType: function(val) {
      localStorage.setItem("sortType", val);
    }
  },
  computed: {
    computedUnpinnedNotes() {
      let result = [];
      for (let key in this.computedNotes) {
        if (!this.computedNotes[key].pinned) {
          result[result.length] = this.computedNotes[key];
        }
      }
      return result;
    },
    computedPinnedNotes() {
      let result = [];
      for (let key in this.computedNotes) {
        if (this.computedNotes[key].pinned) {
          result[result.length] = this.computedNotes[key];
        }
      }
      return result;
    },
    computedNotes() {
      let result = [];
      for (let i = 0; i < this.notes.length; i++) {
        if (this.searchQuery !== '') {
          if (!this.notes[i].title.toLowerCase().includes(this.searchQuery.toLowerCase())) {
            continue;
          }
        }
        let obj = this.notes[i];
        obj.categoryName = this.getCategoryNameById(this.notes[i].category_id);
        result[result.length] = obj;
      }

      if (+this.selectedSortType === 1) {
        return result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      } else if (+this.selectedSortType === 2) {
        return result.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at))
      } else if (+this.selectedSortType === 3) {
        return result.sort((a, b) => b.id - a.id)
      } else if (+this.selectedSortType === 4) {
        return result.sort((a, b) => a.id - b.id)
      }

      return result;
    },
    updatedDatetime() {
      let result = '';
      if (this.editorOtherData.updatedAt !== '') {
        result = this.$dayjs(this.editorOtherData.updatedAt).format(this.$t('app_datetime_format'));
      }
      return result;
    }
  },
  methods: {
    unpinNote(noteId) {
      this.$store.dispatch("startPreloader");
      noteRepository.unpin(noteId).then(() => {
        for (let key in this.notes) {
          if (this.notes[key].id === +noteId) {
            this.notes[key].pinned = false;
          }
        }
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
    pinNote(noteId) {
      this.$store.dispatch("startPreloader");
      noteRepository.pin(noteId).then(() => {
        for (let key in this.notes) {
          if (this.notes[key].id === +noteId) {
            this.notes[key].pinned = true;
          }
        }
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
    deleteNote(noteId) {
      this.deletedNoteId = noteId;
      this.showDeleteNotePopup();
    },
    closeDeleteNotePopup() {
      this.deleteNotePopup.show = false;
      this.noteIdSubmenu = 0;
    },
    showDeleteNotePopup() {
      this.deleteNotePopup.show = true;
    },
    submitDeleteNotePopup() {
      this.$store.dispatch("startPreloader");
      noteRepository.delete(this.deletedNoteId).then(() => {
        this.noteIdSubmenu = 0;
        this.loadNotes(this.categoryId);
        this.closeDeleteNotePopup();
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
    clearSearch() {
      this.searchQuery = '';
    },
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
    getCategoryNameById(catId) {
      for (let i = 0; i < this.categories.length; i++) {
        if (+this.categories[i].id === +catId) {
          return this.categories[i].name;
        }
      }
    },
    showNewNotePopup() {
      if (this.categories.length === 0) {
        this.$store.dispatch("addNotification", {
          text: this.$t('error_must_create_one_category'),
          time: 4,
          color: "danger"
        });
        return false;
      }
      this.editorData.blocks = [{type: "header", data: {text: "Title", level: 2}}];
      this.editorOtherData.blocks = [{type: "header", data: {text: "Title", level: 2}}];
      this.editorOtherData.categoryId = this.categoryId;
      this.editorOtherData.updatedAt = '';
      this.editorOtherData.id = '';
      this.isNewEditor = true;
      this.newNotePopup.show = true;
    },
    closeNewNotePopup() {
      this.newNotePopup.show = false;
    },
    submitEditor() {
      if (this.isNewEditor) {
        this.createNote();
      } else {
        this.updateNote();
      }
    },
    createNote() {
      this.$store.dispatch("startPreloader");
      noteRepository.create({
        category_id: this.editorOtherData.categoryId,
        note_blocks: this.editorOtherData.blocks
      }).then((resp) => {
        this.editorOtherData.updatedAt = resp.data.updated_at;
        this.editorOtherData.id = resp.data.id;
        this.editorData.blocks = resp.data.note_blocks;
        this.isNewEditor = false;
        this.loadNotes(this.categoryId);

        this.$store.dispatch("addNotification", {
          text: this.$t('app_success'),
          time: 3,
          color: "success"
        });

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
    updateNote() {
      this.$store.dispatch("startPreloader");
      noteRepository.update({
        id: this.editorOtherData.id,
        category_id: this.editorOtherData.categoryId,
        note_blocks: this.editorOtherData.blocks
      }).then((resp) => {
        this.editorOtherData.updatedAt = resp.data.updated_at;
        this.editorData.blocks = resp.data.note_blocks;
        this.loadNotes(this.categoryId);

        this.$store.dispatch("addNotification", {
          text: this.$t('app_success'),
          time: 3,
          color: "success"
        });

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
    openNote(noteId) {
      //this.editorData.blocks = [];
      this.loadOne(noteId);
    },
    loadOne(noteId) {
      this.$store.dispatch("startPreloader");
      noteRepository.one(noteId).then((resp) => {
        this.editorOtherData.updatedAt = resp.data.updated_at;
        this.editorOtherData.categoryId = resp.data.category_id;
        this.editorOtherData.id = resp.data.id;
        this.editorOtherData.blocks = resp.data.note_blocks;
        this.editorData.blocks = resp.data.note_blocks;
        this.isNewEditor = false;
        this.newNotePopup.show = true;
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
    handleEditorChangeForInsert(data) {
      this.editorData.blocks = data;
      this.editorOtherData.blocks = data;
    },
    handleEditorChange(data) {
      this.editorOtherData.blocks = data.blocks;
    },
  },
  created() {
    let sort = localStorage.getItem("sortType");
    if (!sort) {
      localStorage.setItem("sortType", '1');
      this.selectedSortType = 1;
    } else {
      this.selectedSortType = +sort;
    }
  }
};
</script>

<style scoped lang="less">
.notes {
  .list {
    .unpinned-cards, .pinned-cards {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      flex-direction: row;
    }

    .note {
      margin: 10px 10px;
      min-width: 290px;
      position: relative;
    }
  }
}
.notes--updated {
  text-align: right;
  font-size: 13px;
  color: gray;
}
.search-and-note-actions {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  flex-direction: row;

  .input-with-icons {
    width: 45%;
  }
  .note-actions {
    width: 45%;
    text-align: right;
    font-size: 13px;
  }
}
@media (max-width: 1605px) {
  .search-and-note-actions {
    flex-wrap: wrap;

    .input-with-icons {
      width: 100%;
    }
    .note-actions {
      width: 100%;
    }
  }
}
@media (max-width: 683px) {
  .notes {
    .list {
      .unpinned-cards, .pinned-cards {
        justify-content: center;
      }
      .note {
        width: 90%;
      }
    }
  }
}
</style>
