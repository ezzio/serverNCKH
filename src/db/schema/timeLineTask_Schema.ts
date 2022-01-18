import { model, Schema, Model, Document, ObjectId } from "mongoose";
import timeLineTaskInterface  from "../interface/timeLineTaskInterFace"; 
const timeLineTaskSchema = new Schema({
  createAt: { type: Date, default: Date.now },
  whoTrigger: { type: Schema.Types.ObjectId, required: true },
  action: {type:String },
  taskEdit: {
    idTask: { type: Schema.Types.ObjectId, required: true },
    taskTitle: { type: String },
  },
});
export default model<timeLineTaskInterface>("timeLineSchema", timeLineTaskSchema);
