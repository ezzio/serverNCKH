import { Job_Schema } from "../../../db/schema/jobs_Schema";
import Project_Schema from "../../../db/schema/Project_Schema";
import columns_Schema from "../../../db/schema/columns_Schema";
import task_Schema from "../../../db/schema/task_Schema";
import timeLineTask_Schema from "../../../db/schema/timeLineTask_Schema";
import { Request, Response } from "express";

export const taskChartInProject = async (req: Request, res: Response) => {
  let request = req.body;
  let incompleteTask = 0;
  let completeTask = 0;
  let taskOverdue = 0;
  let incompleteJob = 0;
  let completeJob = 0;
  let timeLineTask: any[] = [];
  let allJobInProject = await Job_Schema.find({
    projectowner: request.idProject,
  }).lean();
  let infoProject = await Project_Schema.find({ _id: request.idProject })
    .lean()
    .exec();
  if (allJobInProject.length > 0 && infoProject.length > 0) {
    for (const eachJob of allJobInProject) {
      let column = await columns_Schema
        .find({ jobowner: eachJob._id })
        .lean()
        .exec();
      if (eachJob.is_completed) {
        completeJob++;
      } else {
        incompleteJob++;
      }
      for (const eachColumn of column[0].column) {
        for (const eachTask of eachColumn.tasks) {
          let task = await task_Schema.find({ _id: eachTask }).lean();
          if (task[0].is_complete && task[0].isOverdue != true) {
            completeTask++;
          } else if (task[0].isOverdue) {
            taskOverdue++;
          } else {
            incompleteTask++;
          }
        }
      }
    }
    for (const eachTimeLine of infoProject[0].projectTimeLine) {
      let timeLine = await timeLineTask_Schema
        .find({ _id: eachTimeLine })
        .lean()
        .exec();
      timeLineTask.push({ action: timeLine[0].action });
    }
  }
  res.send({
    incompleteTask,
    completeTask,
    taskOverdue,
    incompleteJob,
    completeJob,
  });
};
