<template>
  <div v-if="value" class="contact-info--container">
    <div class="photo text-center">
      <div v-if="value.upload_file_id">
        <img :src="value.upload_file.upload_file_url" alt="">
      </div>
      <div v-if="!value.upload_file_id">
        <div class="without-photo">Без фото</div>
      </div>
    </div>

    <div class="mrg-t-10">
      Название компании:
      <span class="text-bold" v-if="value.company_name">{{value.company_name}}</span>
      <span class="text-bold" v-if="!value.company_name">-</span>
    </div>
    <div class="mrg-t-10">
      Адрес компании:
      <span class="text-bold" v-if="value.company_address">{{value.company_address}}</span>
      <span class="text-bold" v-if="!value.company_address">-</span>
    </div>
    <div class="mrg-t-10">
      Ссылка на сайт:
      <span class="text-bold" v-if="value.site_link">{{value.site_link}}</span>
      <span class="text-bold" v-if="!value.site_link">-</span>
    </div>
    <div class="mrg-t-10">
      Фамилия:
      <span class="text-bold" v-if="value.surname">{{value.surname}}</span>
      <span class="text-bold" v-if="!value.surname">-</span>
    </div>
    <div class="mrg-t-10">
      Имя:
      <span class="text-bold" v-if="value.name">{{value.name}}</span>
      <span class="text-bold" v-if="!value.name">-</span>
    </div>
    <div class="mrg-t-10">
      Отчество:
      <span class="text-bold" v-if="value.lastname">{{value.lastname}}</span>
      <span class="text-bold" v-if="!value.lastname">-</span>
    </div>
    <div class="mrg-t-10">
      Номер телефона 1:
      <span class="text-bold" v-if="value.phone_number_one">{{numberToMask(value.phone_number_one)}}</span>
      <span class="text-bold" v-if="!value.phone_number_one">-</span>
    </div>
    <div class="mrg-t-10">
      Номер телефона 2:
      <span class="text-bold" v-if="value.phone_number_two">{{numberToMask(value.phone_number_two)}}</span>
      <span class="text-bold" v-if="!value.phone_number_two">-</span>
    </div>
    <div class="mrg-t-10">
      E-mail:
      <span class="text-bold" v-if="value.email">{{value.email}}</span>
      <span class="text-bold" v-if="!value.email">-</span>
    </div>
    <div class="mrg-t-10">
      Ссылка ВК:
      <span class="text-bold" v-if="value.vk_link">{{value.vk_link}}</span>
      <span class="text-bold" v-if="!value.vk_link">-</span>
    </div>
    <div class="mrg-t-10">
      Ссылка WhatsApp:
      <span class="text-bold" v-if="value.whatsapp_link">{{value.whatsapp_link}}</span>
      <span class="text-bold" v-if="!value.whatsapp_link">-</span>
    </div>
    <div class="mrg-t-10">
      Ссылка Telegram:
      <span class="text-bold" v-if="value.telegram_link">{{value.telegram_link}}</span>
      <span class="text-bold" v-if="!value.telegram_link">-</span>
    </div>
    <div class="mrg-t-10">
      Контакт создан:
      <span class="text-bold">{{dateTimeToRus(value.created_at)}}</span>
    </div>

    <div class="link text-center mrg-t-25">
      <div>Ссылка на страницу контакта:</div>
      <div class="text-bold mrg-t-5">
        <a :href="value.contact_url" class="text-underline" target="_blank">{{value.contact_url}}</a>
      </div>
      <div class="mrg-t-5">
        <div @click="copyText(value.contact_url)" class="btn btn-sm btn-info">Скопировать ссылку</div>
      </div>
    </div>

    <div class="mrg-t-25 text-center">
      <div>
        <qrcode-vue
            :value="value.contact_url"
            :size="150"
            level="Q"
            render-as="svg"
            ref="qrCodeUrl"
        ></qrcode-vue>
      </div>
      <div class="text-hint">QR-код со ссылкой на страницу контакта</div>
      <div class="mrg-t-5">
        <div
            @click="downloadQRCode('qrCodeUrl', 'QRCode-URL-'+value.surname+'.svg')"
            class="btn btn-sm btn-info"
        >
          <f-awesome :icon="['fas', 'download']" />
          .svg
        </div>
        <div @click="downloadQrLinkPng" class="btn btn-sm btn-info">
          <f-awesome :icon="['fas', 'download']" />
          .png
        </div>
      </div>
    </div>

    <div class="mrg-t-25 text-center">
      <div>
        <qrcode-vue
            :value="vCardText"
            :size="150"
            level="Q"
            render-as="svg"
            ref="qrCodeVCard"
        ></qrcode-vue>
      </div>
      <div class="text-hint">QR-код добавления контакта (VCard)</div>
      <div class="mrg-t-5">
        <div
            @click="downloadQRCode('qrCodeVCard', 'QRCode-VCard-'+value.surname+'.svg')"
            class="btn btn-sm btn-info"
        >
          <f-awesome :icon="['fas', 'download']" />
          .svg
        </div>
        <div @click="downloadQrVCardPng" class="btn btn-sm btn-info">
          <f-awesome :icon="['fas', 'download']" />
          .png
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import contactRepository from "@/repositories/contact/index.js";
import Formatter from "@/components/libraries/Formatter.js";
import QrcodeVue from "qrcode.vue";

