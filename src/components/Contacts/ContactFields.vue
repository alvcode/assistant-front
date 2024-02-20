<template>
  <div class="company-fields--container">
    <div class="input-block">
      <label for="">Название компании</label>
      <input
          type="text"
          v-model="company_name"
          @input="updateData"
          @blur="vCompanyName"
      >
      <div class="form-error">{{ errors.company_name }}</div>
    </div>

    <div class="input-block">
      <label for="">Адрес</label>
      <input
          type="text"
          v-model="company_address"
          @input="updateData"
          @blur="vCompanyAddress"
      >
      <div class="form-error">{{ errors.company_address }}</div>
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

    <div class="input-block">
      <label for="">Фамилия</label>
      <input
          type="text"
          v-model="surname"
          @input="updateData"
          @blur="vSurname"
      >
      <div class="form-error">{{ errors.surname }}</div>
    </div>

    <div class="input-block">
      <label for="">Имя</label>
      <input
          type="text"
          v-model="name"
          @input="updateData"
          @blur="vName"
      >
      <div class="form-error">{{ errors.name }}</div>
    </div>

    <div class="input-block">
      <label for="">Отчество</label>
      <input
          type="text"
          v-model="lastname"
          @input="updateData"
          @blur="vLastname"
      >
      <div class="form-error">{{ errors.lastname }}</div>
    </div>

    <div class="input-block">
      <label for="">Номер телефона 1</label>
      <input
          type="text"
          v-model="phone_number_one"
          @input="updateData"
          @blur="vPhoneNumberOne"
      >
      <div class="form-error">{{ errors.phone_number_one }}</div>
    </div>

    <div class="input-block">
      <label for="">Номер телефона 2</label>
      <input
          type="text"
          v-model="phone_number_two"
          @input="updateData"
          @blur="vPhoneNumberTwo"
      >
      <div class="form-error">{{ errors.phone_number_two }}</div>
    </div>
  </div>
</template>

<script>
import Validator from "@/components/libraries/Validator.js";
import PhoneNumber from "@/components/PhoneNumber.vue";
const validator = new Validator();

export default {
  name: "ContactFields",
  emits: ['update:data', 'update:validate'],
  components: {PhoneNumber},
  data() {
    return {
      company_name: '',
      company_address: '',
      site_link: '',
      surname: '',
      name: '',
      lastname: '',
      phone_number_one: '',
      phone_number_two: '',
      errors: {
        company_name: '', company_address: '', site_link: '', surname: '', name: '', lastname: '',
        phone_number_one: '', phone_number_two: '',
      }
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
        this.company_address = '';
        this.site_link = '';
        this.surname = '';
        this.name = '';
        this.lastname = '';
        this.phone_number_one = '';
        this.phone_number_two = '';
        this.updateData();
      }
    },
    defaulValues: function(val) {
      if (val.name) {
        this.company_name = val.company_name;
        this.company_address = val.company_address;
        this.site_link = val.site_link;
        this.surname = val.surname;
        this.name = val.name;
        this.lastname = val.lastname;
        this.phone_number_one = val.phone_number_one;
        this.phone_number_two = val.phone_number_two;
        this.updateData();
      }
    }
  },
  computed: {
    existsValidateErrors() {
      let errorCount = 0;
      this.vCompanyName().result === "error" ? errorCount++ : "";
      this.vCompanyAddress().result === "error" ? errorCount++ : "";
      this.vLink().result === "error" ? errorCount++ : "";
      this.vSurname().result === "error" ? errorCount++ : "";
      this.vName().result === "error" ? errorCount++ : "";
      this.vLastname().result === "error" ? errorCount++ : "";
      this.vPhoneNumberOne().result === "error" ? errorCount++ : "";
      this.vPhoneNumberTwo().result === "error" ? errorCount++ : "";
      return errorCount;
    }
  },
  methods: {
    vCompanyName() {
      const v = validator.validate([
        {fieldName: "Название компании", value: this.company_name, type: "required"},
        {fieldName: "Название компании", value: this.company_name, type: "string", length: 150}
      ]);
      v.result === "error" ? (this.errors.company_name = v.message) : (this.errors.company_name = "");
      return v;
    },
    vCompanyAddress() {
      const v = validator.validate([
        {fieldName: "Адрес", value: this.company_address, type: "string", length: 200}
      ]);
      v.result === "error" ? (this.errors.company_address = v.message) : (this.errors.company_address = "");
      return v;
    },
    vLink() {
      const v = validator.validate([
        {fieldName: "Сайт компании", value: this.site_link, type: "string", length: 200}
      ]);
      v.result === "error" ? (this.errors.site_link = v.message) : (this.errors.site_link = "");
      return v;
    },
    vSurname() {
      const v = validator.validate([
        {fieldName: "Фамилия", value: this.surname, type: "string", length: 100}
      ]);
      v.result === "error" ? (this.errors.surname = v.message) : (this.errors.surname = "");
      return v;
    },
    vName() {
      const v = validator.validate([
        {fieldName: "Имя", value: this.name, type: "string", length: 100}
      ]);
      v.result === "error" ? (this.errors.name = v.message) : (this.errors.name = "");
      return v;
    },
    vLastname() {
      const v = validator.validate([
        {fieldName: "Отчество", value: this.lastname, type: "string", length: 100}
      ]);
      v.result === "error" ? (this.errors.lastname = v.message) : (this.errors.lastname = "");
      return v;
    },
    vPhoneNumberOne() {
      const v = validator.validate([
        {fieldName: "Номер телефона 1", value: this.phone_number_one, type: "string", length: 15}
      ]);
      v.result === "error" ? (this.errors.phone_number_one = v.message) : (this.errors.phone_number_one = "");
      return v;
    },
    vPhoneNumberTwo() {
      const v = validator.validate([
        {fieldName: "Номер телефона 2", value: this.phone_number_two, type: "string", length: 15}
      ]);
      v.result === "error" ? (this.errors.phone_number_two = v.message) : (this.errors.phone_number_two = "");
      return v;
    },
    updateData() {
      this.$emit('update:data', {
        company_name: this.company_name,
        company_address: this.company_address,
        site_link: this.site_link,
        surname: this.surname,
        name: this.name,
        lastname: this.lastname,
        phone_number_one: this.phone_number_one,
        phone_number_two: this.phone_number_two,
      });
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