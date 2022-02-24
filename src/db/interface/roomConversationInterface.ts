import { model, Schema, Model, Document, ObjectId, Date } from "mongoose";
export default interface roomConversation extends Document {
  name: String;
  textChat: [
    {
      idUser: ObjectId;
      line_text: string;
      type: string;
      sendAt: Date;
    }
  ];
  memberInRoom: ObjectId[];
}
