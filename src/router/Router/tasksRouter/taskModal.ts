import taskSchemaInterface from "../../../db/interface/taskSchemaInterface";
import { Request, Response } from "express";
import columns_Schema from "../../../db/schema/columns_Schema";
import User_Schema from "../../../db/schema/User_Schema";
import task_Schema from "../../../db/schema/task_Schema";
import { Job_Schema } from "../../../db/schema/jobs_Schema";
import detailTask_Schema from "../../../db/schema/detailTask_Schema";
import Attachment_Schema from "../../../db/schema/Attachments_Schema";
let PORT = process.env.PORTURL || "http://localhost:4000";

export async function listTaskKanban(req: Request, res: Response) {
  let request = req.body;
  let result: any[] = [];
  let memberInJob: any[] = [];
  let listColumn = await columns_Schema
    .find({ jobowner: request.jobowner })
    .lean()
    .exec();
  let findJob = await Job_Schema.find({ _id: request.jobowner }).lean().exec();
  let column = listColumn[0]?.column;
  if (findJob.length > 0) {
    for (const eachMemberInJob of findJob[0].members) {
      let eachMember = await User_Schema.find({ _id: eachMemberInJob })
        .lean()
        .exec();
      if (eachMember.length > 0) {
        memberInJob.push({
          display_name: eachMember[0].display_name,
          user_name: eachMember[0].user_name,
          avatar: eachMember[0].avatar,
        });
      }
    }
  }
  for (const element of column) {
    let eachColumnTask: any[] = [];
    if (element.tasks.length > 0) {
      for (const i of element.tasks) {
        let infoTask = await task_Schema.find({ _id: i }).lean().exec();
        let members: any[] = [];
        for (const j of infoTask[0].taskers) {
          let eachMember = await User_Schema.find({ _id: j }).find().exec();
          members.push({
            display_name: eachMember[0].display_name,
            user_name: eachMember[0].user_name,
            avatar: eachMember[0].avatar,
          });
        }
        eachColumnTask.push({
          id: infoTask[0]._id,
          title: infoTask[0].title,
          decription: infoTask[0].decription,
          is_complete: infoTask[0].is_complete,
          description: infoTask[0].description,
          isOverdue: infoTask[0].isOverdue,
          level: infoTask[0].level,
          process: infoTask[0].process,
          priority: infoTask[0].priority,
          start_time: infoTask[0].start_time,
          end_time: infoTask[0].end_time,
          taskers: members,
        });
      }
    }
    result.push({ id_column: element.id_column, eachColumnTask });
  }
  res.send({
    jobInfo: {
      title: findJob[0].title,
      start_time: findJob[0].start_time,
      end_time: findJob[0].end_time,
    },
    ListTask: result,
    memberInJob,
  });
}

export async function createTask(req: Request, res: Response) {
  let request = req.body;
  let infoNewTask = {
    title: request.title,
    process: request.process,
    is_complete: false,
    priority: request.priority,
    description: request.description,
    start_time: request.start_time,
    decription: request.decription,
    end_time: request.end_time,
    taskers: [] as any,
  };
  let listTaskers = request.taskers;
  for (var i = 0; i < listTaskers.length; i++) {
    let eachTasker = await User_Schema.find({ user_name: listTaskers[i].name })
      .lean()
      .exec();
    infoNewTask.taskers.push(eachTasker[0]._id);
  }
  new task_Schema(infoNewTask).save(async (err, modal) => {
    if (err) {
      res.send({ isSuccess: false });
    } else {
      await columns_Schema.updateOne(
        {
          jobowner: request.jobowner,
          "column.id_column": 0,
        },
        { $push: { "column.$.tasks": modal._id } }
      );

      res.send({ isSuccess: true });
    }
  });
}

export async function deleteTask(req: Request, res: Response) {
  let request = req.body;
  await columns_Schema
    .updateOne(
      {
        jobowner: request.jobowner,
        "column.id_column": 0,
      },
      { $pull: { "column.$.tasks": request.taskId } }
    )
    .exec(async (error) => {
      if (!error) {
        await task_Schema.deleteOne({ _id: request.taskId }, (ok) => {
          res.send({ isSuccess: true });
        });
      }
    });
}

export const createDetailTask = (req: Request, res: Response) => {
  let request = req.body;
  let newDetailTaskInfo = {
    title: request.title,
    is_complete: false,
    idProjectOwner: request.idProjectOwner,
  };
  let newDetailTask = new detailTask_Schema(newDetailTaskInfo);
  newDetailTask.save(async (error) => {
    if (!error) {
      await task_Schema.updateOne(
        { _id: request.taskOwner },
        { $push: { detailTask: newDetailTask._id } }
      );
      res.send({ isSuccess: true });
    } else {
      res.send({ isSuccess: false });
    }
  });
};

