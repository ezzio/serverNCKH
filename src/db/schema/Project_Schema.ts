import { projectSchemaInterface } from "./../interface/projectSchemaInterface";
import { model, Schema, Model, Document } from "mongoose";

const ProjectSchema = new Schema({
  name: { type: String },
  createAt: { type: Date, default: Date.now },
  avatarProject: { type: String },
  is_complete: { type: Boolean },
  process: { type: String },
  members: [
    {
      idMember: { type: Schema.Types.ObjectId, ref: "User" },
      tag: { type: String },
    },
  ],
  owners: { type: Schema.Types.ObjectId, ref: "User" },
  projectTimeLine: [{ type: Schema.Types.ObjectId, ref: "timeLineSchema" }],
});

// const DonHang = ;
export default model<projectSchemaInterface>("Project", ProjectSchema);
