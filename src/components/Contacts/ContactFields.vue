<template>
  <div class="company-fields--container">
    <croppie-image
        :show="show"
        :default-image="upload_file_url"
        @update:file-id="updateFileId"
    ></croppie-image>

    <div class="input-block">
      <label>Название компании</label>
      <input
          type="text"
          v-model="company_name"
          @input="updateData"
          @blur="vCompanyName"
      >
      <div class="form-error">{{ errors.company_name }}</div>
    </div>

    <div class="input-block">
      <label>Адрес</label>
      <input
          type="text"
          v-model="company_address"
          @input="updateData"
          @blur="vCompanyAddress"
      >
      <div class="form-error">{{ errors.company_address }}</div>
    </div>

    <div class="input-block">
      <label>Сайт компании</label>
      <input
          type="text"
          v-model="site_link"
          @input="updateData"
          @blur="vLink"
      >
      <div class="form-error">{{ errors.site_link }}</div>
    </div>

    <div class="input-block">
      <label>Доп.ссылка на свой внешний ресурс</label>
      <input
          type="text"
          v-model="add_resource_link"
          @input="updateData"
          @blur="vAddResourceLink"
      >
      <div class="form-error">{{ errors.add_resource_link }}</div>
    </div>

    <div class="input-block">
      <label>Фамилия</label>
      <input
          type="text"
          v-model="surname"
          @input="updateData"
          @blur="vSurname"
      >
      <div class="form-error">{{ errors.surname }}</div>
    </div>

    <div class="input-block">
      <label>Имя</label>
      <input
          type="text"
          v-model="name"
          @input="updateData"
          @blur="vName"
      >
      <div class="form-error">{{ errors.name }}</div>
    </div>

    <div class="input-block">
      <label>Отчество</label>
      <input
          type="text"
          v-model="lastname"
          @input="updateData"
          @blur="vLastname"
      >
      <div class="form-error">{{ errors.lastname }}</div>
    </div>

    <div class="input-block">
      <label>Должность</label>
      <input
          type="text"
          v-model="profession"
          @input="updateData"
          @blur="vProfession"
      >
      <div class="form-error">{{ errors.profession }}</div>
    </div>

    <div class="input-block">
      <label>Номер телефона 1</label>
      <phone-number
          v-model="phone_number_one"
          @input="updateData"
          @update:input="updateData"
          @update:mask="setPhoneMaskOne"
      ></phone-number>
      <div class="form-error">{{ errors.phone_number_one }}</div>
    </div>

    <div class="input-block">
      <label>Номер телефона 2</label>
      <phone-number
          v-model="phone_number_two"
          @input="updateData"
          @update:input="updateData"
          @update:mask="setPhoneMaskTwo"
      ></phone-number>
      <div class="form-error">{{ errors.phone_number_two }}</div>
    </div>

    <div class="input-block">
      <label>E-mail</label>
      <input
          type="text"
          v-model="email"
          @input="updateData"
          @blur="vEmail"
      >
      <div class="form-error">{{ errors.email }}</div>
    </div>

    <div class="input-block">
      <label>Ссылка ВК</label>
      <input
          type="text"
          v-model="vk_link"
          @input="updateData"
          @blur="vVkLink"
      >
      <div class="form-error">{{ errors.vk_link }}</div>
    </div>

    <div class="input-block">
      <label>Ссылка WhatsApp</label>
      <input
          type="text"
          v-model="whatsapp_link"
          @input="updateData"
          @blur="vWhatsappLink"
      >
      <div class="form-error">{{ errors.whatsapp_link }}</div>
    </div>

    <div class="input-block">
      <label>Ссылка Telegram</label>
      <input
          type="text"
          v-model="telegram_link"
          @input="updateData"
          @blur="vTelegramLink"
      >
      <div class="form-error">{{ errors.telegram_link }}</div>
    </div>

    <div class="input-block">
      <label>Ссылка на карты</label>
      <input
          type="text"
          v-model="map_link"
          @input="updateData"
          @blur="vMapLink"
      >
      <div class="form-error">{{ errors.map_link }}</div>
    </div>

    <div class="input-block">
      <label>Шаблон визитки</label>
      <select @change="updateData" v-model="template_id">
        <option value="0">Выберите значение</option>
        <option v-for="item in templates" :key="item.id" :value="item.id">{{item.name}}</option>
      </select>
      <div class="form-error">{{ errors.template_id }}</div>
    </div>
  </div>
</template>

<script>
import Validator from "@/components/libraries/Validator.js";
import PhoneNumber from "@/components/PhoneNumber.vue";
import CroppieImage from "@/components/File/CroppieImage.vue";
const validator = new Validator();