const formatter = new Formatter();

export default {
  name: "ContactInfo",
  components: {QrcodeVue},
  data() {
    return {
      vCardText: '',
    }
  },
  props: {
    value: Object,
  },
  watch: {
    value: function(val) {
      this.vCardText = this.generateVCard(val);
    },
  },
  computed: {

  },
  methods: {
    dateTimeToRus(dt) {
      return formatter.phpDateTimeToShortString(dt);
    },
    numberToMask(number) {
      return formatter.phoneNumberToMask(number);
    },
    copyText(text){
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$store.dispatch("addNotification", {
            text: 'Ссылка скопирована в буфер обмена',
            time: 3,
            color: "success"
          });
        })
        .catch(() => {
          this.$store.dispatch("addNotification", {
            text: 'Ваш браузер не поддерживает копирование',
            time: 3,
            color: "danger"
          });
        });
    },
    generateVCard(val) {
      let vCardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
      ];

      let n = [];
      if (val.surname) {
        n[n.length] = val.surname;
      }
      if (val.name) {
        n[n.length] = val.name;
      }
      if (val.lastname) {
        n[n.length] = val.lastname;
      }

      if (n.length > 0) {
        vCardData[vCardData.length] = 'N:' +n.join(';');
        vCardData[vCardData.length] = 'FN:' +n.join(' ');
      }

      if (val.company_name) {
        vCardData[vCardData.length] = 'ORG:' +val.company_name;
      }

      if (val.phone_number_one) {
        vCardData[vCardData.length] = 'TEL;TYPE=WORK,VOICE:+' +val.phone_number_one;
      }

      if (val.phone_number_two) {
        vCardData[vCardData.length] = 'TEL;TYPE=MOBILE,VOICE:+' +val.phone_number_two;
      }

      if (val.email) {
        vCardData[vCardData.length] = 'EMAIL:' +val.email;
      }
      vCardData[vCardData.length] = 'END:VCARD';
      return vCardData.join('\n');
    },
    downloadQRCode(ref, fileName) {
     this.$nextTick(() => { // Убедимся, что DOM обновлен
        const qrElement = this.$refs[ref].$el;
        if (qrElement) { // Проверяем, действительно ли элемент существует
          const serializer = new XMLSerializer();
          const source = serializer.serializeToString(qrElement);
          const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          // Создаем временную ссылку для скачивания
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName; // Название файла
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          this.$store.dispatch("addNotification", {
            text: 'QR-код для скачивания не найден. Обратитесь в поддержку',
            time: 3,
            color: "danger"
          });
        }
      });
    },
    downloadQrLinkPng() {
      this.$store.dispatch("startPreloader");
      contactRepository.qrLinkPngRequest({contact_id: this.value.id}).then(resp => {
        const url = window.URL.createObjectURL(new Blob([resp.data], { type: 'image/png' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'QRCode-URL-'+this.value.surname+'.png'); // Назначаем имя файла
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.$store.dispatch("stopPreloader");
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.$store.dispatch("stopPreloader");
      });
    },
    downloadQrVCardPng() {
      this.$store.dispatch("startPreloader");
      contactRepository.qrVCardPngRequest({contact_id: this.value.id}).then(resp => {
        const url = window.URL.createObjectURL(new Blob([resp.data], { type: 'image/png' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'QRCode-VCard-'+this.value.surname+'.png'); // Назначаем имя файла
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.$store.dispatch("stopPreloader");
      }).catch(err => {
        this.$store.dispatch("addNotification", {
          text: err.response.data.message,
          time: 5,
          color: "danger"
        });
        this.$store.dispatch("stopPreloader");
      });
    }
  },
  created() {

  }
}
</script>

<style scoped lang="less">
.contact-info--container{
  .photo{
    img {
      width: 130px;
      border-radius: 8px;
    }
    .without-photo{
      width: 130px;
      height: 130px;
      border-radius: 8px;
      background-color: #edf4f9;
      line-height: 130px;
      margin: 0 auto;
    }
  }
}
</style>