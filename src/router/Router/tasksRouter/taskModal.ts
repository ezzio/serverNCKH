import taskSchemaInterface from "../../../db/interface/taskSchemaInterface";
import { Request, Response } from "express";
import columns_Schema from "../../../db/schema/columns_Schema";
import User_Schema from "../../../db/schema/User_Schema";
import task_Schema from "../../../db/schema/task_Schema";

export async function listTaskKanban(req: Request, res: Response) {
  let request = req.body;
  let result: any[] = [];
  let listColumn = await columns_Schema
    .find({ jobowner: request.jobowner })
    .lean()
    .exec();
  let column = listColumn[0]?.column;
  for (const element of column) {
    let eachColumnTask: any[] = [];
    if (element.tasks.length > 0) {
      for (const i of element.tasks) {
        let infoTask = await task_Schema.find({ _id: i }).lean().exec();
        let members: any[] = [];
        for(const j of infoTask[0].taskers) {
          let eachMember = await User_Schema.find({_id : j }).find().exec()
          members.push({user_name: eachMember[0].user_name , avatar: eachMember[0].avatar})
        }
        eachColumnTask.push({
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
          taskers: members
        });
      }
    }
    result.push({ id_column: element.id_column, eachColumnTask });
  }
  res.send(result);
}

export async function createTask(req: Request, res: Response) {
  let request = req.body;
  let infoNewTask = {
    title: request.title,
    process: request.process,
    is_complete: false,
    priority: request.priority,
    level: request.level,
    start_time: request.start_time,
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
  console.log(infoNewTask);

  new task_Schema(infoNewTask).save(async (err, modal) => {
    if (err) {
      res.send({ isSuccess: false });
    } else {
      // await task_Schema.updateOne(
      //   { _id: modal._id },
      //   { $push: { taskers: { $each: [infoNewTask.taskers] } } }
      // );

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
  await columns_Schema.updateOne(
    {
      jobowner: request.jobowner,
      "column.id_column": 0,
    },
    { $pull: { "column.$.tasks": request.taskId } }
  );
  await task_Schema.deleteOne({ _id: request.taskId }, (ok) => {
    res.send({ isSuccess: true });
  });
}
