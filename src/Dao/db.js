import mongoose from "mongoose";
import { config } from "../config/env.config.js";
import { getLogger } from "../utils.js";
const logger = getLogger();
const mongoURI = config.mongoURI
// Función para conectar a la base de datos
const connectToDB = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  logger.info("Connected to database");
};

export default connectToDB;
