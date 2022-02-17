import roomConversation_Schema from "../../../db/schema/roomConversation_Schema";
import { Request, Response } from "express";
import conversation_Schema from "../../../db/schema/conversation_Schema";
import Project_Schema from "../../../db/schema/Project_Schema";
import listMemberInRoom from "../../../db/functionForDB/getInFoUserInArray";
import User_Schema from "../../../db/schema/User_Schema";

export const createARoomInConversation = async (
  req: Request,
  res: Response
) => {
  let { name, idConversation, memberInRoomUserName, roomNameConversation } =
    req.body;
  let memberInRoom: any[] = [];
  for (const eachMemberRequest of memberInRoomUserName) {
    let eachMember = await User_Schema.find({ user_name: eachMemberRequest })
      .lean()
      .exec();
    memberInRoom.push(eachMember[0]._id);
  }
  new roomConversation_Schema({ name, memberInRoom }).save(
    async (err, modal) => {
      if (!err) {
        await conversation_Schema.updateOne(
          {
            $and: [
              { _id: idConversation },
              {
                Listchannel: { $elemMatch: { roomName: roomNameConversation } },
              },
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
  if (findProject.length > 0) {
    let Listchannel = findProject[0].Listchannel;
    for (const eachChannal of Listchannel) {
      let roomConversation: any[] = [];
      if (eachChannal.roomConversation.length > 0) {
        for (const eachConersation of eachChannal.roomConversation) {
          let room = await roomConversation_Schema
            .find({ _id: eachConersation })
            .lean()
            .exec();
          let listMember = await listMemberInRoom(room[0].memberInRoom);
          roomConversation.push({
            idRoom: room[0]._id,
            name: room[0].name,
            textChat: room[0].textChat,
            memberInRoom: listMember,
          });
        }
      }
      result.push({ roomName: eachChannal.roomName, roomConversation });
    }
    res.send({ isSuccess: true, result, idConversation: findProject[0]._id });
  } else {
    res.send({ isSuccess: false });
  }
};
