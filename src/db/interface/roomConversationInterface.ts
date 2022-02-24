import { model, Schema, Model, Document, ObjectId } from "mongoose";
export default interface roomConversation extends Document {
  name: String;
  textChat: [
    {
      idUser: ObjectId;
      line_text: string;
      type: string;
    }
  ];
  memberInRoom: ObjectId[];
}
