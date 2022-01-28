import Project_Schema from '../../../../db/schema/Project_Schema';
import jobTimeLineSchema from '../../../../db/schema/jobTimeLine';
import { Request, Response } from 'express';

export async function getLinePlot(req: Request, res: Response) {
  let body = req.body;
  let result: Array<any> = [];
  let project = await Project_Schema.findById({ _id: body.idProject })
    .lean()
    .exec();

  if (project && project.jobInProjectTimeLine)
    for (let i = 0; i < project.jobInProjectTimeLine.length; i++) {
      let findTimeLineJob = await jobTimeLineSchema
        .findById({ _id: project.jobInProjectTimeLine[i] })
        .lean()
        .exec();

      result.push(findTimeLineJob);
    }

  if (result) res.send(result);
}
