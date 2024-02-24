<template>
  <div class="phone-number--container">
    <div class="phone-number--block">
      <div class="input-block country">
        <select v-model="countryCode">
          <option
              v-for="(value, name, index) in maskObject"
              :key="index"
              :value="name"
          >
            +{{name}} {{countryName[name]}}
          </option>
        </select>
      </div>
      <div class="input-block phone">
        <input
            @input="emitInput"
            @focus="numberError = ''"
            @blur="vNumber"
            v-model="inputValue"
            v-mask="mask"
            type="text"
            inputmode="numeric"
        >
<!--        <div class="form-error">{{numberError}}</div>-->
      </div>
      <div class="input-block times">
        <div @click="clearNumber" class="btn btn-sm btn-danger">
          <f-awesome :icon="['fas', 'times']" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Validator from "./libraries/Validator";

const validator = new Validator();

/**
 * Пример использования
 * <phone-number
 *    v-model="formData.number.model" -- модель
 *    :request-validate="requestValidateNumber" -- параметр, который запускает валидацию. делаем +1 при отправке формы
 *    @mask="setPhoneMask" -- обновляет маску ввода
 * ></phone-number>
 *
 * setPhoneMask(val){
 *   this.phoneMask = val;
 * }
 */
export default {
  name: "PhoneNumber",
  emits: ['update:modelValue', 'update:mask', 'update:input'],
  //components: {maska},
  data() {
    return {
      maskObject: {
        7: '(###)###-####',
        48: '###-###-###',
        375: '(##)###-####',
        373: '(##)###-###',
        380: '(##)###-####',
        998: '(##)###-####',
        1: '(###)###-####',
        49: '(###)###-#####',
        33: '(###)###-###',
        995: '(###)###-###',
        371: '##-###-###',
        996: '(###)###-###',
        992: '##-###-####',
        374: '##-###-###',
        44: '##-####-####',
        34: '(###)###-###',
        358: '(###)###-##-##',
        43: '(###)###-####',
        994: '##-###-##-##',
        32: '(###)###-###',
        41: '##-###-####',
        420: '(###)###-###',
        20: '(###)###-####',
        30: '(###)###-####',
        972: '#-###-####',
        9725: '#-###-####',
        39: '(###)####-###',
        351: '##-###-####',
        46: '##-###-####',
        90: '(###)###-####'
      },
      countryName: {
        7: 'Россия/Kazakhstan',
        48: 'Polska',
        375: 'Беларусь',
        373: 'Moldova',
        380: 'Україна',
        998: 'O\'zbekiston',
        1: 'USA/Canada',
        49: 'Deutschland',
        33: 'France',
        995: 'საქართველო (Georgia)',
        371: 'Latvija (latvian)',
        996: 'Кыргызстан',
        992: 'Тоҷикистон (Tajikistan)',
        374: 'Հայաստան (Armenia)',
        44: 'United Kingdom',
        34: 'España',
        358: 'Suomi (Finland)',
        43: 'Österreich (Austria)',
        994: 'Azərbaycan (Azerbaijan)',
        32: 'Belgium',
        41: 'Switzerland',
        420: 'Česko (Czech)',
        20: 'Egypt',
        30: 'Ελλάδα (Greece)',
        972: 'Israel',
        9725: 'Israel',
        39: 'Italia (Italy)',
        351: 'Portugal',
        46: 'Sverige (Sweden)',
        90: 'Türkiye (Turkey)'
      },
      countryCode: 7,
      numberError: '',
      mask: '',
      inputValue: ''
    };
  },
  props: {
    modelValue: Number|String,
    requestValidate: Number, // Запускает валидацию
    defaultCountryCode: Number, // код страны по умолчанию
  },
  watch: {
    defaultCountryCode: function(val){
      this.countryCode = val;
      this.vNumber();
    },
    requestValidate: function(){
      this.vNumber();
      this.emitMask();
    },
    countryCode: function(val){
      this.emitMask(val);
      this.vNumber();
    },
    modelValue: {
      immediate: true,
      handler(newValue) {
        //if (!newValue) return;
        // Здесь вы можете установить значение по умолчанию или обработать новое значение
        let newNewValue = '' +newValue +'';
        let phone = newNewValue.replace(/^\+/, '');
        let mask = '';
        let phoneResult = '';
        let countryCode = 0;

        let symbolsInMask = 0;
        let symbolsInNumber = 0;

        for(let key in this.maskObject){
          let regexp = new RegExp(`^${key}`);
          if(phone.match(regexp)){
            phoneResult = phone.replace(regexp, '');
            mask = this.maskObject[key];
            countryCode = key;

            symbolsInMask = this.maskObject[key].match(/[#]/g).length;
            if(phoneResult.match(/[0-9]/g)){
              symbolsInNumber = phoneResult.match(/[0-9]/g).length;
            }else{
              symbolsInNumber =0;
            }

            if(symbolsInMask === symbolsInNumber){
              break;
            }else{
              continue;
            }
          }
        }

        this.setCountryCode(countryCode);
        this.mask = mask;
        this.inputValue = phoneResult;
        this.vNumber();
      }
    }
  },
  computed: {
    computedMask(){
      let mask = '';
      for(let key in this.maskObject){
        if(this.countryCode == key){
          mask = this.maskObject[key];
        }
      }
      return mask;
    }
  },
  methods: {
    clearNumber() {
      this.inputValue = null;
      this.$emit('update:modelValue', null);
      this.$emit('update:input', null);
    },
    setCountryCode(val){
      this.countryCode = val;
      localStorage.setItem("countryCode", val);
    },
    emitInput(e){
      this.$emit('update:modelValue', '+' +this.countryCode + '' +e.target.value);
      this.emitMask();
    },
    emitMask(value){
      let countryCode = value?value:this.countryCode;
      let result = '+' +countryCode;
      for(let key in this.maskObject){
        if(countryCode == key){
          result += this.maskObject[key];
          this.mask = this.maskObject[key];
        }
      }
      this.$emit('update:mask', result);
    },
    vNumber(){
      let validate = validator.validate([
        {
          fieldName: "Номер",
          value: this.inputValue,
          type: "required",
          length: 20
        },
        {
          fieldName: "Номер",
          value: this.inputValue,
          type: "mask",
          mask: this.computedMask
        }
      ]);
      validate.result == "error"
          ? (this.numberError = validate.message)
          : (this.numberError = "");
      return validate;
    },
  },
  created() {
    let countryCode = localStorage.getItem("countryCode");
    if (countryCode) {
      this.setCountryCode(countryCode);
    }
    this.emitMask();
  },
};
</script>

<style scoped lang="less">
.phone-number--block{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  flex-direction: row;

  .country{
    width: 110px;
  }
  .phone{
    width: 100%;
  }
}
</style>
