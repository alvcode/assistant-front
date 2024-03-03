<template>
  <panel-main-template>
    <template v-slot:page-title>Мои контакты</template>
    <template v-slot:page-content>
      <div class="contacts--container">
        <div class="contacts--actions">
          <div @click="showNewCompanyPopup" class="btn btn-sm btn-success">Добавить компанию</div>
        </div>
        <div class="contacts--companies-container">
          <div
              class="contacts--company-item shadow-card"
              v-for="item in companiesComputed"
              :key="item.id"
          >
            <div class="contacts-company-item-company">
              <div class="left">
                <div>Компания: <span class="text-bold">{{item.name}}</span></div>
                <div v-show="item.address">Адрес: <span class="text-bold">{{item.address}}</span></div>
                <div v-show="item.site_link">Сайт: <span class="text-bold">{{item.site_link}}</span></div>
              </div>
              <div class="right">
                <div @click="showNewContactPopup(item.id)" class="btn btn-sm btn-success mrg-t-5">
                  <f-awesome :icon="['fas', 'plus']" /> Контакт
                </div>
                <div @click="showEditCompanyPopup(item.id)" class="btn btn-sm btn-info mrg-t-5">Изменить</div>
                <div @click="deleteCompany(item.id)" class="btn btn-sm btn-danger mrg-t-5">Удалить</div>
                <div @click="expandCompanyToggle(item.id)" class="btn-sm-circle btn-outline-info mrg-l-15 mrg-t-5">
                  <span v-if="!item.isShowList"><f-awesome :icon="['fas', 'caret-up']" /></span>
                  <span v-if="item.isShowList"><f-awesome :icon="['fas', 'caret-down']" /></span>
                </div>
              </div>
            </div>

            <div v-show="item.isShowList" class="contacts-company-item-contacts">
              <div class="contacts-company-item-contacts-item shadow-card">
                <div class="contacts--item-table">
                  <div class="table--container text-center">
                    <div class="table--header">
                      <div>Фото</div>
                      <div>ФИО</div>
                      <div>Номер 1</div>
                      <div>Номер 2</div>
                      <div>E-mail</div>
                      <div>Создано</div>
                      <div>Действия</div>
                    </div>
                    <div class="table--rows">
                      <div
                          class="table--row"
                          v-for="contact in item.contacts"
                          :key="contact.id"
                      >
                        <div class="image">
                          <span v-if="contact.upload_file_id">
                            <img width="50" :src="contact.upload_file.upload_file_url" alt="">
                          </span>
                        </div>
                        <div>{{contact.surname}} {{contact.name}} {{contact.lastname}}</div>
                        <div>
                          <span v-show="contact.phone_number_one">
                            {{phoneNumberToMask(contact.phone_number_one)}}
                          </span>
                        </div>
                        <div>
                          <span v-show="contact.phone_number_two">
                            {{phoneNumberToMask(contact.phone_number_two)}}
                          </span>
                        </div>
                        <div>
                          <span v-show="contact.email">{{contact.email}}</span>
                        </div>
                        <div>{{contact.created_at}}</div>
                        <div>
                          <div
                              @click="showEditContactPopup(contact.id)"
                              class="btn btn-sm btn-info"
                          >
                            <f-awesome :icon="['fas', 'edit']" />
                          </div>
                          <div
                              @click="showContactInfoPopup(contact.id)"
                              class="btn btn-sm btn-info"
                          >
                            <f-awesome :icon="['fas', 'circle-info']" />
                          </div>
                          <div
                              @click="showDeleteContactPopup(contact.id)"
                              class="btn btn-sm btn-danger"
                          >
                            <f-awesome :icon="['fas', 'times']" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="contacts--item-more">

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <popup
          :closeButton="deleteCompanyPopup.closeButton"
          :actionButton="deleteCompanyPopup.actionButton"
          :action-class="deleteCompanyPopup.actionClass"
          :show="deleteCompanyPopup.show"
          @closePopup="closeDeleteCompanyPopup"
          @actionPopup="submitDeleteCompanyPopup"
      >
        <template v-slot:header>Удалить компанию?</template>
        <template v-slot:body>
          Внимание! Все данные компании, в т.ч контакты будут удалены без возможности восстановления.
          Продолжить?
        </template>
      </popup>

      <popup
          :closeButton="newCompanyPopup.closeButton"
          :actionButton="newCompanyPopup.actionButton"
          :action-class="newCompanyPopup.actionClass"
          :show="newCompanyPopup.show"
          @closePopup="closeNewCompanyPopup"
          @actionPopup="submitNewCompanyPopup"
      >
        <template v-slot:header>Добавление компании</template>
        <template v-slot:body>
          <company-fields
              :show="newCompanyPopup.show"
              @update:data="handleUpdateNewCompanyData"
              @update:validate="handleUpdateNewCompanyValidate"
          ></company-fields>
        </template>
      </popup>

      <popup
          :closeButton="editCompanyPopup.closeButton"
          :actionButton="editCompanyPopup.actionButton"
          :action-class="editCompanyPopup.actionClass"
          :show="editCompanyPopup.show"
          @closePopup="closeEditCompanyPopup"
          @actionPopup="submitEditCompanyPopup"
      >
        <template v-slot:header>Изменение компании</template>
        <template v-slot:body>
          <company-fields
              :show="editCompanyPopup.show"
              :defaul-values="editCompanyDataProps"
              @update:data="handleUpdateEditCompanyData"
              @update:validate="handleUpdateEditCompanyValidate"
          ></company-fields>
        </template>
      </popup>

      <popup
          :closeButton="newContactPopup.closeButton"
          :actionButton="newContactPopup.actionButton"
          :action-class="newContactPopup.actionClass"
          :show="newContactPopup.show"
          @closePopup="closeNewContactPopup"
          @actionPopup="submitNewContactPopup"
      >
        <template v-slot:header>Добавление контакта</template>
        <template v-slot:body>
          <contact-fields
              :show="newContactPopup.show"
              @update:data="handleUpdateNewContactData"
              @update:validate="handleUpdateNewContactValidate"
          ></contact-fields>
        </template>
      </popup>

      <popup
          :closeButton="editContactPopup.closeButton"
          :actionButton="editContactPopup.actionButton"
          :action-class="editContactPopup.actionClass"
          :show="editContactPopup.show"
          @closePopup="closeEditContactPopup"
          @actionPopup="submitEditContactPopup"
      >
        <template v-slot:header>Изменение контакта</template>
        <template v-slot:body>
          <contact-fields
              :show="editContactPopup.show"
              :defaul-values="editContactDataProps"
              @update:data="handleUpdateEditContactData"
              @update:validate="handleUpdateEditContactValidate"
          ></contact-fields>
        </template>
      </popup>

      <popup
          :closeButton="deleteContactPopup.closeButton"
          :actionButton="deleteContactPopup.actionButton"
          :action-class="deleteContactPopup.actionClass"
          :show="deleteContactPopup.show"
          @closePopup="closeDeleteContactPopup"
          @actionPopup="submitDeleteContactPopup"
      >
        <template v-slot:header>Удалить контакт?</template>
        <template v-slot:body>
          Внимание! Контакт будет удален без возможности восстановления. Продолжить?
        </template>
      </popup>

      <popup
          :closeButton="contactInfoPopup.closeButton"
          :show="contactInfoPopup.show"
          @closePopup="closeContactInfoPopup"
      >
        <template v-slot:header>Подробные сведения о контакте</template>
        <template v-slot:body>
          <contact-info :value="contactDataInfo"></contact-info>
        </template>
      </popup>



    </template>
  </panel-main-template>
