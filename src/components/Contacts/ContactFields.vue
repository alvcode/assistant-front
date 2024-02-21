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

    <div class="input-block">
      <label for="">E-mail</label>
      <input
          type="text"
          v-model="email"
          @input="updateData"
          @blur="vEmail"
      >
      <div class="form-error">{{ errors.email }}</div>
    </div>

    <div class="input-block">
      <label for="">Ссылка ВК</label>
      <input
          type="text"
          v-model="vk_link"
          @input="updateData"
          @blur="vVkLink"
      >
      <div class="form-error">{{ errors.vk_link }}</div>
    </div>

    <div class="input-block">
      <label for="">Ссылка WhatsApp</label>
      <input
          type="text"
          v-model="whatsapp_link"
          @input="updateData"
          @blur="vWhatsappLink"
      >
      <div class="form-error">{{ errors.whatsapp_link }}</div>
    </div>

    <div class="input-block">
      <label for="">Ссылка Telegram</label>
      <input
          type="text"
          v-model="telegram_link"
          @input="updateData"
          @blur="vTelegramLink"
      >
      <div class="form-error">{{ errors.telegram_link }}</div>
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
      email: '',
      vk_link: '',
      whatsapp_link: '',
      telegram_link: '',
      errors: {
        company_name: '', company_address: '', site_link: '', surname: '', name: '', lastname: '',
        phone_number_one: '', phone_number_two: '', email: '', vk_link: '', whatsapp_link: '',
        telegram_link: '',
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
        this.email = '';
        this.vk_link = '';
        this.whatsapp_link = '';
        this.telegram_link = '';
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
        this.email = val.email;
        this.vk_link = val.vk_link;
        this.whatsapp_link = val.whatsapp_link;
        this.telegram_link = val.telegram_link;
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
      this.vEmail().result === "error" ? errorCount++ : "";
      this.vVkLink().result === "error" ? errorCount++ : "";
      this.vWhatsappLink().result === "error" ? errorCount++ : "";
      this.vTelegramLink().result === "error" ? errorCount++ : "";
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
    vEmail() {
      const v = validator.validate([
        {fieldName: "E-mail", value: this.email, type: "email", length: 100}
      ]);
      v.result === "error" ? (this.errors.email = v.message) : (this.errors.email = "");
      return v;
    },
    vVkLink() {
      const v = validator.validate([
        {fieldName: "Ссылка ВК", value: this.vk_link, type: "string", length: 100}
      ]);
      v.result === "error" ? (this.errors.vk_link = v.message) : (this.errors.vk_link = "");
      return v;
    },
    vWhatsappLink() {
      const v = validator.validate([
        {fieldName: "Ссылка WhatsApp", value: this.whatsapp_link, type: "string", length: 100}
      ]);
      v.result === "error" ? (this.errors.whatsapp_link = v.message) : (this.errors.whatsapp_link = "");
      return v;
    },
    vTelegramLink() {
      const v = validator.validate([
        {fieldName: "Ссылка Telegram", value: this.telegram_link, type: "string", length: 100}
      ]);
      v.result === "error" ? (this.errors.telegram_link = v.message) : (this.errors.telegram_link = "");
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
        email: this.email,
        vk_link: this.vk_link,
        whatsapp_link: this.whatsapp_link,
        telegram_link: this.telegram_link,
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