import { Document, Schema, ObjectId } from "mongoose";
export default interface jobTimeLineInterface extends Document {
  //   whoTrigger: ObjectId;
  progress: Number;
  jobEdit: ObjectId;
}