export default {
  name: "ContactFields",
  emits: ['update:data', 'update:validate', 'update:photo'],
  components: {CroppieImage, PhoneNumber},
  data() {
    return {
      upload_file_url: null,
      phoneMaskOne: "",
      phoneMaskTwo: "",

      upload_file_id: '',
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
      template_id: 0,
      profession: '',
      map_link: '',
      add_resource_link: '',
      errors: {
        company_name: '', company_address: '', site_link: '', surname: '', name: '', lastname: '',
        phone_number_one: '', phone_number_two: '', email: '', vk_link: '', whatsapp_link: '',
        telegram_link: '', template_id: '', profession: '', map_link: '', add_resource_link: '',
      }
    }
  },
  props: {
    show: Boolean,
    defaulValues: Object,
    templates: Array,
  },
  watch: {
    show: function(val) {
      if (!val) {
        this.upload_file_url = null;
        this.upload_file_id = '';
        this.company_name = '';
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
        this.template_id = 0;
        this.profession = '';
        this.map_link = '';
        this.add_resource_link = '';
        this.updateData();
      }
    },
    defaulValues: function(val) {
      if (val) {
        console.log(val);
        if (val.upload_file_id && val.upload_file) {
          this.upload_file_url = val.upload_file.upload_file_url;
        }
        this.upload_file_id = val.upload_file_id;
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
        this.template_id = val.template_id;
        this.profession = val.profession;
        this.map_link = val.map_link;
        this.add_resource_link = val.add_resource_link;
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
      this.vAddResourceLink().result === "error" ? errorCount++ : "";
      this.vSurname().result === "error" ? errorCount++ : "";
      this.vName().result === "error" ? errorCount++ : "";
      this.vLastname().result === "error" ? errorCount++ : "";
      this.vProfession().result === "error" ? errorCount++ : "";
      this.vPhoneNumberOne().result === "error" ? errorCount++ : "";
      this.vPhoneNumberTwo().result === "error" ? errorCount++ : "";
      this.vEmail().result === "error" ? errorCount++ : "";
      this.vVkLink().result === "error" ? errorCount++ : "";
      this.vWhatsappLink().result === "error" ? errorCount++ : "";
      this.vTelegramLink().result === "error" ? errorCount++ : "";
      this.vTemplateId().result === "error" ? errorCount++ : "";
      this.vMapLink().result === "error" ? errorCount++ : "";
      return errorCount;
    }
  },
  methods: {
    setPhoneMaskOne(val){
      this.phoneMaskOne = val;
    },
    setPhoneMaskTwo(val){
      this.phoneMaskTwo = val;
    },
    updateFileId(id) {
      this.upload_file_id = id;
      this.updateData();
    },
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
    vAddResourceLink() {
      const v = validator.validate([
        {fieldName: "Доп.ссылка на свой внешний ресурс", value: this.add_resource_link, type: "string", length: 200}
      ]);
      v.result === "error" ? (this.errors.add_resource_link = v.message) : (this.errors.add_resource_link = "");
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
    vProfession() {
      const v = validator.validate([
        {fieldName: "Должность", value: this.profession, type: "string", length: 100}
      ]);
      v.result === "error" ? (this.errors.profession = v.message) : (this.errors.profession = "");
      return v;
    },
    vPhoneNumberOne() {
      if (this.phone_number_one === null) {
        return 'ok';
      }
      let v = validator.validate([
        {fieldName: "Номер телефона 1", value: this.phone_number_one, type: "mask", mask: this.phoneMaskOne}
      ]);
      v.result === "error" ? (this.errors.phone_number_one = v.message) : (this.errors.phone_number_one = "");
      return v;
    },
    vPhoneNumberTwo() {
      // if (this.phone_number_two === null) {
      //   return 'ok';
      // }
      let v = validator.validate([
        {fieldName: "Номер телефона 1", value: this.phone_number_two, type: "mask", mask: this.phoneMaskOne}
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
    vTemplateId() {
      if (+this.template_id === 0) {
        this.errors.template_id = 'Необходимо выбрать шаблон';
        return {result: 'error'};
      }
      this.errors.template_id = '';
      return {result: 'ok'};
    },
    vMapLink() {
      const v = validator.validate([
        {fieldName: "Ссылка на карты", value: this.map_link, type: "string", length: 200}
      ]);
      v.result === "error" ? (this.errors.map_link = v.message) : (this.errors.map_link = "");
      return v;
    },
    updateData() {
      this.$emit('update:data', {
        upload_file_id: this.upload_file_id,
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
        template_id: this.template_id,
        profession: this.profession,
        map_link: this.map_link,
        add_resource_link: this.add_resource_link,
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