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
                <div>Компания: <span class="text-bold">{{item.name}} {{item.id}}</span></div>
                <div v-show="item.address">Адрес: <span class="text-bold">{{item.address}}</span></div>
                <div v-show="item.site_link">Сайт: <span class="text-bold">{{item.site_link}}</span></div>
              </div>
              <div class="right">
                <div class="btn btn-sm btn-info">Изменить</div>
                <div @click="deleteCompany(item.id)" class="btn btn-sm btn-danger">Удалить</div>
                <div @click="expandCompanyToggle(item.id)" class="btn-sm-circle btn-outline-info mrg-l-15">
                  <span v-if="!item.isShowList"><f-awesome :icon="['fas', 'caret-up']" /></span>
                  <span v-if="item.isShowList"><f-awesome :icon="['fas', 'caret-down']" /></span>
                </div>
              </div>
            </div>

            <div v-show="item.isShowList" class="contacts-company-item-contacts">
              <div
                  class="contacts-company-item-contacts-item shadow-card"
              >
                {{item.contacts}}
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


export default {
  name: "Contacts",
  components: {
    CompanyFields,
    Popup,
    PanelMainTemplate
  },
  data() {
    return {
      expandedCompaniesIds: [],
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
            contacts.push(this.contacts[keyContact]);
          }
        }
        item.contacts = contacts;

        result.push(item);
      }
      return result;
    }
  },
  methods: {
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
        this.contacts = this.contacts.concat(resp.data);
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

    .left{
      width: 50%;
    }
    .right{
      text-align: right;
      width: 50%;
    }
  }

  .contacts-company-item-contacts{
    margin-top: 25px;
  }

}
</style>
