import * as express from "express";
import conversationInTask_Schema from "../db/schema/conversationInTask";
import videoCall from "./functionSocket/videoCall";
let userInRoom: any[] = [];
export default (server: express.Express, app: any) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  app.set("userInRoom", userInRoom);
  io.on("connection", (socket: any) => {
    socket.on("chat-connectToRoom", (data: any) => {
      let index = userInRoom.findIndex((user) => user.idUser === data.id);
      if (index == -1) {
        userInRoom.push({
          socketId: socket.id,
          idUser: data.id,
        });
      } else {
        userInRoom[index].socketId = socket.id;
      }
      socket.join(data.room_id);
    });

    socket.on("sendMessage", async (message: any) => {
      console.log(message);
      await conversationInTask_Schema.updateOne(
        { idTask: message.room_id },
        {
          $push: {
            textChat: {
              displayName: message.display_name,
              line_text: message.message ,
              user_name: message.user_name,
              avatar: message.avatarURL,
              type: "text",
            },
          },
        }
      );
      socket.broadcast.to(message.room_id).emit("newMessages", message);
    });
    socket.on("disconnect", async () => {
      let index = await userInRoom.findIndex(
        (user) => user.socketId == socket.id
      );
      if (index != -1) {
        const a1 = userInRoom.slice(0, index);
        const a2 = userInRoom.slice(index + 1, userInRoom.length);
        const new_arr = a1.concat(a2);
        userInRoom = new_arr;
      }
    });
  });
};
