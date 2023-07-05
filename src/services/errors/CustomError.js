export default class CustomError extends Error {
    constructor({ name = "Error", message, cause, code = 1 }) {
      super(message);
      this.name = name;
      this.code = code;
      this.cause = cause;
    }
  }
  