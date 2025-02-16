<template>
  <div class="category-fields--container">
    <div class="input-block">
      <label>{{ $t('form_name') }}</label>
      <input
          type="text"
          v-model="formData.name"
          @input="updateData"
      >
    </div>
    <div class="input-block">
      <label>{{ $t('form_parent_category') }}</label>
      <select @change="updateData" v-model="formData.parent_id">
        <option value="0">-</option>
        <option v-for="item in categories" :key="item.id" :value="item.id">{{item.name}}</option>
      </select>
    </div>
  </div>
</template>

<script>

export default {
  name: "CategoryFields",
  emits: ['update:data'],
  components: {},
  data() {
    return {
      formData: {
        name: '',
        parent_id: 0
      }
    }
  },
  props: {
    show: Boolean,
    categories: Array,
    defaultValues: Object,
  },
  watch: {
    show: function(val) {
      if (!val) {
        this.formData.name = '';
        this.formData.parent_id = 0;
        this.updateData();
      }
    },
    defaultValues: function(val) {
      if (val) {
        this.formData.name = val.name;
        this.formData.parent_id = val.parent_id;
        this.updateData();
      }
    }
  },
  computed: {

  },
  methods: {
    updateData() {
      this.$emit('update:data', {
        name: this.formData.name,
        parent_id: this.formData.parent_id,
      });
    },
  },
  created() {

  }
}
</script>

<style scoped lang="less">

</style>