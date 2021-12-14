import { Request, Response } from "express";
import columns_Schema from "../../../db/schema/columns_Schema";
import User_Schema from "../../../db/schema/User_Schema";
import task_Schema from "../../../db/schema/task_Schema";

export async function listTaskKanban(req: Request, res: Response) {
  let request = req.body;
  let ListColumn = await columns_Schema
    .find({ jobowner: request.jobowner })
    .lean()
    .exec();
  res.send(ListColumn);
}

export async function createTask(req: Request, res: Response) {
  let request = req.body;
  let Id_kanban = req.body;
  let infoNewTask = {
    title: request.title,
    progress: request.progress,
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
    infoNewTask.taskers.push({
      id: eachTasker[0]._id,
    });
  }
  new task_Schema(infoNewTask).save(async (err, modal) => {
    if (err) {
      res.send("loi ");
    } else {
      let findColumn = await columns_Schema
        .updateOne(
          {
            jobowner: request.jobowner,
            "column.id_column": 0,
          },
          { $push: { "column.$.tasks": modal._id } }
        )
        .lean()
        .exec();
      if (findColumn) res.send(findColumn);
    }
  });
}
