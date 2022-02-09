import { Document, Schema, ObjectId } from "mongoose";
export default interface meetingRoomInterface extends Document {
  in_meeting: ObjectId[];
  name: String;
  description: String;
  projectowner: ObjectId;
  start_time: Date;
}
