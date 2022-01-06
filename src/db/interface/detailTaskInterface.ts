import { Document, Schema, ObjectId } from "mongoose";
export interface detaiTaskInterface extends Document {
    title: string;
    is_complete: boolean;
    assignOn: Date;
}