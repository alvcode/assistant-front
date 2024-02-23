class Validator {
  /**
   * Массив объектов с правилами валидации для поля
   * @param array obj - [{fieldName, value, type (required, email, string, integer, mask...), length, mask, maxValue, minValue}]
   */
  validate(obj) {
    for (let key in obj) {
      let result = this.goValidate(obj[key]);
      if (result.result == "error") {
        return result;
      }
    }
    return { result: "ok" };
  }

  goValidate(obj) {
    if (obj.type == "required") {
      return this.validateRequired(obj.value, obj.fieldName, obj.length);
    } else if (obj.type == "string") {
      return this.validateString(obj.value, obj.fieldName, obj.length);
    } else if (obj.type == "integer") {
      return this.validateInteger(
        obj.value,
        obj.fieldName,
        obj.length,
        obj.maxValue,
        obj.minValue
      );
    } else if (obj.type == "mask") {
      return this.validateMask(obj.value, obj.fieldName, obj.mask);
    } else if (obj.type == "email") {
      return this.validateEmail(obj.value, obj.fieldName, obj.length);
    }
  }

  validateMask(value, fieldName, mask) {
    if (value !== "" && value !== null && mask.length !== value.length) {
      return {
        result: "error",
        message: "Поле '" + fieldName + "' не соответствует маске ввода"
      };
    } else {
      return { result: "ok" };
    }
  }

  validateEmail(value, fieldName, length) {
    if (length) {
      let lengthRes = this.validateLength(value, length);
      if (lengthRes.result == "error") {
        return lengthRes;
      }
    }
    if (value !== "" && value !== null && !value.match(/@/)) {
      return {
        result: "error",
        message: "Поле '" + fieldName + "' должно быть в формате e-mail"
      };
    } else if(value !== "" && value !== null && value.match(/,/)) {
      return {
        result: "error",
        message: "Поле '" + fieldName + "' не может содержать знаки препинания"
      };
    } else {
      return { result: "ok" };
    }
  }

  validateRequired(value, fieldName, length) {
    if (length) {
      let lengthRes = this.validateLength(value, length);
      if (lengthRes.result == "error") {
        return lengthRes;
      }
    }
    if (value.trim() == "") {
      return {
        result: "error",
        message: "Пожалуйста, заполните поле '" + fieldName + "'"
      };
    } else {
      return { result: "ok" };
    }
  }

  validateString(value, fieldName, length) {
    if (length) {
      let lengthRes = this.validateLength(value, length);
      if (lengthRes.result == "error") {
        return lengthRes;
      }
    }
    if (typeof value !== 'string' && value !== "" && value !== null) {
      return {
        result: "error",
        message: "Поле '" + fieldName + "' должно быть строкой"
      };
    } else {
      return { result: "ok" };
    }
  }

  validateInteger(value, fieldName, length, maxValue, minValue) {
    if (length) {
      let lengthRes = this.validateLength(value, length);
      if (lengthRes.result == "error") {
        return lengthRes;
      }
    }
    if (isNaN(Number(value))) {
      return {
        result: "error",
        message: "Поле '" + fieldName + "' должно быть числом"
      };
    } else if (maxValue && maxValue < value) {
      return {
        result: "error",
        message: "Максимальное значение поля '" + fieldName + "': " + maxValue
      };
    } else if (minValue && minValue > value) {
      return {
        result: "error",
        message: "Минимальное значение поля '" + fieldName + "': " + minValue
      };
    } else {
      return { result: "ok" };
    }
  }

  validateLength(value, length) {
    if (value !== null && value.length > length) {
      return {
        result: "error",
        message: "Поле должно содержать не более '" + length + "' символов"
      };
    }
    return { result: "ok" };
  }
}

export default Validator;
