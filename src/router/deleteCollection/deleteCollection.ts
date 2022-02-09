import project_Schema from "../../db/schema/Project_Schema";
import Attachment_Schema from "../../db/schema/Attachments_Schema";
import timeLineTask_Schema from "../../db/schema/timeLineTask_Schema";
import detailTask_Schema from "../../db/schema/detailTask_Schema";
import jobTimeLine_Schema from "../../db/schema/jobTimeLine";
import task_Schema from "../../db/schema/task_Schema";
import { Request, Response } from "express";

import columns_Schema from "../../db/schema/columns_Schema";
import mongoose, { Schema, ObjectId } from "mongoose";
const Grid = require("gridfs-stream");
import { connection } from "../../db/configmongoose";
import { Job_Schema } from "../../db/schema/jobs_Schema";
import User_Schema from "../../db/schema/User_Schema";
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
              await task_Schema.updateOne(
                { _id: idTask },
                {
                  $pull: { detailTask: idDetailTask },
                }
              );
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

export const deleteTaskWithId = async (idTask: Schema.Types.ObjectId) => {
  let taskInfo = await task_Schema.find({ _id: idTask }).lean().exec();
  for (const detailTask of taskInfo[0].detailTask) {
    deleteDetailTaskWithId(detailTask, idTask);
  }
  await await task_Schema.deleteOne({ _id: idTask });
  return true;
};

export const deleteJobWithId = async (idJob: ObjectId) => {
  let columnInfo = await columns_Schema.find({ jobowner: idJob }).lean().exec();

  let allColumns = columnInfo[0].column;
  for (const eachColumn of allColumns) {
    if (eachColumn.tasks.length > 0) {
      for (const eachTask of eachColumn.tasks) {
        deleteTaskWithId(eachTask);
      }
    }
  }
  await columns_Schema.deleteOne({ jobowner: idJob });
  await Job_Schema.deleteOne({ _id: idJob });
  return true;
};

export const deletProjectWithId = async (idProject: ObjectId) => {
  let findAllJobInProject = await Job_Schema.find({ projectowner: idProject });
  // console.log(findAllJobInProject);
  if (findAllJobInProject.length > 0) {
    for (const eachJob of findAllJobInProject) {
      // console.log(eachJob)
      deleteJobWithId(eachJob._id);
    }
  }
  let projectInfo = await project_Schema.find({ _id: idProject }).lean().exec();
  if (projectInfo.length > 0) {
    for (const eachTimeLineOfProject of projectInfo[0].projectTimeLine) {
      await timeLineTask_Schema.deleteOne({ _id: eachTimeLineOfProject });
    }
    for (const eachTimeLineJobOfProject of projectInfo[0]
      .jobInProjectTimeLine) {
      await jobTimeLine_Schema.deleteOne({ _id: eachTimeLineJobOfProject });
    }
  }
  let userOwnerProject = await User_Schema.find({
    InfoAllProjectJoin: { $in: [idProject] },
  })
    .lean()
    .exec();
  await User_Schema.updateOne(
    { _id: userOwnerProject[0]._id },
    { $pull: { InfoAllProjectJoin: idProject } }
  );
  await project_Schema.deleteOne({ _id: idProject });
  return true;
};
