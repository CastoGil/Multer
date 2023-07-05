import express from "express";
import { authorize , admin} from "../middlewares/index.js";
const router = express.Router();
//////////////////////RUTA CHAT///////////////////////////

router.get("/chat",admin, authorize, async (req, res) => {
  res.render("chats", {});
});

export default router;