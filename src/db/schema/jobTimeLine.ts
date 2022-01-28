import { model, Schema, Model, Document, ObjectId } from "mongoose";
import timeLineTaskInterface from "../interface/InterfacejobTimeLine";
const jobTimeLineSchema = new Schema({
  createAt: { type: Date, default: Date.now },
  // whoTrigger: { type: Schema.Types.ObjectId, required: true },
  action: { type: String },
  progress: { type: Number },
  jobEdit: { type: Schema.Types.ObjectId, ref: "jobs" },
});
export default model<timeLineTaskInterface>("jobTimeLine", jobTimeLineSchema);
