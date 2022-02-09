import meetingRoomInterface from "../../db/interface/meetingRoomInterface";
import { model, Schema, Model, Document } from "mongoose";

const meetingRoom = new Schema({
  in_meeting: [{ type: Schema.Types.ObjectId, ref: "User" }],
  name: { type: String, required: true },
  description: { type: String },
  projectowner: { type: Schema.Types.ObjectId, required: true },
  start_time: { type: Date, default: new Date() },
});

export default model<meetingRoomInterface>("meetingRoom", meetingRoom);
