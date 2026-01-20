<template>
  <div
      class="shared-note--container view"
      :class="{'dark-theme': isDarkTheme === true, 'light-theme': isDarkTheme === false}"
  >
    <div class="container">
      <div class="header">
        <div class="header-actions">
          <theme-button :mode="'bool'" :value="isDarkTheme" @input="setIsDarkTheme"></theme-button>
          <lang-index-component></lang-index-component>
        </div>
      </div>
      <div class="shared-note--content text-center" v-if="showContent">
        <div class="shared-note--editor">
          <editor-component
              :data="editorData"
              :hideTextInsert="true"
              :readOnly="true"
          ></editor-component>
        </div>
      </div>
      <div class="error-data text-center" v-if="errorText !== ''">
        <div class="alert alert-danger">{{ errorText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import LangIndexComponent from "@/components/LangIndexComponent.vue";
import ThemeButton from "@/components/ui/ThemeButton.vue";
import EditorComponent from "@/components/EditorComponent.vue";
import shareRepository from "@/repositories/share/index.js";

export default {
  name: "SharedNoteView",
  components: {EditorComponent, ThemeButton, LangIndexComponent},
  data() {
    return {
      data: this.$route.params,
      showContent: false,
      isDarkTheme: false,
      editorData: {
        time: Date.now(),
        blocks: [],
      },
      errorText: ''
    }
  },
  computed: {

  },
  methods: {
    setIsDarkTheme(val) {
      localStorage.setItem('isDarkTheme', val ? 'true' : 'false');
      this.isDarkTheme = val;
    },
    isDarkThemeEnabled() {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    initTheme() {
      const isDarkTheme = localStorage.getItem('isDarkTheme');
      if (isDarkTheme) {
        this.isDarkTheme = isDarkTheme === 'true';
      } else {
        if (this.isDarkThemeEnabled()) {
          this.setIsDarkTheme(true);
        } else {
          this.setIsDarkTheme(false);
        }
      }
    },
    getByHash(hash) {
      shareRepository.getByHash(hash).then((resp) => {
        this.editorData.blocks = resp.data.note_blocks;
        this.showContent = true;
      }).catch(err => {
        this.errorText = err.response.data.message;
      });
    },
  },
  beforeMount() {
    this.initTheme();
    this.getByHash(this.data.hash)
  },
}
</script>

<style scoped lang="less">
.header {
  //width: 500px;
  margin: 10px auto;
  text-align: center;

  .header-actions {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    flex-direction: row;

    &>div {
      margin: 0 5px;
    }
  }
}
.light-theme {
  &.shared-note--container {
    position: relative;
    background: #efefef;
  }
  &.shared-note--container:before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;

    background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>\
<text x='0' y='150' font-size='32' fill='rgba(0,0,0,0.05)' \
font-family='Arial, Helvetica, sans-serif' \
transform='rotate(-45 150 150)'>Assistant</text>\
</svg>");

    background-repeat: repeat;
  }
  .shared-note--content {
    background-color: #fff;
  }
}
.dark-theme {
  &.shared-note--container {
    position: relative;
    background: #4a4a4e;
  }
  &.shared-note--container:before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;

    background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>\
<text x='0' y='150' font-size='32' fill='rgba(0,0,0,0.05)' \
transform='rotate(-45 150 150)'>Assistant</text>\
</svg>");

    background-repeat: repeat;
  }

  .shared-note--content {
    background-color: #3c3c3e;
  }
}
.error-data {
  width: 700px;
  margin: 30px auto 0 auto;
  position: relative;
  z-index: 1;
}
.shared-note--content {
  width: 700px;
  margin: 30px auto 0 auto;
  padding-top: 25px;
  padding-bottom: 35px;
  border-radius: 30px;
  position: relative;
  z-index: 1;

  .shared-note--editor {
    width: 95%;
    margin: 0 auto;
  }
}
.shared-note--container {
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 1px;
}
@media (max-width: 700px) {
  .header {
    width: 98%;
  }
  .shared-note--content {
    width: 100%;
  }
}
</style>