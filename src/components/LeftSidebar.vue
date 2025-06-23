<template>
  <div class="left-sidebar no-select">
    <div class="logo">
      <h4>
        <router-link tag="a" :to="`/`"><b>{{ getProjectName() }}</b></router-link>
      </h4>
    </div>
    <div class="menu">
      <ul>
        <li>
          <router-link tag="a" :to="`/notes/`">
            <div>
              <f-awesome :icon="['fas', 'note-sticky']" />
            </div>
            <div>
              {{$t('app_notes')}}
            </div>
          </router-link>
        </li>
        <li>
          <router-link tag="a" :to="`/drive/`">
            <div>
              <f-awesome :icon="['fas', 'database']" />
            </div>
            <div>
              {{$t('app_drive')}}
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";

export default {
  name: "LeftSidebar",
  computed: {

  },
  methods: {
    getProjectName() {
      return config.projectName;
    },
  }
};
</script>

<style scoped lang="less">
.logo {
  color: #fff;
  text-align: center;
  margin-top: 20px;
  font-size: 26px;
}
.menu {
  margin-top: 10px;

  & > ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      width: 90%;
      margin: 3px auto 0;
      padding-top: 6px;

      a {
        //font-size: 15px;
        color: #ffffff;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        flex-direction: row;
        padding: 10px 0;
        box-sizing: border-box;

        & > div:nth-of-type(1) {
          width: 25%;
          font-size: 16px;
          text-align: center;
        }
        & > div:nth-of-type(2) {
          width: 75%;
          font-size: 15px;
        }
      }
      a:hover svg {
        transform: scale(1.1);
      }
    }
    a.router-link-active {
      border-radius: 10px;
      box-shadow: 0 5px 9px 0 rgba(0, 0, 0, 0.25);
    }
  }
}
.dark-theme a.router-link-active {
  background: rgba(60, 60, 62, 0.9);
}
.light-theme a.router-link-active {
  background-color: #2a4063;
}
</style>
