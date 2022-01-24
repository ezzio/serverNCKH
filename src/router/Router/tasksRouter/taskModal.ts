import taskSchemaInterface from "../../../db/interface/taskSchemaInterface";
import { Request, Response } from "express";
import columns_Schema from "../../../db/schema/columns_Schema";
import User_Schema from "../../../db/schema/User_Schema";
import task_Schema from "../../../db/schema/task_Schema";
import { Job_Schema } from "../../../db/schema/jobs_Schema";
import detailTask_Schema from "../../../db/schema/detailTask_Schema";
import project_Schema from "../../../db/schema/Project_Schema";
import Attachment_Schema from "../../../db/schema/Attachments_Schema";
import timeLineTask_Schema from "../../../db/schema/timeLineTask_Schema";
import conversationInTask_Schema from "../../../db/schema/conversationInTask";
let PORT = process.env.PORTURL || "http://localhost:4000";

export async function listTaskKanban(req: Request, res: Response) {
  let request = req.body;
  let result: any[] = [];
  let memberInJob: any[] = [];

  let listColumn = await columns_Schema
    .find({ jobowner: request.jobowner })
    .lean()
    .exec();
  // tim kiem job
  let findJob = await Job_Schema.find({ _id: request.jobowner }).lean().exec();

  // tim kiem nhung task da is compltet
  // let findTaskIsComplete = await task_Schema
  //   .find({
  //     idJobOwner: request.jobOwner,
  //     is_complete: true,
  //   })
  //   .lean()
  //   .exec();

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
          progress: infoTask[0].progress,
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
    progress: request.progress,
    is_complete: false,
    priority: request.priority,
    description: request.description,
    start_time: request.start_time,
    idJobOwner: request.idBoard,
    decription: request.decription,
    end_time: request.end_time,
    isOverdue: false,
    taskers: [] as any,
  };
  let listTaskers = request.taskers;
  let infoTaskers: any = [];
  for (var i = 0; i < listTaskers.length; i++) {
    let eachTasker = await User_Schema.find({ user_name: listTaskers[i].name })
      .lean()
      .exec();
    infoNewTask.taskers.push(eachTasker[0]._id);
    infoTaskers.push({
      user_name: eachTasker[0].user_name,
      avatar: eachTasker[0].avatar,
    });
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
      let findJob = await Job_Schema.find({ _id: request.jobowner })
        .lean()
        .exec();
      let createANewTimeLine = {
        whoTrigger: request.owner,
        action: "create",
        taskEdit: {
          idTask: modal._id,
          taskTitle: modal.title,
        },
      };
      new timeLineTask_Schema(createANewTimeLine).save(async (err, modal) => {
        await project_Schema.updateOne(
          { _id: findJob[0].projectowner },
          { $push: { projectTimeLine: modal._id } }
        );
      });
      new conversationInTask_Schema({ idTask: modal._id }).save();
      res.send({
        isSuccess: true,
        infoTask: {
          idTask: modal._id,
          title: modal.title,
          progress: infoNewTask.progress,
          is_complete: infoNewTask.is_complete,
          priority: infoNewTask.priority,
          description: infoNewTask.description,
          start_time: infoNewTask.start_time,
          decription: infoNewTask.decription,
          end_time: infoNewTask.end_time,
          isOverdue: infoNewTask.isOverdue,
          infoTaskers,
        },
      });
    }
  });
}

