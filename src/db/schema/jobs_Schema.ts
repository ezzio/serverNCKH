import { model, Schema, Model, Document } from "mongoose";

const jobs: Schema = new Schema({
  projectowner: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  title: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  start_time: { type: Date  },
  end_time: { type: Date },
  is_completed: { type: Schema.Types.Boolean },

  process: { type: String },
  priority: { type: String, required: true },
});

// module.exports = mongoose.model("jobs", jobs);
export const Job_Schema: Model<any> = model("jobs", jobs);