export const editTask = async (req: Request, res: Response) => {
  let request = req.body;
  let taskEdit = await task_Schema.find({ _id: request.taskId }).lean().exec();
  let memberInRequest: any[] = [];
  for (const members of request.taskers) {
    let eachMemember = await User_Schema.find({ user_name: members.user_name })
      .lean()
      .exec();
    memberInRequest.push(eachMemember[0]._id);
  }
  let newTaskEdit = {
    title: request.title || taskEdit[0].title,
    is_complete: request.is_complete || taskEdit[0].is_complete,
    process: request.process || taskEdit[0].process,
    priority: request.priority || taskEdit[0].priority,
    start_time: request.start_time || taskEdit[0].start_time,
    description: request.description || taskEdit[0].description,
    isOverdue: request.isOverdue || taskEdit[0].isOverdue,
    end_time: request.end_time || taskEdit[0].end_time,
    taskers: memberInRequest,
  };
  await task_Schema
    .updateOne(
      { _id: request.taskId },
      {
        $set: {
          title: newTaskEdit.title,
          is_complete: newTaskEdit.is_complete,
          process: newTaskEdit.process,
          priority: newTaskEdit.priority,
          start_time: newTaskEdit.start_time,
          description: newTaskEdit.description,
          isOverdue: newTaskEdit.isOverdue,
          end_time: newTaskEdit.end_time,
          taskers: newTaskEdit.taskers,
        },
      }
    )
    .exec((error) => {
      if (error) {
        res.send({ isSuccess: false });
      } else {
        res.send({ isSuccess: true });
      }
    });
};

export const listDetailTask = async (req: Request, res: Response) => {
  let request = req.body;
  let taskFound = await task_Schema
    .find({ _id: request.taskOwner })
    .find()
    .exec();
  if (taskFound.length > 0) {
    let infoTask = {
      is_complete: taskFound[0].is_complete,
      process: taskFound[0].process,
      priority: taskFound[0].priority,
      start_time: taskFound[0].start_time,
      end_time: taskFound[0].start_time,
      description: taskFound[0].description || "",
    };
    let detailTask = taskFound[0].detailTask;
    let infoAllDetailTask: any[] = [];
    let memberInTask: any[] = [];
    for (const eachDetailTask of detailTask) {
      let detailTask = await detailTask_Schema
        .find({ _id: eachDetailTask })
        .find()
        .exec();
      let attachmentsOfDetailTask: any[] = [];
      for (const eachMemberInTask of taskFound[0].taskers) {
        let eachMember = await User_Schema.find({ _id: eachMemberInTask })
          .lean()
          .exec();
        if (eachMember.length > 0) {
          memberInTask.push({
            display_name: eachMember[0].display_name,
            user_name: eachMember[0].user_name,
            avatar: eachMember[0].avatar,
          });
        }
      }
      for (const eachAttachment of detailTask[0].attachments) {
        let each = await Attachment_Schema.find({ _id: eachAttachment })
          .lean()
          .exec();
        if (each) {
          attachmentsOfDetailTask.push({
            idAtachment: each[0]._id,
            name: each[0].name,
            nameType: each[0].nameType,
            uploaded_at: each[0].uploaded_at,
          });
        }
      }
      infoAllDetailTask.push({
        id: detailTask[0]._id,
        name: detailTask[0].title,
        is_complete: detailTask[0].is_complete,
        assignOn: detailTask[0].assignOn,
        attachmentsOfDetailTask: attachmentsOfDetailTask,
      });
    }
    res.send({ isSuccess: true, infoTask, infoAllDetailTask, memberInTask });
  } else {
    res.send({ isSuccess: false });
  }
};

export const editDetailTask = async (req: Request, res: Response) => {
  let request = req.body;
  let detailTask = await detailTask_Schema
    .find({ _id: request.idDetailTask })
    .lean()
    .exec();
  if (detailTask.length > 0) {
    await detailTask_Schema.updateOne(
      { _id: request.idDetailTask },
      { $set: { title: request.name } }
    );
    res.send({ isSuccess: true });
  } else {
    res.send({ isSuccess: false });
  }
};

export const completeAndUncompleteDetailTask = async (req: Request, res: Response) => {
  let request = req.body;
  let detailTask = await detailTask_Schema
    .find({ _id: request.idDetailTask })
    .lean()
    .exec();
  if (detailTask.length > 0) {
    await detailTask_Schema.updateOne(
      { _id: request.idDetailTask },
      { $set: { is_complete: !detailTask[0].is_complete } }
    );
    res.send({ isSuccess: true });
  } else {
    res.send({ isSuccess: false });
  }
};

export const deleteDetailTask = async (req: Request, res: Response) => {
  let request = req.body;
  let detailTask = await detailTask_Schema
    .find({ _id: request.idDetailTask })
    .lean()
    .exec();
  if (detailTask.length > 0) {
    await task_Schema
      .updateOne(
        { _id: request.idTask },
        { $pull: { detailTask: request.idDetailTask } }
      )
      .exec(async (err: any) => {
        if (!err) {
          await detailTask_Schema.deleteOne({ _id: request.idDetailTask });
          res.send({ isSuccess: true });
        }
      });
  } else {
    res.send({ isSuccess: false });
  }
};

export const uploadFileInDetailTask = async (req: Request, res: Response) => {
  let request = req.body;
  if (req.file === undefined) return res.send("you must select a file.");
  const zipFileDownloadURL = `${PORT}/zipFile/dowloadZipFile/${req.file.filename}`;
  let newAttachment = new Attachment_Schema({
    name: req.file.filename,
    URL: zipFileDownloadURL,
    nameType: "zip",
  });
  newAttachment.save(async (error: any) => {
    if (error) {
      res.send({ isSuccess: false });
    } else {
      await detailTask_Schema.updateOne(
        { _id: request.idDetailTask },
        { $push: { attachments: newAttachment._id } }
      );
      res.send({ isSuccess: true });
    }
  });
};
