import express from "express";
import mainRouter from "./routers/index.js";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routers/views.router.js";
import { initWsServer } from "./services/socket.js";
import http from "http";
import chatRouter from "./routers/chatview.js";
import authRouter from "./routers/auth.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { config } from "./config/env.config.js";
import connectToDB from "./Dao/db.js";
import compression from "express-compression";
import errorHandler from "./middlewares/errors/index.js";
import { getLogger } from "./utils.js";
import loggerTest from "./routers/loggertTest.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import methodOverride from "method-override";
const logger = getLogger();
const mongoURI = config.mongoURI;
const cookieSecret = config.cookieSecret;

// Express
const app = express();
const myHttpServer = http.Server(app);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.json());
app.use(cookieParser(cookieSecret));

// Session
const sessionStore = MongoStore.create({
  mongoUrl: mongoURI,
  collectionName: "my-sessions",
  ttl: 60 * 60, // 1 hour
});
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use(flash());

// Passport
initializePassport();
app.use(passport.initialize());

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(express.static(`${__dirname}/public`));

//swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Eccomerce",
      version: "1.0.0",
      description: "Documentacion de Product y Cart",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);

app.use(compression({ brotli: { enabled: true, zlib: {} } }));

// Rutas

app.use("/api", mainRouter); // Manejador de rutas
app.use("/", viewsRouter); // Ruta websocket
app.use("/", chatRouter); // Ruta chat
app.use("/auth", authRouter); // Ruta de usuario (inicio sesión)
app.use("/", loggerTest);
initWsServer(myHttpServer);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use(errorHandler);

// Conexión a la base de datos
connectToDB();

const PORT = config.PORT || 8080;
myHttpServer.listen(PORT, () =>
  logger.info(`Server listening on port ${PORT}`)
);

// Middleware de registro de solicitudes
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`);
  next();
});

// Middleware de ruta de error
app.use((req, res, next) => {
  return res.status(404).json({
    error: -2,
    descripcion: `ruta ${req.url} not implemented`,
  });
});

export default myHttpServer;

