import { Server } from "socket.io";
import { productModel } from "../Dao/models/products.js";
import { messageModel } from "../Dao/models/message.js";
import { getLogger } from "../utils.js";
const logger = getLogger();
let users = [];
let io;
//iniciamos el servidor de websocket
const initWsServer = (server) => {
  io = new Server(server);
  //iniciamos la conexion con el cliente
  io.on("connection", async (socket) => {
    logger.info(`Nueva Conexion establecida! ${socket.id}`);
    //leemos todos los productos
    socket.on("allProducts", async () => {
      const products = await productModel.find();
      products.forEach((unProducto) => {
        socket.emit("producto", unProducto);
      });
    });
    let messages = await messageModel.find();
    socket.emit("load old msgs", messages)
    socket.on("new user",async (data, cb) => {
      if (data in users) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNicknames();
      }
    });
    
    socket.on("send message", async (data) => {
      const newMsg = new messageModel({
        user: socket.nickname,
        message: data,
      });
      await newMsg.save();
      io.sockets.emit("new message", {
        user: socket.nickname,
        message: data,
      });
    });
    //usuario desconectado
    socket.on("disconnect",async (data) => {
      logger.info("user disconnet");
      if (!socket.nickname) return;
      delete users[socket.nickname];
       updateNicknames();
    });
  });

  return io;
};
const updateNicknames = () => {
  io.sockets.emit("usernames", Object.keys(users));
};

const socketEmitBack = async () => {
  const products = await productModel.find();
  io.emit("productos", products);
};
const socketEmit = (eventName, message) => {
  io.emit(eventName, message);
};

export { initWsServer, socketEmit, socketEmitBack };
