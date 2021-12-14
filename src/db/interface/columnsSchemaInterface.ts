import { model, Schema, Model, Document , ObjectId } from "mongoose";
export interface columnsSchemaInterface extends Document {
  jobowner: ObjectId;
  idTask: string;
  column: [
    {
      id_column: 0;
      tasks: [Schema.Types.ObjectId[]];
    },
    {
      id_column: 1;
      tasks: [Schema.Types.ObjectId[]];
    },
    {
      id_column: 2;
      tasks: [Schema.Types.ObjectId[]];
    },
    {
      id_column: 3;
      tasks: [Schema.Types.ObjectId[]];
    }
  ];
}

