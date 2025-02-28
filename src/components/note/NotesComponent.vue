<template>
  <div class="notes--container">
    <div class="actions">
      <div @click="showNewNotePopup" class="btn btn-sm btn-outline-info">
        <f-awesome icon="plus"></f-awesome> {{ $t('app_add') }}
      </div>
    </div>

    <div class="search-and-note-actions mrg-t-25" v-show="notes.length > 0">
      <div class="search">
        <div class="search-icon">
          <f-awesome :icon="['fas', 'magnifying-glass']" />
        </div>
        <div @click="clearSearch" v-show="searchQuery !== ''" class="clear-icon">
          <f-awesome :icon="['fas', 'xmark']" />
        </div>
        <div class="input-block">
          <input type="text" v-model="searchQuery">
        </div>
      </div>
      <div class="note-actions">
        <div class="sort">
          <div class="sort-btn">
            <div class="btn btn-sm">
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
        <div @click="openNote(item.id)" class="note cursor-pointer shadow-card" v-for="item in computedNotes" :key="item.id">
          <div class="title"><b># {{item.title}}</b></div>
          <div class="updated">{{datetimeToUserTimezone(item.updated_at)}}</div>
          <div class="category">
            <f-awesome :icon="['fas', 'list']" />
            {{getCategoryNameById(item.category_id)}}
          </div>
          <div class="note-menu">
            <div
                @click.stop="showNoteSubmenu(item.id)"
                class="menu-btn"
            >
              <f-awesome :icon="['fas', 'ellipsis-vertical']" />
            </div>
          </div>
          <div
              v-show="item.id === noteIdSubmenu"
              class="menu-block shadow-card"
              @click.stop="false"
          >
            <div
                @click.stop="deleteNote(item.id)"
                class="delete-note menu-block-item no-select"
            >
              {{ $t('app_delete') }}
            </div>
          </div>
        </div>
      </div>
      <div v-show="noteIdSubmenu > 0" class="note-background" @click="clearNoteSubmenu"></div>
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
          <editor-component :data="editorData" @change="handleEditorChange"></editor-component>
        </div>
        <div v-show="updatedDatetime !== ''" class="notes--updated">
          {{$t('app_updated')}}: {{updatedDatetime}}
        </div>
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
      noteIdSubmenu: 0,
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
    computedNotes() {
      let result = [];
      for (let i = 0; i < this.notes.length; i++) {
        if (this.searchQuery !== '') {
          if (!this.notes[i].title.toLowerCase().includes(this.searchQuery.toLowerCase())) {
            continue;
          }
        }
        result[result.length] = this.notes[i];
      }

      if (+this.selectedSortType === 1) {
        return result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      } else if (+this.selectedSortType === 2) {
        return result.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at))
      } else if (+this.selectedSortType === 3) {
        return result.sort((a, b) => new Date(b.id) - new Date(a.id))
      } else if (+this.selectedSortType === 4) {
        return result.sort((a, b) => new Date(a.id) - new Date(b.id))
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
    deleteNote(noteId) {
      noteRepository.delete(noteId).then(() => {
        this.noteIdSubmenu = 0;
        this.loadNotes(this.categoryId);
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
    showNoteSubmenu(noteId) {
      this.noteIdSubmenu = noteId;
    },
    clearNoteSubmenu() {
      this.noteIdSubmenu = 0;
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
    handleEditorChange(data) {
      this.editorOtherData.blocks = data.blocks;
      console.log("Editor Data Updated:", data);
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;

    .note {
      margin: 10px 10px;
      width: 290px;
      position: relative;

      .note-menu {
        position: absolute;
        top: 3px;
        right: 0;

        .menu-btn {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
        }
      }
      .menu-block {
        position: absolute;
        width: 140px;
        top: -21px;
        right: 0;
        z-index: 2;

        .menu-block-item {
          padding: 5px 0;
        }
      }

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
  .note-background {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    //background-color: rgba(123, 123, 98, 0.4);
    z-index: 1;
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

  .search {
    width: 45%;
    position: relative;

    .search-icon {
      display: inline-block;
      position: absolute;
      top: 5px;
      left: 7px;
    }
    .clear-icon {
      display: inline-block;
      position: absolute;
      top: 5px;
      right: 7px;
      cursor: pointer;
    }

    .input-block {
      input {
        padding-left: 26px !important;
        padding-right: 26px !important;
      }
    }
  }
  .note-actions {
    width: 45%;
    text-align: right;
  }
}
</style>
