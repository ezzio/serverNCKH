import { model, Schema, Model, Document } from "mongoose";

const AttachMent = new Schema(
  {
    URL: { type: "string" },
    name: { type: "string"},
    nameType: { type: "string" },
    uploaded_at: { type: Date, default: Date.now },
  }
);

export default model<any>("AttachMent", AttachMent);
