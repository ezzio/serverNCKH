import { model, Schema, Model, Document } from "mongoose";
export default interface timeLineTaskInterface extends Document {
  createAt: Date ; 
  whoTrigger: Schema.Types.ObjectId;
  action: string;
  taskEdit: {
    idTask: Schema.Types.ObjectId,
    taskTitle: string;
  };
}
