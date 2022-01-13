import { model, Schema, Model, Document, ObjectId } from "mongoose";
import detaiTaskInterface from "../interface/detailTaskInterface";

const detailTask = new Schema({
  title: { type: String },
  is_complete: { type: Boolean },
  attachments: [{ type: Schema.Types.ObjectId }],
  idProjectOwner: { type: Schema.Types.ObjectId, ref: "projects" },
  completed_at: { type: Date},
  completed_by: {type:String},
  assignOn: { type: Date, default: Date.now },
});
export default model<detaiTaskInterface>("detaiTask", detailTask);
