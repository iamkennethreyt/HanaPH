const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateAdvertismentInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.details = !isEmpty(data.details) ? data.details : "";
  data.category = !isEmpty(data.category) ? data.category : "";
  data.field = !isEmpty(data.field) ? data.field : "";
  data.serialcode = !isEmpty(data.serialcode) ? data.serialcode : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (validator.isEmpty(data.details)) {
    errors.details = "Details field is required";
  }

  if (validator.isEmpty(data.category)) {
    errors.category = "Category field is required";
  }

  if (validator.isEmpty(data.field)) {
    errors.field = "Job Field is required";
  }

  if (validator.isEmpty(data.serialcode)) {
    errors.serialcode = "Serial code field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