export const updateTaskOverdue = (req: Request, res: Response) => {
  let request = req.body;
  if (request.ListTaskOverdue) {
    request.ListTaskOverdue.map(async (task: any) => {
      await task_Schema.updateOne(
        { _id: task },
        { $set: { isOverdue: false } }
      );
      res.send({ isSuccess: true });
    });
  } else {
    res.send({ isSuccess: false });
  }
};

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
        await task_Schema
          .find({ _id: request.taskId })
          .lean()
          .exec(async (err, modal) => {
            let findJob = await Job_Schema.find({ _id: request.jobowner })
              .lean()
              .exec();
            let createANewTimeLine = {
              whoTrigger: request.owner,
              action: "Delete",
              taskEdit: {
                idTask: modal[0]._id,
                taskTitle: modal[0].title,
              },
            };
            new timeLineTask_Schema(createANewTimeLine).save(
              async (err, modal) => {
                await project_Schema.updateOne(
                  { _id: findJob[0].projectowner },
                  { $push: { projectTimeLine: modal._id } }
                );
              }
            );
          });
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
      res.send({ isSuccess: true, idDetailTask: newDetailTask._id });
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
  // console.log(taskEdit);
  let newTaskEdit = {
    title: request.title || taskEdit[0].title,
    is_complete: request.is_complete || taskEdit[0].is_complete,
    progress: request.progress || taskEdit[0].progress,
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
          progress: newTaskEdit.progress,
          priority: newTaskEdit.priority,
          start_time: newTaskEdit.start_time,
          description: newTaskEdit.description,
          isOverdue: newTaskEdit.isOverdue,
          end_time: newTaskEdit.end_time,
          taskers: newTaskEdit.taskers,
        },
      }
    )
    .exec(async (error) => {
      if (error) {
        res.send({ isSuccess: false });
      } else {
        await task_Schema
          .find({ _id: request.taskId })
          .lean()
          .exec(async (err, modal) => {
            let findJob = await Job_Schema.find({ _id: request.jobowner })
              .lean()
              .exec();
            let createANewTimeLine = {
              whoTrigger: request.owner,
              action: "Update",
              taskEdit: {
                idTask: modal[0]._id,
                taskTitle: modal[0].title,
              },
            };
            new timeLineTask_Schema(createANewTimeLine).save(
              async (err, modal) => {
                await project_Schema.updateOne(
                  { _id: findJob[0].projectowner },
                  { $push: { projectTimeLine: modal._id } }
                );
              }
            );
          });
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
      title: taskFound[0].title,
      is_complete: taskFound[0].is_complete,
      progress: taskFound[0].progress,
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

    res.send({
      isSuccess: true,
      infoTask,
      infoAllDetailTask,
      memberInTask,
      // textChatInTask: resultConversation,
    });
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

export const completeAndUncompleteDetailTask = async (
  req: Request,
  res: Response
) => {
  let request = req.body;
  let TaskInfo = await task_Schema.find({ _id: request.idTask }).lean().exec();
  let userChange = await User_Schema.find({ _id: request.completed_by })
    .lean()
    .exec();
  let detailTaskComplete = request.idDetailTask;
  let listAllDetailTask = TaskInfo[0].detailTask;
  for (const eachDetailTask of listAllDetailTask) {
    if (
      JSON.stringify(detailTaskComplete).indexOf(
        JSON.stringify(eachDetailTask)
      ) != -1
    ) {
      await detailTask_Schema.updateOne(
        { _id: eachDetailTask },
        {
          $set: {
            is_complete: true,
            completed_at: Date.now(),
            completed_by: userChange[0]._id,
          },
        }
      );
      await task_Schema.updateOne(
        { _id: request.idTask },
        { progress: request.progress }
      );
    } else {
      await detailTask_Schema.updateOne(
        { _id: eachDetailTask },
        {
          $set: {
            is_complete: false,
            completed_at: Date.now(),
            completed_by: userChange[0]._id,
          },
        }
      );
      await task_Schema.updateOne(
        { _id: request.idTask },
        { progress: request.progress }
      );
    }
  }

  res.send({ isSuccess: true });
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
  console.log(req.file);
  if (req.file === undefined) return res.send("you must select a file.");
  const zipFileDownloadURL = `${PORT}/zipFile/dowloadZipFile/${req.file.filename}`;
  let newAttachment = new Attachment_Schema({
    name: req.file.filename,
    URL: zipFileDownloadURL,
    nameType: req.file.mimetype,
  });
  newAttachment.save(async (error: any) => {
    if (error) {
      res.send({ isSuccess: false });
    } else {
      await detailTask_Schema.updateOne(
        { _id: request.idDetailTask },
        { $push: { attachments: newAttachment._id } }
      );
      res.send({
        isSuccess: true,
        idDetailTask: request.idDetailTask,
        newAttachment: {
          id: newAttachment._id,
          name: newAttachment.name,
          nameType: newAttachment.nameType,
          uploaded_at: newAttachment.uploaded_at,
        },
      });
    }
  });
};

export const changeTaskInColumn = async (req: Request, res: Response) => {
  let request = req.body;
  let findJob = await columns_Schema
    .find({ jobowner: request.idBoard })
    .lean()
    .exec();
  let columns = request.columns;
  if (findJob.length > 0) {
    for (const eachColumn of columns) {
      let eachColumnTask = eachColumn.eachColumnTask.map(
        (idTasktemp: any) => idTasktemp.id
      );
      await columns_Schema.updateOne(
        {
          jobowner: request.idBoard,
          "column.id_column": eachColumn.id_column,
        },
        { $set: { "column.$.tasks": eachColumnTask } }
      );
    }
    res.send({ isSuccess: true });
  } else {
    res.send({ isSuccess: false });
  }
};

export const checkIsCompleteTask = async (req: Request, res: Response) => {
  let request = req.body;
  let findTask = await task_Schema.find({ _id: request.idTask }).lean().exec();
  if (findTask.length > 0) {
    await task_Schema
      .updateOne(
        { _id: request.idTask },
        { $set: { is_complete: request.is_complete } }
      )
      .exec(async (error) => {
        if (!error) {
          if (request.is_complete) {
            await columns_Schema.updateOne(
              {
                jobowner: request.idBoard,
                "column.id_column": 2,
              },
              { $pull: { "column.$.tasks": request.idTask } }
            );
            await columns_Schema.updateOne(
              {
                jobowner: request.idBoard,
                "column.id_column": 3,
              },
              { $push: { "column.$.tasks": request.idTask } }
            );
            res.send({ isSuccess: true });
          } else {
            await columns_Schema.updateOne(
              {
                jobowner: request.idBoard,
                "column.id_column": 3,
              },
              { $pull: { "column.$.tasks": request.idTask } }
            );
            await columns_Schema.updateOne(
              {
                jobowner: request.idBoard,
                "column.id_column": 2,
              },
              { $push: { "column.$.tasks": request.idTask } }
            );

            let allTaskInfoIsComplete = await task_Schema
              .find({ idJobOwner: request.idBoard, is_complete: true })
              .lean()
              .exec();
            let allTaskInfo = await task_Schema
              .find({ idJobOwner: request.idBoard })
              .lean()
              .exec();
            console.log(
              (allTaskInfoIsComplete.length / allTaskInfo.length) * 100
            );
            Job_Schema.updateOne(
              { _id: request.idBoard },
              {
                $set: {
                  progress:
                    (allTaskInfoIsComplete.length / allTaskInfo.length) * 100,
                },
              }
            );

            res.send({ isSuccess: true });
          }
        } else {
          res.send({ isSuccess: false });
        }
      });
  }
};

export const listMessageInDetailTask = async (req: Request, res: Response) => {
  let request = req.body;
  let conversationInTask = await conversationInTask_Schema
    .find({
      idTask: request.taskOwner,
    })
    .lean()
    .exec();
  let resultConversation = conversationInTask[0].textChat.map(
    (eachTextChat: any) => ({
      displayName: eachTextChat.displayName,
      line_text: eachTextChat.line_text,
      user_name: eachTextChat.user_name,
      avatar: eachTextChat.avatar,
      type: eachTextChat.text,
      sendAt: eachTextChat.sendAt,
    })
  );
  res.send({ isSuccess: true, resultConversation });
};
