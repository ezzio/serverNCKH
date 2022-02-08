import { Document, Schema,  ObjectId } from "mongoose";
export default interface detaiTaskInterface extends Document {
  title: string;
  is_complete: boolean;
  assignOn: Date;
  idProjectOwner: ObjectId;
  attachments: [ObjectId];
}
