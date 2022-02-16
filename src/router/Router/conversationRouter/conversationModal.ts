// import { Request, Response } from "express";
// import conversation_Schema from "../../../db/schema/conversation_Schema";
// export const createARoomInConversation = async (
//   req: Request,
//   res: Response
// ) => {
//   let { projectOwner } = req.body;
//   let newConversation = {
//     projectOwner,
//   };
//   new conversation_Schema(newConversation).save(async (err, modal) => {
//     if (!err) {
//       res.send(modal);
//     } else {
//       res.send({ isSuccess: false });
//     }
//   });
// };

import roomConversation_Schema from "../../../db/schema/roomConversation_Schema";
import { Request, Response } from "express";
import conversation_Schema from "../../../db/schema/conversation_Schema";

export const createARoomInConversation = async (
  req: Request,
  res: Response
) => {
  let { name, idConversation, addToRoom } = req.body;
  new roomConversation_Schema({ name }).save(async (err, modal) => {
    if (!err) {
      let conversation = await conversation_Schema
        .updateOne(
          {
            $and: [
              { _id: idConversation },
              { Listchannel: { $elemMatch: { roomName: "workPlace" } } },
            ],
          },
          { $push: { "Listchannel.$.roomConversation": modal._id } }
        )
        .lean()
        .exec();
      res.send({ isSuccess: true });
    } else {
      res.send({ isSuccess: false });
    }
  });
  //   let result =
};
