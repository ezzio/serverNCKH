import { Job_Schema } from './../../../../db/schema/jobs_Schema';
import task from './../../../../db/schema/task_Schema';

import { Request, Response } from 'express';

export async function getAllTask(req: Request, res: Response) {
  let body = req.body;
  let result: Array<any> = [];
  let jobsInProject = await Job_Schema.find({ projectowner: body.idProject })
    .lean()
    .exec();
  let idJobs: Array<String> = jobsInProject.map((job) => job._id);
  for (let id of idJobs) {
    let temp = await task.find({ idJobOwner: id });
    result.push(...temp);
  }
  if (result) res.send(result);
}
