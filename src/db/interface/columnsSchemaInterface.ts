import { model, Schema, Model, Document , ObjectId } from "mongoose";
export interface columnsSchemaInterface extends Document {
  jobowner: ObjectId,
  column: [
    {
      id_column: 0;
      tasks: [];
    },
    {
      id_column: 1;
      tasks: [];
    },
    {
      id_column: 2;
      tasks:[];
    },
    {
      id_column: 3;
      tasks: [];
    }
  ];
}

