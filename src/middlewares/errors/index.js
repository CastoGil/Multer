import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
  console.error(error.cause);
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).json({
        status: "error",
        error: error.name,
        cause: error.cause,
        message: error.message
      });
      break;
    case EErrors.INVALID_IDS_ERROR:
      res.status(400).json({
        status: "error",
        error: error.name,
        cause: error.cause,
        message: error.message
      });
      break;
    case EErrors.DATABASE_ERROR:
      res.status(500).json({
        status: "error",
        error: error.name,
        cause: error.cause,
        message: error.message
      });
      break;
    case EErrors.UNAUTHORIZED_ERROR: 
      res.status(401).json({
        status: "error",
        error: error.name,
        cause: error.cause,
        message: error.message
      });
      break;
    default:
      res.status(500).json({
        status: "error",
        error: "An unexpected error occurred"
      });
  }
};


