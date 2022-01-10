import { model, Schema, Model, Document, ObjectId } from "mongoose";
import detaiTaskInterface from "../interface/detailTaskInterface";

const detailTask = new Schema({
  title: { type: String },
  is_complete: { type: Boolean },
  attachments: [{ type: Schema.Types.ObjectId }],
  assignOn: { type: Date, default: Date.now },
});
export default model<detaiTaskInterface>("detaiTask", detailTask);
