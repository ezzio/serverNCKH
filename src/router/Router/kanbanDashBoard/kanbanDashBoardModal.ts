import { Job_Schema } from "../../../db/schema/jobs_Schema";
import Project_Schema from "../../../db/schema/Project_Schema";
import columns_Schema from "../../../db/schema/columns_Schema";
import task_Schema from "../../../db/schema/task_Schema";
import { Request, Response } from "express";

export const taskChartInProject = async (req: Request, res: Response) => {
  let request = req.body;
  let allJobInProject = await Job_Schema.find({
    projectowner: request.idProject,
  })
    .lean()
    .exec();
  let allTasksId: any[] = [];
  if (allJobInProject.length > 0) {
    let incompleteTask = 0;
    let completeTask = 0;
    let taskOverdue = 0;
    let incompleteJob = 0;
    let completeJob = 0;

    for (const eachJob of allJobInProject) {
      let column = await columns_Schema
        .find({ jobowner: eachJob._id })
        .lean()
        .exec();
      for (const eachColumn of column[0].column) {
        eachColumn.tasks.map(async (eachTask) => {
          await task_Schema
            .find({ _id: eachTask })
            .lean()
            .exec((error, modal) => {
                
            });
        });
      }
    }
  }
};
