<template>
  <div class="company-fields--container">
    <div class="input-block">
      <croppie-image></croppie-image>
    </div>
    <div class="input-block">
      <label for="">Название компании <span class="req">*</span></label>
      <input
          type="text"
          v-model="name"
          @input="updateData"
          @blur="vName"
      >
      <div class="form-error">{{ errors.name }}</div>
    </div>
    <div class="input-block">
      <label for="">Адрес</label>
      <input
          type="text"
          v-model="address"
          @input="updateData"
          @blur="vAddress"
      >
      <div class="form-error">{{ errors.address }}</div>
    </div>
    <div class="input-block">
      <label for="">Сайт компании</label>
      <input
          type="text"
          v-model="site_link"
          @input="updateData"
          @blur="vLink"
      >
      <div class="form-error">{{ errors.site_link }}</div>
    </div>
  </div>
</template>

<script>
import Validator from "@/components/libraries/Validator.js";
import CroppieImage from "@/components/File/CroppieImage.vue";
const validator = new Validator();

export default {
  name: "CompanyFields",
  emits: ['update:data', 'update:validate'],
  components: {CroppieImage},
  data() {
    return {
      name: '',
      address: '',
      site_link: '',
      errors: {name: '', address: '', site_link: ''}
    }
  },
  props: {
    show: Boolean,
    defaulValues: Object,
  },
  watch: {
    show: function(val) {
      if (!val) {
        this.name = '';
        this.address = '';
        this.site_link = '';
        this.updateData();
      }
    },
    defaulValues: function(val) {
      if (val.name) {
        this.name = val.name;
        this.address = val.address;
        this.site_link = val.site_link;
        this.updateData();
      }
    }
  },
  computed: {
    existsValidateErrors() {
      let errorCount = 0;
      this.vName().result === "error" ? errorCount++ : "";
      this.vAddress().result === "error" ? errorCount++ : "";
      this.vLink().result === "error" ? errorCount++ : "";
      return errorCount;
    }
  },
  methods: {
    vName() {
      const v = validator.validate([
        {fieldName: "Название компании", value: this.name, type: "required"},
        {fieldName: "Название компании", value: this.name, type: "string", length: 150}
      ]);
      v.result === "error" ? (this.errors.name = v.message) : (this.errors.name = "");
      return v;
    },
    vAddress() {
      const v = validator.validate([
        {fieldName: "Адрес", value: this.address, type: "string", length: 200}
      ]);
      v.result === "error" ? (this.errors.address = v.message) : (this.errors.address = "");
      return v;
    },
    vLink() {
      const v = validator.validate([
        {fieldName: "Сайт компании", value: this.site_link, type: "string", length: 200}
      ]);
      v.result === "error" ? (this.errors.site_link = v.message) : (this.errors.site_link = "");
      return v;
    },
    updateData() {
      this.$emit('update:data', { name: this.name, address: this.address, site_link: this.site_link });
      this.updateValidate();
    },
    updateValidate() {
      this.$emit('update:validate', this.existsValidateErrors <= 0);
    }
  },
  created() {
    this.updateValidate();
  }
}
</script>

<style scoped lang="less">

</style>