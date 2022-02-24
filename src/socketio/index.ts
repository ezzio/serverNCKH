import * as express from "express";
import conversationInTask_Schema from "../db/schema/conversationInTask";
import roominconversation_schema from "../db/schema/roomConversation_Schema";
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
    socket.on("chat-connectToRoomConversation", (data: any) => {
      console.log("connect vao room");
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
      await conversationInTask_Schema.updateOne(
        { idTask: message.room_id },
        {
          $push: {
            textChat: {
              displayName: message.display_name,
              line_text: message.message,
              user_name: message.user_name,
              avatar: message.avatarURL,
              type: "text",
            },
          },
        }
      );
      socket.broadcast.to(message.room_id).emit("newMessages", message);
    });
    socket.on("sendMessageConversation", async (message: any) => {
      let { mess, idUser, type, room_id } = message;

      let findRoomConversation = await roominconversation_schema
        .find({ _id: room_id })
        .lean()
        .exec();
      console.log(findRoomConversation);
      await roominconversation_schema.updateOne(
        { _id: room_id },
        {
          $push: {
            textChat: {
              line_text: mess,
              idUser: idUser,
              type: type,
            },
          },
        }
      );
      socket.broadcast.to(room_id).emit("newMessagesConversation", message);
      console.log(message);
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
