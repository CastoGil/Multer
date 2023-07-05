import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const admin = (req, res, next) => {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.user = { role: "admin" };
    res.cookie("role", "admin", { httpOnly: true });
    return res.redirect("/api/products");
  }
  req.user = { role: "user" };
  next(); 
};

///
export const authorize = (req, res, next) => {
  const role = req.cookies.role;
  const token = req.cookies.token;
  if (req.originalUrl.includes("/api/products") || req.originalUrl.includes("/realtimeproducts")) {
    if (role && role === "admin") {
      req.user = { role: "admin" };
      return next();
    } else if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET);
        if (user.role === "premium") {
          req.user = { role: "premium", email: user.email };
          return next();
        } else {
          return res.status(401).json({ error: "No tienes permiso para realizar esta acción" });
        }
      } catch (err) {
        return res.status(401).json({ error: "No tienes permiso para realizar esta acción" });
      }
    } else {
      return res.status(401).json({ error: "No tienes permiso para realizar esta acción" });
    }
  } else if (req.originalUrl.includes("/api/carts") || req.originalUrl.includes("/chat")) {
    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET);
        console.log(user)
        if (user.role === "premium") {
          req.user = { role: "premium", email: user.email };
          return next();
        } else if (user.role === "usuario") {
          req.user = { role: "usuario", email: user.email };
          return next();
        } else {
          return res.status(401).json({ error: "No tienes permiso para realizar esta acción" });
        }
      } catch (err) {
        return res.status(401).json({ error: "No tienes permiso para realizar esta acción" });
      }
    } else {
      return res.status(401).json({ error: "No tienes permiso para realizar esta acción" });
    }
  }
  
  next();
};

