import {
  model,
  Schema,
  Model,
  Document,
  ObjectId,
  LeanDocument,
} from "mongoose";
import User_Schema from "../../db/schema/User_Schema";
export default async (
  textChat: LeanDocument<{
    idUser: ObjectId;
    line_text: string;
    type: string;
  }>[]
) => {
  let resultTextChat: Array<{
    line_text: string;
    avatar: string;
    displayName: string;
    user_name: string;
    type: string;
  }> = [];
  for (const eachText of textChat) {
    let userChat = await User_Schema.find({ _id: eachText.idUser })
      .lean()
      .exec();
    resultTextChat.push({
      line_text: eachText.line_text,
      avatar: userChat[0].avatar,
      displayName: userChat[0].display_name,
      user_name: userChat[0].user_name,
      type: eachText.type,
    });
  }
  return resultTextChat;
};
