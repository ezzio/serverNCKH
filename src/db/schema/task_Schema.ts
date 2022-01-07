import { model, Schema, Model, Document , ObjectId} from "mongoose";
import taskSchemaInterface from "../interface/taskSchemaInterface";

const task = new Schema({
  title: { type: String, required: true },
  is_complete: { type: Boolean, required: true },
  process: { type: Number, required: true },
  priority: { type: String, required: true },
  start_time: { type: Date, required: true },
  description:{ type: String },
  detailTask: [{type:  Schema.Types.ObjectId}],
  isOverdue: { type: Boolean },
  end_time: { type: Date },
  taskers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default model<taskSchemaInterface>("task", task);
