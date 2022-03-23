import {
  model,
  Schema,
  Model,
  Document,
  ObjectId,
  LeanDocument,
  Date,
} from "mongoose";
import User_Schema from "../../db/schema/User_Schema";
import getInFoUserInArray from "./getInFoUserInArray";

export default async (
  textChat: LeanDocument<{
    _id: ObjectId;
    idUser: ObjectId;
    line_text: string;
    type: string;
    sendAt: any;
    like: ObjectId[];
    dislike: ObjectId[];
    replyMessage: [{ textChat: string; whoReply: ObjectId; replyAt: Date }];
  }>[]
) => {
  let resultTextChat: Array<{
    _id: ObjectId;
    line_text: string;
    avatar: string;
    displayName: string;
    user_name: string;
    sendAt: any;
    replyMessage: any[];
    like: any[];
    dislike: any[];
    type: string;
  }> = [];
  for (const eachText of textChat) {
    let userChat = await User_Schema.find({ _id: eachText.idUser })
      .lean()
      .exec();

    let likeMessage = eachText.like
      ? await getInFoUserInArray(eachText.like)
      : [];
    let disLikeMessage = eachText.dislike
      ? await getInFoUserInArray(eachText.dislike)
      : [];
    let replyMessage = eachText.replyMessage
      ? await converReplyMessage(eachText.replyMessage)
      : [];
    console.log(replyMessage);
    resultTextChat.push({
      _id: eachText._id,
      line_text: eachText.line_text,
      avatar: userChat[0].avatar,
      displayName: userChat[0].display_name,
      user_name: userChat[0].user_name,
      replyMessage: replyMessage,
      like: likeMessage.map((items) => {
        return {
          user_name: items.user_name,
          display_name: items.display_name,
          avatar: items.avatar,
        };
      }),
      dislike: disLikeMessage.map((items) => {
        return {
          user_name: items.user_name,
          display_name: items.display_name,
          avatar: items.avatar,
        };
      }),
      sendAt: eachText.sendAt,
      type: eachText.type,
    });
  }
  return resultTextChat;
};

const converReplyMessage = async (
  replyMessage: LeanDocument<{
    textChat: string;
    whoReply: ObjectId;
    replyAt: Date;
  }>[]
) => {
  let answerReplyMessage = [];

  for (const eachReplyMessage of replyMessage) {
    let infoUser = await User_Schema.find({ _id: eachReplyMessage.whoReply })
      .lean()
      .exec();
    answerReplyMessage.push({
      textchat: eachReplyMessage.textChat,
      avatar: infoUser[0].avatar,
      displayName: infoUser[0].display_name,
      user_name: infoUser[0].user_name,
      replyAt: eachReplyMessage.replyAt,
    });
  }

  return answerReplyMessage;
};
