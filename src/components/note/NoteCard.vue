<template>
  <div class="note-card">
    <div class="title"><b># {{note.title}}</b></div>
    <div class="updated">{{datetimeToUserTimezone(note.updated_at)}}</div>
    <div class="category">
      <f-awesome :icon="['fas', 'list']" />
      {{note.categoryName}}
    </div>
    <div class="note-menu">
      <div
          @click.stop="showNoteSubmenu(note.id)"
          class="menu-btn"
      >
        <f-awesome :icon="['fas', 'ellipsis-vertical']" />
      </div>
    </div>
    <div
        v-show="note.id === noteIdSubmenu"
        class="menu-block shadow-card"
        @click.stop="false"
    >
      <div v-if="!note.pinned" @click.stop="pin(note.id)" class="pin-note menu-block-item no-select">
        {{ $t('app_pin') }}
      </div>
      <div v-if="note.pinned" @click.stop="unpin(note.id)" class="unpin-note menu-block-item no-select">
        {{ $t('app_unpin') }}
      </div>
      <div @click.stop="deleteNote(note.id)" class="delete-note menu-block-item no-select">
        {{ $t('app_delete') }}
      </div>
    </div>
  </div>
  <div v-show="noteIdSubmenu > 0" class="note-background" @click.stop="clearNoteSubmenu"></div>
</template>

<script>

export default {
  name: "NoteCard",
  emits: ['action:delete', 'action:pin', 'action:unpin'],
  data() {
    return {
      noteIdSubmenu: 0,
    }
  },
  props: {
    note: Object
  },
  computed: {

  },
  methods: {
    datetimeToUserTimezone(datetimeUTC) {
      return this.$dayjs(datetimeUTC).format(this.$t('app_datetime_format'));
    },
    showNoteSubmenu(noteId) {
      this.noteIdSubmenu = noteId;
    },
    clearNoteSubmenu() {
      this.noteIdSubmenu = 0;
    },
    deleteNote(noteId) {
      this.$emit('action:delete', noteId);
    },
    pin(noteId) {
      this.$emit('action:pin', noteId);
    },
    unpin(noteId) {
      this.$emit('action:unpin', noteId);
    },
  },
  created() {

  }
};
</script>

<style scoped lang="less">
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
    margin: 4px 0;
    padding: 5px 0;
  }
  .menu-block-item:hover {
    color: #7c7c7c;
  }
}

.light-theme .updated {
  color: gray;
}
.dark-theme .updated {
  color: gray;
}
.light-theme .category {
  color: gray;
}
.dark-theme .category {
  color: #c8c7c7;
}
.updated {
  margin-top: 5px;
  font-size: 12px;
}
.category {
  margin-top: 5px;
  font-size: 13px;
}
.note-background {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  z-index: 1;
}
</style>
