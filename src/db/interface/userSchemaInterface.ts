import { Document, Schema, ObjectId } from "mongoose";

export default interface userSchemaInterface extends Document {
  user_name: string;
  password: string;
  display_name: string;
  bio: string;
  company: string;
  address: string;
  email: string;
  avatar: string;
  github_token: string;
  createAt: Date;
  InfoAllProjectJoin: ObjectId[];
}
