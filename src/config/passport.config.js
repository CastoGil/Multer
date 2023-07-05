import passport from "passport";
import LocalStrategy from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { userModel } from "../Dao/models/user.js";
import GithubStrategy from "passport-github2";
import { config } from "./env.config.js";
import { getLogger } from "../utils.js";
const logger = getLogger();
//variables de entorno//////
const client_ID = config.clientId;
const client_Secret = config.clientSecret;
const callback_URL = config.callbackURL;
const jwtSecret = config.jwtSecret;


//inicializamos passport//////
const initializePassport = () => {
  ///// Local strategy//////////
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async function (email, password, done) {
        try {
          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          const passwordMatch = bcrypt.compareSync(password, user.password);
          if (!passwordMatch) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  ////////// JWT strategy////////////////
  const jwtOptions = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };
  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const user = await userModel.findById(payload.id);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  
  ////// Estrategia current para extraer el usuario asociado a un token JWT/////////
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          ExtractJwt.fromAuthHeaderAsBearerToken(),
          ExtractJwt.fromExtractors([
            (req) => {
              let token = null;
              if (req && req.cookies) {
                token = req.cookies["token"];
              }
              return token;
            },
          ]),
        ]),
        secretOrKey: jwtSecret,
        algorithms: ["HS256"],
      },
      async (jwtPayload, done) => {
        try {
          const user = await userModel.findById(jwtPayload.Id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  ////////inicializando con github//////////////
  passport.use(
    new GithubStrategy(
      {
        clientID: client_ID,
        clientSecret: client_Secret,
        callbackURL: callback_URL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({
            email: profile.emails[0].value,
          });
          if (user) {
            return done(null, user);
          } else {
            const newUser = {
              first_name: profile.displayName,
              email: profile.emails[0].value,
            };
            const createdUser = await userModel.create(newUser);
            return done(null, createdUser);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
};
export default initializePassport;
