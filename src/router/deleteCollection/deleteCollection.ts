import { ObjectId } from "mongodb";
import project_Schema from "../../db/schema/Project_Schema";
import Attachment_Schema from "../../db/schema/Attachments_Schema";
import timeLineTask_Schema from "../../db/schema/timeLineTask_Schema";
import detailTask_Schema from "../../db/schema/detailTask_Schema";
import jobTimeLine_Schema from "../../db/schema/jobTimeLine";
import task_Schema from "../../db/schema/task_Schema";
import { Request, Response } from "express";
import mongoose from "mongoose";
const Grid = require("gridfs-stream");
import { connection } from "../../db/configmongoose";
let gfs: any;

const conn = mongoose.connection;
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

export const deleteDetailTaskWithId = async (
  idDetailTask: ObjectId,
  idTask: ObjectId
) => {
  let findDetailTask = await detailTask_Schema
    .find({ _id: idDetailTask })
    .lean()
    .exec();
  // await detailTask_Schema.deleteOne({ _id: idDetailTask }).lean();
  for (let attachment of findDetailTask[0].attachments) {
    let attachmentInfo = await Attachment_Schema.find({
      _id: attachment,
    }).lean();
    if (attachmentInfo.length > 0) {
      try {
        let detailTask = await detailTask_Schema
          .find({
            $and: [
              { idProjectOwner: findDetailTask[0].idProjectOwner },
              { attachments: { $in: attachmentInfo[0]._id } },
            ],
          })
          .lean()
          .exec();
        await detailTask_Schema
          .updateOne(
            { _id: detailTask[0]._id },
            { $pull: { attachments: attachmentInfo[0]._id } }
          )
          .exec(async (error) => {
            if (!error) {
              await Attachment_Schema.deleteOne({ _id: attachmentInfo[0]._id });

              let gfsFileId = await gfs.files.findOne({
                filename: attachmentInfo[0].name,
              });
              await conn.db
                .collection("fs.chunks")
                .deleteMany({ files_id: gfsFileId._id });
              await gfs.files.deleteOne({ filename: attachmentInfo[0].name });
     

              
            } else {
      
            }
          });
      } catch (ex) {
        console.log(ex);
      }
    }
  }
  await detailTask_Schema.deleteOne({ _id: idDetailTask });
  return true;
};

// export const deleteTask = async (taskId: ObjectId)=> {
//     let findDetailTask = await task_Schema.find({ _id: taskId}).lean().exec();
//     if(findDetailTask.length > 0){
//         for(let detailTask of findDetailTask[0].detailTask){
//             deleteDetailTask(detailTask)
//         }
//     }
//     // await task_Schema.deleteOne({ _id: taskId }).lean().exec();
// }
