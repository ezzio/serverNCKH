import { model, Schema, Model, Document, ObjectId } from "mongoose";
import timeLineTaskInterface from "../interface/InterfacejobTimeLine";
const jobTimeLineSchema = new Schema({
  createAt: { type: Date, default: Date.now },
  // whoTrigger: { type: Schema.Types.ObjectId, required: true },
  action: { type: String },
  progress: { type: Number },
  jobEdit: { type: Schema.Types.ObjectId },
});
export default model<timeLineTaskInterface>("jobTimeLine", jobTimeLineSchema);
