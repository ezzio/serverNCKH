import { model, Schema, Model } from "mongoose";
import userSchemaInterface from "../interface/userSchemaInterface";
const User = new Schema(
  {
    user_name: { type: String, required: true },
    password: { type: String, required: true },
    display_name: { type: String },
    avatar: { type: String },
    githubToken: { type: String },
    createAt: { type: Date, default: Date.now },
    InfoAllProjectJoin: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  },
  { collection: "User" }
);

// const DonHang = ;
export default model<userSchemaInterface>("user_Schema", User);
