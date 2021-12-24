import { model, Schema, Model, Document } from "mongoose";
import taskSchemaInterface from "../interface/taskSchemaInterface";

const task = new Schema({
  title: { type: String, required: true },
  decription: { type: String },
  is_complete: { type: Boolean, required: true },
  process: { type: Number, required: true },
  priority: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date },
  tasker: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default model<taskSchemaInterface>("task", task);
