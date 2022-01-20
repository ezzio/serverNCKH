import { Request, Response } from "express";
import conversationInTask_Schema from "../../../db/schema/conversationInTask";
// export const sendMessageInTask = (req: Request, res: Response) => {
//   let request = req.body;
//   var socket = req.app.get("socketio");
//   console.log(socket);
//   socket.broadcast.to(request.room_id).emit("newMessages", {
//     message: request.mess,
//     avatarURL: request.user.avatar,
//     display_name: request.user.display_name,
//     user_name: request.user.user_name,
//     room_id: request.room_id,
//   });
// };