</template>

<script>
// @ is an alias to /src

import PanelMainTemplate from "@/components/MainTemplate.vue";
import companyRepository from "@/repositories/company/index.js";
import contactRepository from "@/repositories/contact/index.js";
import Popup from "@/components/Popup.vue";
import CompanyFields from "@/components/Companies/CompanyFields.vue";
import Formatter from "@/components/libraries/Formatter.js";
import ContactFields from "@/components/Contacts/ContactFields.vue";
import ContactInfo from "@/components/Contacts/ContactInfo.vue";

const formatter = new Formatter();


export default {
  name: "Contacts",
  components: {
    ContactInfo,
    ContactFields,
    CompanyFields,
    Popup,
    PanelMainTemplate
  },
  data() {
    return {
      expandedCompaniesIds: [],
      expandedContactsIds: [],
      loadContactsByCompanyIds: [],
      companies: [],
      contacts: [],

      deletedCompanyId: 0,
      deleteCompanyPopup: {
        show: false,
        closeButton: 'Отмена',
        actionButton: 'Продолжить',
        actionClass: 'btn-success',
      },

      newCompanyData: {name: '', address: '', site_link: ''},
      newCompanyValidate: false,
      newCompanyPopup: {
        show: false,
        closeButton: 'Отмена',
        actionButton: 'Добавить',
        actionClass: 'btn-success',
      },

      editCompanyData: {name: '', address: '', site_link: ''},
      editCompanyDataProps: {name: '', address: '', site_link: ''},
      editCompanyValidate: false,
      editCompanyId: 0,
      editCompanyPopup: {
        show: false,
        closeButton: 'Отмена',
        actionButton: 'Сохранить',
        actionClass: 'btn-success',
      },

      newContactData: {
        company_id: 0, upload_file_id: null, company_name: '', company_address: '', site_link: '',
        surname: '', name: '', lastname: '', phone_number_one: '', phone_number_two: '',
        email: '', vk_link: '', whatsapp_link: '', telegram_link: '',
      },
      newContactValidate: false,
      newContactCompanyId: 0,
      newContactPopup: {
        show: false,
        closeButton: 'Отмена',
        actionButton: 'Добавить',
        actionClass: 'btn-success',
      },

      deletedContactId: 0,
      deleteContactPopup: {
        show: false,
        closeButton: 'Отмена',
        actionButton: 'Продолжить',
        actionClass: 'btn-success',
      },

      editContactData: {
        company_id: 0, upload_file_id: null, company_name: '', company_address: '', site_link: '',
        surname: '', name: '', lastname: '', phone_number_one: '', phone_number_two: '',
        email: '', vk_link: '', whatsapp_link: '', telegram_link: '',
      },
      editContactDataProps: {
        company_id: 0, upload_file_id: null, company_name: '', company_address: '', site_link: '',
        surname: '', name: '', lastname: '', phone_number_one: '', phone_number_two: '',
        email: '', vk_link: '', whatsapp_link: '', telegram_link: '',
      },
      editContactValidate: false,
      editContactCompanyId: 0,
      editContactId: 0,
      editContactPopup: {
        show: false,
        closeButton: 'Отмена',
        actionButton: 'Сохранить',
        actionClass: 'btn-success',
      },

      contactDataInfo: null, // используется для вывода подробной информации о контакте
      contactInfoPopup: {
        show: false,
        closeButton: 'Закрыть',
      },
    };
  },
  watch: {

  },
  computed: {
    companiesComputed() {
      const result = [];
      for (let key in this.companies) {
        const item = this.companies[key];

        item.isShowList = this.expandedCompaniesIds.includes(this.companies[key].id);

        const contacts = [];
        for (let keyContact in this.contacts) {
          if (this.contacts[keyContact].company_id === item.id) {
            const contact = this.contacts[keyContact];
            contact.isShowList = this.expandedContactsIds.includes(this.contacts[keyContact].id);
            contacts.push(contact);
          }
        }
        item.contacts = contacts;

        result.push(item);
      }
      return result;
    }
  },
  methods: {
    addContactIfNotExists(contact) {
      let exists = false;
      for (let key in this.contacts) {
        if (this.contacts[key].id === contact.id) {
          exists = true;
        }
      }
      if (!exists) {
        this.contacts = this.contacts.concat(contact);
      }
    },
    phoneNumberToMask(number) {
      return formatter.phoneNumberToMask(number);
    },
    async expandCompanyToggle(companyId) {
      for (let key in this.companies) {
        if (this.companies[key].id === companyId) {
          if (
              !this.companies[key].isShowList &&
              !this.loadContactsByCompanyIds.includes(this.companies[key].id)
          ) {
            await this.loadContacts(companyId);
          }
          if (this.companies[key].isShowList) {
            let index = this.expandedCompaniesIds.indexOf(this.companies[key].id);
            if (index !== -1) {
              this.expandedCompaniesIds.splice(index, 1);
            }
          } else {
            this.expandedCompaniesIds[this.expandedCompaniesIds.length] = this.companies[key].id;
          }
        }
      }
    },
    async loadContacts(companyId) {
      this.$store.dispatch("startPreloader");
      await contactRepository.index(companyId).then(resp => {
        for (let key in resp.data) {
          this.addContactIfNotExists(resp.data[key]);
        }
        this.loadContactsByCompanyIds[this.loadContactsByCompanyIds.length] = companyId;
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

    deleteCompany(companyId) {
      this.deletedCompanyId = companyId;
      this.deleteCompanyPopup.show = true;
    },
    closeDeleteCompanyPopup() {
      this.deleteCompanyPopup.show = false;
    },
    submitDeleteCompanyPopup() {
      this.$store.dispatch("startPreloader");
      companyRepository.delete(this.deletedCompanyId).then(() => {
        for (let key in this.companies) {
          if (this.companies[key].id === this.deletedCompanyId) {
            this.companies.splice(key, 1);
          }
        }
        for (let key in this.contacts) {
          if (this.contacts[key].company_id === this.deletedCompanyId) {
            this.contacts.splice(key, 1);
          }
        }

        this.closeDeleteCompanyPopup();

        this.$store.dispatch("addNotification", {
          text: 'Успешно',
          time: 3,
          color: "success"
        });
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

    handleUpdateNewCompanyData(data) {
      this.newCompanyData = data;
    },
    handleUpdateNewCompanyValidate(val) {
      this.newCompanyValidate = val;
    },
    closeNewCompanyPopup() {
      this.newCompanyPopup.show = false;
    },
    showNewCompanyPopup() {
      this.newCompanyPopup.show = true;
    },
    submitNewCompanyPopup() {
      if (!this.newCompanyValidate) {
        return false;
      }
      this.$store.dispatch("startPreloader");
      companyRepository.create(this.newCompanyData).then(resp => {
        this.companies.push(resp.data);
        this.closeNewCompanyPopup();
        this.$store.dispatch("addNotification", {
          text: 'Успешно',
          time: 3,
          color: "success"
        });
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

    closeEditCompanyPopup() {
      this.editCompanyPopup.show = false;
    },
    showEditCompanyPopup(companyId) {
      this.editCompanyPopup.show = true;
      for (let key in this.companies) {
        if (this.companies[key].id === companyId) {
          this.editCompanyDataProps = {
            name: this.companies[key].name,
            address: this.companies[key].address,
            site_link: this.companies[key].site_link,
          };
          this.editCompanyId = companyId;
        }
      }
    },
    submitEditCompanyPopup() {
      if (!this.editCompanyValidate) {
        return false;
      }
      this.$store.dispatch("startPreloader");
      companyRepository.update(this.editCompanyData, this.editCompanyId).then(resp => {
        for (let key in this.companies) {
          if (this.companies[key].id === resp.data.id) {
            this.companies[key] = resp.data;
          }
        }
        this.closeEditCompanyPopup();
        this.$store.dispatch("addNotification", {
          text: 'Успешно',
          time: 3,
          color: "success"
        });
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
    handleUpdateEditCompanyValidate(val) {
      this.editCompanyValidate = val;
    },
    handleUpdateEditCompanyData(data) {
      this.editCompanyData = data;
    },

    showNewContactPopup(companyId) {
      this.newContactPopup.show = true;
      this.newContactCompanyId = companyId;
    },
    closeNewContactPopup() {
      this.newContactPopup.show = false;
    },
    handleUpdateNewContactValidate(val) {
      this.newContactValidate = val;
    },
    handleUpdateNewContactData(data) {
      this.newContactData = data;
    },
    submitNewContactPopup() {
      if (!this.newContactValidate) {
        return false;
      }
      this.newContactData.company_id = this.newContactCompanyId;

      this.$store.dispatch("startPreloader");
      contactRepository.create(this.newContactData).then(resp => {
        this.addContactIfNotExists(resp.data);
        this.closeNewContactPopup();
        this.$store.dispatch("addNotification", {
          text: 'Успешно',
          time: 3,
          color: "success"
        });
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

    submitDeleteContactPopup() {
      this.$store.dispatch("startPreloader");
      contactRepository.delete(this.deletedContactId).then(() => {
        for (let key in this.contacts) {
          if (this.contacts[key].id === this.deletedContactId) {
            this.contacts.splice(key, 1);
          }
        }
        this.$store.dispatch("addNotification", {
          text: 'Успешно',
          time: 3,
          color: "success"
        });
        this.closeDeleteContactPopup();
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
    closeDeleteContactPopup() {
      this.deleteContactPopup.show = false;
    },
    showDeleteContactPopup(contactId) {
      this.deletedContactId = contactId;
      this.deleteContactPopup.show = true;
    },

    handleUpdateEditContactValidate(val) {
      this.editContactValidate = val;
    },
    handleUpdateEditContactData(data) {
      this.editContactData = data;
    },
    submitEditContactPopup() {
      if (!this.editContactValidate) {
        return false;
      }
      this.editContactData.company_id = this.editContactCompanyId;

      this.$store.dispatch("startPreloader");
      contactRepository.update(this.editContactData, this.editContactId).then(resp => {
        for (let key in this.contacts) {
          if (this.contacts[key].id === this.editContactId) {
            this.contacts[key] = resp.data;
          }
        }
        this.closeEditContactPopup();
        this.$store.dispatch("addNotification", {
          text: 'Успешно',
          time: 3,
          color: "success"
        });
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
    closeEditContactPopup() {
      this.editContactPopup.show = false;
    },
    showEditContactPopup(contactId) {
      this.editContactPopup.show = true;
      for (let key in this.contacts) {
        if (this.contacts[key].id === contactId) {
          this.editContactId = this.contacts[key].id;
          this.editContactCompanyId = this.contacts[key].company_id;
          this.editContactDataProps = { ...this.contacts[key] };
        }
      }
    },

    closeContactInfoPopup() {
      this.contactInfoPopup.show = false;
      // this.contactDataInfo
    },
    showContactInfoPopup(contactId) {
      for (let key in this.contacts) {
        if (this.contacts[key].id === contactId) {
          this.contactDataInfo = this.contacts[key];
        }
      }
      this.contactInfoPopup.show = true;
    },
  },
  created() {
    this.$store.dispatch("startPreloader");
    companyRepository.index().then(resp => {
      this.companies = resp.data;
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
};
</script>

<style scoped lang="less">
.contacts--company-item{
  margin-top: 25px;

  .contacts-company-item-company{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;

    &>.left{
      width: 50%;
    }
    &>.right{
      text-align: right;
      width: 50%;
    }
  }

  .contacts-company-item-contacts{
    margin-top: 25px;
  }

}
.contacts--item-table{
  .image{
    img{
      border-radius: 8px;
    }
  }
}
</style>
