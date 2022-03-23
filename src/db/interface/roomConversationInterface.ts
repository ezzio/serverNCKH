import { model, Schema, Model, Document, ObjectId, Date } from "mongoose";
export default interface roomConversation extends Document {
  name: String;
  textChat: [
    {
      _id: ObjectId;
      idUser: ObjectId;
      line_text: string;
      type: string;
      sendAt: Date;
      like: ObjectId[];
      dislike: ObjectId[];
      replyMessage: [{ textChat: string; whoReply: ObjectId; replyAt: Date }];
    }
  ];
  memberInRoom: ObjectId[];
}
