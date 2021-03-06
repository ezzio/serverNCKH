import roomConversation_Schema from "../../../db/schema/roomConversation_Schema";
import { Request, Response } from "express";
import conversation_Schema from "../../../db/schema/conversation_Schema";
import Project_Schema from "../../../db/schema/Project_Schema";
import listMemberInRoom from "../../../db/functionForDB/getInFoUserInArray";
import User_Schema from "../../../db/schema/User_Schema";
import converTextChat from "../../../db/functionForDB/convertTextChat";
import { ObjectId } from "mongoose";

let PORT = process.env.PORTURL || "http://localhost:4000";
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
        res.send({ isSuccess: true, modal });
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
          // let textChatConvert = await converTextChat(room[0].textChat)
          // console.log(room[0].textChat)
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

export const listMessageInRoom = async (req: Request, res: Response) => {
  let { idRoom } = req.body;
  let infoRoom = await roomConversation_Schema
    .find({ _id: idRoom })
    .lean()
    .exec();
  if (infoRoom.length > 0) {
    res.send({ isSuccess: true, infoRoom });
  } else {
    res.send({ isSuccess: false });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  let { idRoom, idProject, roomNameConversation } = req.body;
  let idConversation = await conversation_Schema
    .find({
      projectOwner: idProject,
    })
    .lean()
    .exec();

  await conversation_Schema.updateOne(
    {
      $and: [
        { _id: idConversation[0]._id },
        {
          Listchannel: { $elemMatch: { roomName: roomNameConversation } },
        },
      ],
    },
    { $pull: { "Listchannel.$.roomConversation": idRoom } }
  );

  await roomConversation_Schema.deleteOne({ _id: idRoom });
  res.send({ isSuccess: true });
};

export const listRoomConversation = async (req: Request, res: Response) => {
  let { idRoomConversation } = req.body;
  let roomInfo = await roomConversation_Schema
    .find({ _id: idRoomConversation })
    .lean()
    .exec();
  if (roomInfo.length > 0) {
    let memberInRoom: any[] = [];
    for (const eachMemberInRoomConversation of roomInfo[0].memberInRoom) {
      let userInRoom = await User_Schema.find({
        _id: eachMemberInRoomConversation,
      })
        .lean()
        .exec();
      if (userInRoom) {
        memberInRoom.push({
          user_name: userInRoom[0].user_name,
          user_displayName: userInRoom[0].display_name,
          avatarUrl: userInRoom[0].avatar,
        });
      }
    }

    let convertText = await converTextChat(roomInfo[0].textChat);

    res.send({
      isSuccess: true,
      infoRoom: {
        roomName: roomInfo[0].name,
        memberInRoom,
        textChat: convertText,
      },
    });
  } else {
    res.send({ isSuccess: false });
  }
};

export const renameChannelChat = async (req: Request, res: Response) => {
  let { idRoom, nameChange } = req.body;

  await roomConversation_Schema
    .updateOne({ _id: idRoom }, { $set: { name: nameChange } })
    .exec((error, modal) => {
      if (!error) {
        res.send({ isSuccess: true });
      } else {
        res.send({ isSuccess: false });
      }
    });
};

export const inviteMemberIntoRoomChat = async (req: Request, res: Response) => {
  let { idRoom, listUserInviteToChannel } = req.body;

  if (listUserInviteToChannel.length > 0) {
    let listIdInRoom: Array<ObjectId> = [];
    for (const eachUserName of listUserInviteToChannel) {
      let infoUSer = await User_Schema.find({ user_name: eachUserName })
        .lean()
        .exec();
      listIdInRoom.push(infoUSer[0]._id);
    }
    await roomConversation_Schema.updateOne(
      { _id: idRoom },
      { $set: { memberInRoom: listIdInRoom } }
    );
    res.send({ isSuccess: true });
  } else {
    res.send({ isSuccess: false });
  }
};

export const likeAndDislikeTextChat = async (req: Request, res: Response) => {
  let { idRoom, idTextChat, idUser, type } = req.body;
  let pushType = type.toLowerCase();
  let findTextChat = await roomConversation_Schema
    .find({
      $and: [
        { _id: idRoom },
        { textChat: { $elemMatch: { _id: idTextChat } } },
      ],
    })
    .lean()
    .exec();
  if (findTextChat.length > 0) {
    if (pushType === "like") {
      await roomConversation_Schema.updateOne(
        {
          $and: [
            { _id: idRoom },
            { textChat: { $elemMatch: { _id: idTextChat } } },
          ],
        },
        {
          $push: { "textChat.$.like": idUser },
        }
      );
    } else {
      await roomConversation_Schema.updateOne(
        {
          $and: [
            { _id: idRoom },
            { textChat: { $elemMatch: { _id: idTextChat } } },
          ],
        },
        {
          $push: { "textChat.$.dislike": idUser },
        }
      );
    }
    res.send({ isSuccess: true });
  } else {
    res.send({ isSuccess: false });
  }
};

export const replyMessageInConversation = async (
  req: Request,
  res: Response
) => {
  let { idRoom, idTextChat, idUser, messageReply } = req.body;
  let findTextChat = await roomConversation_Schema
    .find({
      $and: [
        { _id: idRoom },
        { textChat: { $elemMatch: { _id: idTextChat } } },
      ],
    })
    .lean()
    .exec();
  if (findTextChat.length > 0) {
    let newReply = {
      textChat: messageReply,
      whoReply: idUser,
    };
    await roomConversation_Schema.updateOne(
      {
        $and: [
          { _id: idRoom },
          { textChat: { $elemMatch: { _id: idTextChat } } },
        ],
      },
      {
        $push: { "textChat.$.replyMessage": newReply },
      }
    );
    res.send({ isSuccess: true });
  } else {
    res.send({ isSuccess: false });
  }
};

export const getInfoUser = async (req: Request, res: Response) => {
  let { idUSer } = req.body;
  let infoUser = await User_Schema.find({ _id: idUSer }).lean().exec();
  if (infoUser.length > 0) {
    res.send({
      isSuccess: true,
      infoUser: {
        user_name: infoUser[0].user_name,
        avatar: infoUser[0].avatar,
        displayName: infoUser[0].display_name,
      },
    });
  } else {
    res.send({ isSuccess: false });
  }
};

export const sendImage = async (req: Request, res: Response) => {
  let message = req.body;
  let { room_id, mess, idUser, type } = message;
  if (req.file === undefined) return res.send({ isSuccess: false });
  const imgUrl = `${PORT}/photo/${req.file.filename}`;
  await roomConversation_Schema.updateOne(
    { _id: room_id },
    {
      $push: {
        textChat: {
          line_text: imgUrl,
          idUser: idUser,
          type: "image",
        },
      },
    }
  );
  res.send({ isSuccess: true });
};

export const takeTheLastImageInTheConversation = async (
  req: Request,
  res: Response
) => {
  let { idRoom } = req.body;
  let infoRoom = await roomConversation_Schema
    .find({ _id: idRoom })
    .lean()
    .exec();
  let MessageInConversation = infoRoom[0].textChat;
  let infoUser = await User_Schema.find({
    _id: MessageInConversation[MessageInConversation.length - 1].idUser,
  });
  res.send({
    isSuccess: true,
    avatarURL: infoUser[0].avatar,
    user_name: infoUser[0].user_name,
    displayName: infoUser[0].display_name,
    mess: MessageInConversation[MessageInConversation.length - 1].line_text,
    type: "image",
  });
};
