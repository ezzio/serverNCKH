import { conversationInterface } from "db/interface/conversationInterface";
import { model, Schema, Model, Document, ObjectId } from "mongoose";
const conversation_Schema = new Schema({
  createAt: { type: Date, required: true, default: Date.now },
  projectOwner: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  Listchannel: {
    type: [
      {
        roomName: { type: String },
        roomConversation: [
          { type: Schema.Types.ObjectId, ref: "RoomConversation" },
        ],
      },

      {
        roomName: { type: String },
        roomConversation: [
          { type: Schema.Types.ObjectId, ref: "RoomConversation" },
        ],
      },

      {
        roomName: { type: String },
        roomConversation: [
          { type: Schema.Types.ObjectId, ref: "RoomConversation" },
        ],
      },
    ],
    default: [
      {
        roomName: "workPlace",
        roomConversation: [],
      },
      {
        roomName: "teams",
        roomConversation: [],
      },
      {
        roomName: "orthers",
        roomConversation: [],
      },
    ],
  },
});
export default model<conversationInterface>(
  "conversation_Schema",
  conversation_Schema
);
