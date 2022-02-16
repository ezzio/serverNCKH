import User_Schema from "../../db/schema/User_Schema";
import {
  model,
  Schema,
  Model,
  Document,
  ObjectId,
  LeanDocument,
} from "mongoose";

export default async (listInMemberInRoom: LeanDocument<ObjectId>[]) => {
  let infOListMember: any[] = [];
  if (listInMemberInRoom.length > 0)
    for (const eachUser of listInMemberInRoom) {
      let infoUser = await User_Schema.find({ _id: eachUser }).lean().exec();
      infOListMember.push({
        id: infoUser[0]._id,
        display_name: infoUser[0].display_name,
        avatar: infoUser[0].avatar,
      });
    }
  return infOListMember;
};
