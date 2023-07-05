import dotenv from 'dotenv';
dotenv.config();

export const config= {
  mongoURI: process.env.MONGO_URI,
  clientId: process.env.client_ID,
  clientSecret: process.env.client_Secret,
  callbackURL: process.env.callback_URL,
  jwtSecret: process.env.JWT_SECRET,
  PORT:process.env.PORT,
  NODE_ENV:process.env.NODE_ENV,
  cookieSecret:process.env.COOKIE_SECRET
};