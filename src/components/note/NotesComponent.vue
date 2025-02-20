<template>
  <div class="notes--container">
    <div class="actions">
      {{categoryId}}
      <div @click="showNewNotePopup" class="btn btn-sm btn-outline-info">
        <f-awesome icon="plus"></f-awesome> {{ $t('app_add') }}
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

export default {
  name: "NotesComponent",
  components: {EditorComponent, CategoryFields, Popup},
  data() {
    return {
      editorData: {
        time: Date.now(),
        blocks: [
          {
            type: "header",
            data: {
              text: "Title",
              level: 2,
            },
          },
        ],
      },
      newNotePopup: {
        show: false,
        closeButton: this.$t('app_cancel'),
        actionButton: this.$t('app_save'),
        actionClass: 'btn-success',
      },
    }
  },
  props: {
    categoryId: {
      type: Number,
      required: true
    }
  },
  computed: {

  },
  methods: {
    showNewNotePopup() {
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

</style>
