import { model, Schema, Model, Document } from "mongoose";

const conversationInTask = new Schema({
  idTask: { type: Schema.Types.ObjectId , required: true},
  textChat: [
    {
      displayName: { type: String },
      line_text: [{ type: String }],
      user_name: { type: String },
      sendAt: { type: Date, default: Date.now },
      type: { type: String },
    },
  ],
});
export default model<any>("conversationInTask", conversationInTask);
