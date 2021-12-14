import { model, Schema, Model, Document } from "mongoose";
import { columnsSchemaInterface } from "../interface/columnsSchemaInterface";
const columns: Schema = new Schema({
  jobowner: { type: Schema.Types.ObjectId, ref: "jobs" },
  idTask: { type: String, default: "cong viec 0" },
  column: {
    type: [
      {
        id_column: { type: Number },
        tasks: [{ type: Schema.Types.ObjectId, ref: "tasks" }],
      },
    ],
    default: [
      {
        id_column: 0,
        tasks: [],
      },
      {
        id_column: 1,
        tasks: [],
      },
      {
        id_column: 2,
        tasks: [],
      },
      {
        id_column: 3,
        tasks: [],
      },
    ],
  },
});
export default model<columnsSchemaInterface>("columns", columns);
