import { model, Schema, Model, Document , ObjectId} from "mongoose";
import detailTaskInterface from "../interface/taskSchemaInterface";

const detailTask = new Schema({
    title:  { type: String },
    is_complete: {type: Boolean},
    assignOn: {type: Date , default: Date.now}
})
export default model<detailTaskInterface>("detaiTask", detailTask);