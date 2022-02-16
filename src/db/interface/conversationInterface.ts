import { model, Schema, Model, Document, ObjectId } from "mongoose";
export interface conversationInterface extends Document {
  createAt: Date;
  projectOwner: ObjectId;
  Listchannel: [
    {
      roomName: string;
      roomConversation: ObjectId[];
    }
  ];
}
