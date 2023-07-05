import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { config } from "./config/env.config.js";
import jwt from "jsonwebtoken";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import winston from "winston";
import { faker } from "@faker-js/faker";
import multer from "multer"
import fs from "fs"
import path from "path";
const NODE_ENV = config.NODE_ENV;
const JWT_SECRET = config.jwtSecret;
///////////////////////////////funciones para jwt///////////////////////////////
const currentStrategy = () => {
  return new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromExtractors([
          ExtractJwt.fromHeader("cookie"),
          ExtractJwt.fromUrlQueryParameter("token"),
        ]),
      ]),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userModel.findById(payload.sub);
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  );
};
const generateToken = (user) => {
  const payload = {
    sub: user._id,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};
export { __dirname, currentStrategy, generateToken };

/////////////////////////funcion faker/////////////
faker.locale = "es";
export default function generateMockProducts(cantidad) {
  const products = [];
  for (let i = 0; i < cantidad; i++) {
    const product = {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      category: faker.commerce.department(),
      thumbnail: faker.image.imageUrl(),
      code: faker.datatype.uuid(),
      stock: faker.random.numeric(1),
    };
    products.push(product);
  }
  return products;
}
////////////Winston//////////
const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};
const developmentLogger = winston.createLogger({
  levels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({ level: 'debug' })
  ]
});
const productionLogger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({ filename: 'errors.log', level: 'error' })
  ]
});
export function getLogger() {
  if (NODE_ENV === 'production') {
    return productionLogger;
  } else {
    return developmentLogger;
  }
}
//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    if (file.fieldname === "profileImage") {
      folder = "profiles";
    } else if (file.fieldname === "productImage") {
      folder = "products";
    } else {
      folder = "documents";
    }
    const destinationFolder = `src/uploads/${folder}`;

    // Verificar si la carpeta de destino existe, si no, crearla
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + uniqueSuffix + fileExt;

    cb(null, fileName);
  },
});
export const upload = multer({ storage: storage });