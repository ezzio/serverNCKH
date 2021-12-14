import { model, Schema, Model, Document } from "mongoose";

const AttachMent: Schema = new Schema(
  {
    task_id: { type: Schema.Types.ObjectId, ref: "task" },
    projectowner: { type: Schema.Types.ObjectId, ref: "Project" },
    location: { type: "string" },
    nameType: { type: "string" },

    uploaded_at: { type: Date, default: Date.now },
  },
  { collection: "attrachment" }
);

export const AttachmentsSchema: Model<any> = model("AttachMent", AttachMent);
