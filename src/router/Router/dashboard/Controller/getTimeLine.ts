import ProjectSchema from '../../../../db/schema/Project_Schema';
import timeLineTaskSchema from '../../../../db/schema/timeLineTask_Schema';
import User from '../../../../db/schema/User_Schema';
import task from '../../../../db/schema/task_Schema';

import { Request, Response } from 'express';

export async function getTimeLine(req: Request, res: Response) {
  let body = req.body;
  let result: Array<any> = [];
  let timeLineBody: Array<any> = [];
  let project = await ProjectSchema.findById({ _id: body.idProject })
    .lean()
    .exec();
  let idTimeLine = project?.projectTimeLine.map((id) => id);
  if (idTimeLine) {
    for (let index = 0; index < idTimeLine.length; index++) {
      let temp = await timeLineTaskSchema
        .findById({ _id: idTimeLine[index] })
        .lean()
        .exec();
      timeLineBody.push(temp);
    }
  }
  if (timeLineBody) {
    for (let index = 0; index < timeLineBody.length; index++) {
      if (timeLineBody[index]) {
        let whoTrigger = await User.findById({
          _id: timeLineBody[index].whoTrigger,
        })
          .lean()
          .exec();

        if (whoTrigger) {
          let infoTask = await task
            .findById({
              _id: timeLineBody[index].taskEdit.idTask,
            })
            .lean()
            .exec();
          let temp = {
            username: whoTrigger.user_name,
            display_name: whoTrigger?.display_name,
            avatar: whoTrigger?.avatar,
            action: timeLineBody[index].action,
            idTask: timeLineBody[index].taskEdit.idTask,
            job: infoTask,
            taskTitle: timeLineBody[index].taskEdit.taskTitle,
            createAt: timeLineBody[index].createAt,
          };
          console.log(temp);
          result.push(temp);
        }
      }
    }
  }
  res.send(result);
}
