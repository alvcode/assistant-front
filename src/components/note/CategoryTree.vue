<template>
  <ul class="ul">
    <li
        :class="{'first-level': category.isFirstLevel, 'active': category.active}"
        v-for="category in categories"
        :key="category.id"
    >
      <div class="name" @click="selectItem(category.id)">
        <div class="left">{{ category.name }}</div>
        <div class="actions">
          <div class="up" @click.stop="up(category.id)">
            <f-awesome :icon="['fas', 'arrow-up']" />
          </div>
          <div class="edit" @click.stop="edit(category.id)">
            <f-awesome :icon="['fas', 'pen-to-square']" />
          </div>
          <div class="delete" @click.stop="remove(category.id)">
            <f-awesome icon="times"></f-awesome>
          </div>
        </div>
      </div>
      <CategoryTree v-if="category.children && category.children.length > 0" :categories="category.children" />
    </li>
  </ul>
</template>

<script>

export default {
  name: "CategoryTree",
  data() {
    return {

    }
  },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  computed: {

  },
  methods: {
    selectItem(catId) {
      console.log(catId);
    },
    up(catId) {
      console.log("вверх " +catId);
    },
    edit(catId) {
      console.log("edit " +catId);
    },
    remove(catId) {
      console.log("remove " +catId);
    }
  },
  created() {

  }
};
</script>

<style scoped lang="less">
.ul {
  li {
    & > .name {
      background-color: #7FA1CA;
    }
    .ul {
      li {
        & > .name {
          background-color: #8aacd5;
        }
        .ul {
          li {
            & > .name {
              background-color: #92b4dd;
            }
            .ul {
              li {
                & > .name {
                  background-color: #9cbee6;
                }
                .ul {
                  li {
                    & > .name {
                      background-color: #a7c9f1;
                    }
                    .ul {
                      li {
                        & > .name {
                          background-color: #b2d2f8;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.ul {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
  cursor: pointer;

  li:not(.first-level) {
    margin-left: 18px;
  }
  li.active > .name {
    background-color: #2b70c3;
  }
  li {
    margin-top: 5px;
    color: #fff;

    .name {
      height: 39px;
      line-height: 39px;
      padding: 0 8px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      flex-direction: row;

      .left {
        width: 65%;
      }
      .actions {
        width: 30%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-end;
        flex-direction: row;
        font-size: 20px;

        &>div {
          margin-right: 10px;
        }
        &>div:hover {
          color: #c8faff;
        }
      }
    }
  }
}
</style>
