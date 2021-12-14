import { Document, Schema,ObjectId } from "mongoose";
export interface projectSchemaInterface extends Document {
  name: string;
  createAt: Date;
  is_complete: boolean;
  process: string;
  members: ObjectId[];
  owners: ObjectId[];
}
