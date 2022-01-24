import { model, Schema, Document, ObjectId } from "mongoose";

export default interface taskSchemaInterface extends Document {
  title: string,
  progress: number,
  level: string,
  decription: string,
  is_complete: boolean,
  priority: string,
  start_time: Date,
  description: string,
  isOverdue: boolean,
  end_time: Date,
  detailTask: [],
  taskers: any[]
}
