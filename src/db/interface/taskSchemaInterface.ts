import { model, Schema, Document, ObjectId } from "mongoose";

export default interface taskSchemaInterface extends Document {
  title: string;
  level: string;
  progress: string;
  priority: string;
  start_time: string;
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
