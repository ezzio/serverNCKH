import { model, Schema, Document, ObjectId } from "mongoose";

export default interface taskSchemaInterface extends Document {
  title: string;
  process: string;
  level: string;
  decription: string;
  is_complete: boolean;
  priority: string;
  start_time: Date;
  end_time: Date;
  tasker: [
    {
      id_column: 0;
      tasks: ObjectId[];
    },
    {
      id_column: 1;
      tasks: ObjectId[];
    },
    {
      id_column: 2;
      tasks: ObjectId[];
    },
    {
      id_column: 3;
      tasks: ObjectId[];
    }
  ];
}
