import { Job_Schema } from './../../../../db/schema/jobs_Schema';

import { Request, Response } from 'express';

export async function getAllJob(req: Request, res: Response) {
  let body = req.body;
  let result = await Job_Schema.find({ projectowner: body.idProject })
    .lean()
    .exec();
  if (result) res.send(result)
}