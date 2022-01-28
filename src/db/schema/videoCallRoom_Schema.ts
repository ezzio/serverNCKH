import { model, Schema, Model } from "mongoose";

const videoCallRoom = new Schema({
    title: { type: String, required: true },
    description: { type: String},
    startAt: { type: Date, required: true },
    members: [{ type: Schema.Types.ObjectId }]
})

export default model<any>("videoCallRoom_Schema", videoCallRoom);
