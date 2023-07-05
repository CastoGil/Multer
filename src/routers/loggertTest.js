import express from "express";
const router = express.Router();
import { getLogger } from "../utils.js";
const logger = getLogger();
router.get("/loggerTest", async (req, res) => {
  
  logger.debug("Mensaje de debug");
  logger.http("Mensaje de http");
  logger.info("Mensaje de info");
  logger.warning("Mensaje de warning");
  logger.error("Mensaje de error");
  logger.fatal("Mensaje de fatal");

  res.send("Logs generados");
});
export default router;
