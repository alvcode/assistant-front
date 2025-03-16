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
      <CategoryTree
          v-if="category.children && category.children.length > 0"
          :categories="category.children"
          @update:selectedCat="selectItem"
          @action:delete="remove"
          @action:edit="edit"
          @action:up="up"
      />
    </li>
  </ul>
</template>

<script>

export default {
  name: "CategoryTree",
  emits: ['update:selectedCat', 'action:delete', 'action:edit', 'action:up'],
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
      this.$emit('update:selectedCat', catId);
    },
    up(catId) {
      this.$emit('action:up', catId);
    },
    edit(catId) {
      this.$emit('action:edit', catId);
    },
    remove(catId) {
      this.$emit('action:delete', catId);
    }
  },
  created() {

  }
};
</script>

<style scoped lang="less">
.ul {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
  cursor: pointer;

  li:not(.first-level) {
    margin-left: 18px;
  }
  li.active > .name {
    background-color: #f1f1ff !important;
  }
  li {
    margin-top: 5px;

    .name {
      border: .5px solid #ededed;
      height: 39px;
      line-height: 39px;
      padding: 0 8px;
      border-radius: 10px;
      font-size: 15px;
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
          color: #838383;
        }
      }
    }
  }
}
</style>
