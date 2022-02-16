import { model, Schema, Model, Document } from "mongoose";
import roomConversationInterface from "../interface/roomConversationInterface";
const roomInConversation_Schema = new Schema({
  name: { type: String, required: true },
  textChat: [
    {
      displayName: { type: String },
      line_text: { type: String },
      user_name: { type: String },
      avatar: { type: String },
      sendAt: { type: Date, default: Date.now },
      type: { type: String },
    },
  ],
  memberInRoom: [{ type: Schema.Types.ObjectId }],
});

export default model<roomConversationInterface>(
  "roomInConversation_Schema",
  roomInConversation_Schema
);
