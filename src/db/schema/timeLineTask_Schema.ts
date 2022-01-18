import { model, Schema, Model, Document, ObjectId } from "mongoose";

const timeLineTaskSchema = new Schema({
  createAt: { type: Date, default: Date.now },
  whoTrigger: { type: Schema.Types.ObjectId, required: true },
  taskEdit: {
    idTask: { type: Schema.Types.ObjectId, required: true },
    taskTitle: { type: String },
  },
});
export default model<any>("timeLineSchema", timeLineTaskSchema);
