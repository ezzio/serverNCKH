import { model, Schema, Model } from 'mongoose';
import userSchemaInterface from '../interface/userSchemaInterface';
const User = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    display_name: { type: String },
    bio: { type: String },
    phone: { type: String },
    company: { type: String },
    address: { type: String },
    createAt: { type: Date, default: Date.now },
    InfoAllProjectJoin: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  },
  { collection: 'User' }
);

// const DonHang = ;
export default model<userSchemaInterface>('user_Schema', User);
