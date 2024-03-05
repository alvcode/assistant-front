class Formatter {

  /**
   * Проверяет, находится ли дата в диапазоне дат
   * @param dateFrom
   * @param dateTo
   * @param currentDate
   * @returns {boolean}
   */
  isDateInRange(dateFrom, dateTo, currentDate) {
    dateFrom = new Date(dateFrom);
    dateTo = new Date(dateTo);
    currentDate = new Date(currentDate);

    return dateFrom <= currentDate && currentDate <= dateTo;
  }

  /**
   * Возвращает date object
   * @param day
   * @param month - в формате js (0 - январь, 1 - февраль)
   * @param year
   * @returns {Date}
   */
  paramsDateToJSObject(day, month, year) {
    return new Date(year, month, day);
  }

  datetimeToRus(datetime){
    let datetimeSplit = datetime.split(' ');
    let dateRus = this.phpDateToRus(datetimeSplit[0]);
    let time = datetimeSplit[1];
    return dateRus +' ' +time;
  }


  /**
   * Переводит объект JS в формат PHP
   * @param obj
   * @returns {string}
   */
  jsObjectToPhp(obj) {
    return this.paramsDateToPhpFormat(
      obj.getDate(),
      obj.getMonth(),
      obj.getFullYear()
    );
  }

  /**
   * Переводит дату из YYYY-MM-DD в объект JS.
   * Почему такой способ? Потому что new Date('yyyy-dd-mm') вхерачивает часовой пояс
   * @param date
   * @returns {Date}
   */
  phpDateToJSObject(date) {
    let newDate = new Date(date);
    return this.paramsDateToJSObject(
      newDate.getUTCDate(),
      newDate.getUTCMonth(),
      newDate.getUTCFullYear()
    );
  }

  /**
   * Форматирует параметры даты в строку php
   * @param day
   * @param month - в формате js (0 - январь, 1 - февраль)
   * @param year
   * @returns {string}
   */
  paramsDateToPhpFormat(day, month, year) {
    let getObj = this.paramsDateToJSObject(day, month, year);
    return this.dateToPhpFormat(getObj);
  }

  /**
   * Форматирует дату из объекта js в строку php
   * @param date object dateObj
   * @returns {string} 'YYYY-MM-DD'
   */
  dateToPhpFormat(dateObj) {
    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();
    return (
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (day < 10 ? "0" + day : day)
    );
  }

  /**
   * Форматирует дату вида '2020-01-01' в '01 января 2020'
   * @param string date - YYYY-MM-DD
   * @returns {string} '01 января 2020'
   */
  phpDateToString(date) {
    let month = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря"
    ];
    let dateObj = new Date(date);
    let day =
      dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
    return day + " " + month[dateObj.getMonth()] + " " + dateObj.getFullYear();
  }

  getMonthNameByJsObj(dateObj){
    let month = [
      "январь",
      "февраль",
      "март",
      "апрель",
      "май",
      "июнь",
      "июль",
      "август",
      "сентябрь",
      "октябрь",
      "ноябрь",
      "декабрь"
    ];
    return month[dateObj.getMonth()];
  }

  /**
   * Форматирует дату вида '2020-01-01' в '01 янв 2020'
   * @param string date - YYYY-MM-DD
   * @returns {string} '01 янв 2020'
   */
   phpDateToShortString(date) {
    if(date == '') return '';
    let month = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сент", "окт", "ноя", "дек"];
    let dateObj = new Date(date);
    let day =
      dateObj.getUTCDate() < 10 ? "0" + dateObj.getUTCDate() : dateObj.getUTCDate();
    return day + " " + month[dateObj.getUTCMonth()] + " " + dateObj.getUTCFullYear();
  }

  /**
   * Форматирует датувремя вида '2020-01-01 00:00:00' в '01 янв 2020 - 00:00'
   * @returns {string} '01 янв 2020'
   * @param date
   */
  phpDateTimeToShortString(date) {
    if(date === '') return '';
    let month = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сент", "окт", "ноя", "дек"];
    let dateObj = new Date(date);
    let day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
    let hours = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
    let minutes = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
    let dateText = day + " " + month[dateObj.getMonth()] + " " + dateObj.getFullYear();
    return dateText +' - ' + hours +':' +minutes;
  }

  getMonthNameShort(monthIdx){
    let month = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сент", "окт", "ноя", "дек"];
    return month[monthIdx];
  }

  /**
   * Форматирует дату из формата dd.mm.yyyy в объект Date JS
   * @param string date - dd.mm.yyyy
   * @returns {Date}
   */
  rusDateToJSObject(date) {
    let dateSplit = date.split(".");
    return this.paramsDateToJSObject(
      +dateSplit[0],
      +dateSplit[1] - 1,
      +dateSplit[2]
    );
  }

  /**
   * Переводит параметры даты в формат dd.mm.yyyy
   * @param day
   * @param month
   * @param year
   * @returns {string}
   */
  dateParamsToRus(day, month, year) {
    let resDay = +day < 10 ? "0" + day : day;
    let resMonth = +month < 10 ? "0" + month : month;
    let resYear = year;
    return resDay + "." + resMonth + "." + resYear;
  }

  /**
   * Переводит дату из формата YYYY-MM-DD в dd.mm.yyyy
   * @param date
   * @returns {string}
   */
  phpDateToRus(date) {
    if(date == '') return '';
    let dateParams = this.phpDateToJSObject(date);
    return this.dateParamsToRus(
      dateParams.getDate(),
      dateParams.getMonth() + 1,
      dateParams.getFullYear()
    );
  }

  /**
   * Переводит минуты в часы
   * @param integer minute
   * @returns {string}
   */
  minuteToTime(minute) {
    let hour = Math.floor(minute / 60);
    let minutes = minute % 60 < 10 ? "0" + (minute % 60) : minute % 60;

    return hour + ":" + minutes;
  }

  /**
   * Разбивает минуты на 2 параметра hour, minute
   * @param minutes
   * @returns {{}}
   */
  minuteSplitHourMinute(minutes) {
    let result = {};
    result.hour = Math.floor(minutes / 60);
    result.minute = minutes - Math.floor(minutes / 60) * 60;
    return result;
  }

  /**
   * Минуты в человекопонятное время вида: 1 ч. 20 мин.
   * @param minutes
   * @returns {string}
   */
  minuteSplitHumanHourMinute(minutes) {
    let time = this.minuteSplitHourMinute(minutes);
    if (time.hour === 0) {
      return time.minute + " мин.";
    } else {
      return time.hour + " ч. " + time.minute + " мин.";
    }
  }

  /**
   * Переводит часы и минуты в минуты
   * @param hour
   * @param minute
   * @returns {number}
   */
  hourMinuteToMinute(hour, minute) {
    return +hour * 60 + +minute;
  }

  /**
   * Переводит миллисекунды в кол-во дней
   * @param param
   * @returns {number}
   */
  millisecondsToDay(param){
    return Math.floor(param / 86400000);
  }

  /**
   * Преобразование строки true/false к типу Boolean
   * @param val
   * @returns {boolean}
   */
  boolStringToType(val){
    if(val === 'true' || val === 'TRUE'){
      return true;
    }else if(val === 'false' || val === 'FALSE'){
      return false;
    }else{
      return false;
    }
  }

  /**
   * Проверяет, являются ли даты одинаковыми
   * @param {string} datePhpOne - '2022-07-05'
   * @param {string} datePhpTwo - '2022-07-05'
   * @returns boolean
   */
  isIdenticalDates(datePhpOne, datePhpTwo){
    return this.phpDateToJSObject(datePhpOne).getTime() === this.phpDateToJSObject(datePhpTwo).getTime();
  }

  /**
   * Преобразовывает номер телефона к маске
   * @param number - 79999999999
   * @returns {string} - +7(999)999-9999
   */
  phoneNumberToMask(number){
    let maskObject = {
      7: '(###)###-####',
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
    };
    let result = '';
    //let phone = number.replace(/^\+/, '');
    let phone = ''+number+'';
    let existsMask = false;
    for(let key in maskObject){
      let regexp = new RegExp(`^${key}`);
      if(phone.match(regexp)){
        existsMask = true;
        let mask = maskObject[key];
        phone = phone.replace(regexp, '');

        for(let z = 0; z < mask.length; z++){
          if(mask[z] == '#'){
            result += phone[0];
            phone = phone.slice(1);
          }else{
            result += mask[z];
          }
        }
        result = '+' +key +result;
        break;
      }
    }
    if(!existsMask){
      return '+' +number;
    }
    return result;
  }


  generateHash(length){
    let chars = '12345AaBbCcDdEeFfGgHhJjKkLMmNnPpQRrSsTtUuVvWwXxYyZz6789';
    let hash = '';
    for(let z = 0; z <= 100; z++){
      for (let i = 0; i < length; i++){
        let randKey = Math.floor(Math.random() * ((chars.length -1) - 0 + 1) ) + 0;
        hash += chars[randKey];
      }
      break;
    }

    return hash;
  }

}

export default Formatter;
