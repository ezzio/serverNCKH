import roomConversation_Schema from "../../../db/schema/roomConversation_Schema";
import { Request, Response } from "express";
import conversation_Schema from "../../../db/schema/conversation_Schema";
import Project_Schema from "../../../db/schema/Project_Schema";
import listMemberInRoom from "../../../db/functionForDB/getInFoUserInArray";

export const createARoomInConversation = async (
  req: Request,
  res: Response
) => {
  let { name, idConversation, memberInRoom } = req.body;
  new roomConversation_Schema({ name, memberInRoom }).save(
    async (err, modal) => {
      if (!err) {
        let conversation = await conversation_Schema.updateOne(
          {
            $and: [
              { _id: idConversation },
              { Listchannel: { $elemMatch: { roomName: "workPlace" } } },
            ],
          },
          { $push: { "Listchannel.$.roomConversation": modal._id } }
        );
        res.send({ isSuccess: true });
      } else {
        res.send({ isSuccess: false });
      }
    }
  );
};

export const listConversationInProject = async (
  req: Request,
  res: Response
) => {
  let { idProject } = req.body;
  let result: any[] = [];
  let findProject = await conversation_Schema
    .find({ projectOwner: idProject })
    .lean()
    .exec();

  let Listchannel = findProject[0].Listchannel;
  for (const eachChannal of Listchannel) {
    let roomConversation: any[] = [];
    if (eachChannal.roomConversation.length > 0) {
      for (const eachConersation of eachChannal.roomConversation) {
        let room = await roomConversation_Schema
          .find({ _id: eachConersation })
          .lean()
          .exec();
        roomConversation.push({
          name: room[0].name,
          textChat: room[0].textChat,
          memberInRoom: listMemberInRoom(room[0].memberInRoom),
        });

      }
    }
    result.push({ roomName: eachChannal.roomName, roomConversation });
  }
  // console.log(Listchannel);
  res.send({ isSuccess: true , result });
};
