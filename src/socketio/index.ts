import * as express from "express";
let userInRoom = [];
export default (server: express.Express) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket: any) => {});
};
