import { model, Schema, Model, Document, ObjectId } from "mongoose";
export default interface roomConversation extends Document {
  name: String;
  textChat: [
    {
      displayName: string;
      line_text: string;
      user_name: string;
      avatar: string;
      sendAt: Date;
      type: string;
    }
  ];
  memberInRoom: ObjectId[];
}
