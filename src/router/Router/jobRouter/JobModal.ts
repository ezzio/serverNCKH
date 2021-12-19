import { Request, Response } from "express";
import { Job_Schema } from "../../../db/schema/jobs_Schema";
import columns_Schema from "../../../db/schema/columns_Schema";
import moment from "moment";
import project_Schema from "../../../db/schema/Project_Schema";
import User_Schema from "../../../db/schema/User_Schema";

export async function createAJob(req: Request, res: Response) {
  let job_info = req.body;
  const dateFormat = "YYYY-MM-DD";
  try {
    let Job = new Job_Schema({
      projectowner: job_info.projectowner,
      title: job_info.title || "kanban project",
      priority: job_info.priority || "Low",
      is_completed: job_info.is_completed || false,
      start_time: moment(job_info.start_time).format(dateFormat) || Date.now(),
      end_time: moment(job_info.end_time).format(dateFormat) || Date.now() + 1,
      process: job_info.process || "0%",
    });
    new columns_Schema({ jobowner: Job._id }).save();
    await Job.save(function (err: any) {
      if (err) {
        console.log(err);
      } else {
        res.send({ isSuccess: true });
      }
    });
  } catch (err) {
    res.send({ isSuccess: false });
  }
}

export async function ListTasks(req: Request, res: Response) {
  let request = req.body;
  let memberInProject: any[] = [];
  if (request.projectowner) {
    let listJob = await Job_Schema.find({ projectowner: request.projectowner })
      .lean()
      .exec();
    let listMemberInProject = await project_Schema
      .find({
        _id: request.projectowner,
      })
      .lean()
      .exec();
    if (listMemberInProject.length > 0) {
      for (var i = 0; i < listMemberInProject[0].members.length; i++) {
        try {
          let eachMember = await User_Schema.find({
            _id: listMemberInProject[0].members[i],
          })
            .lean()
            .exec();
          memberInProject.push({
            id: eachMember[0]._id,
            name: eachMember[0].user_name,
            avatar: eachMember[0].avatar,
          });
        } catch (error: any) {}
      }
    }
    res.send({
      ListJob: listJob,
      memberInProject: memberInProject,
      isSuccess: true,
    });
  }
}

export async function editJob(req: Request, res: Response) {
  let request = req.body;

  let infoJob = await Job_Schema.findById({ _id: request.kanban_id })
    .lean()
    .exec();
  let edit_Job = {
    title: request.title || infoJob.projectowner,
    start_time: request.start_time || infoJob.start_time,
    end_time: request.end_time || infoJob.end_time,
    priority: request.priority || infoJob.priority,
  };
  await Job_Schema.updateOne(
    { _id: request.kanban_id },
    {
      $set: {
        title: edit_Job.title,
        start_time: edit_Job.start_time,
        end_time: edit_Job.end_time,
        priority: edit_Job.priority,
      },
    },
    { new: true },
    (err) => {
      if (err) {
        res.send({ error: err });
      } else {
        res.send({ success: true });
      }
    }
  );
}

export async function deleteJob(req: Request, res: Response) {
  let request = req.body;
  await columns_Schema.deleteOne(
    { jobowner: request.kanban_id },
    async (error: any) => {
      if (error) {
        res.send({ error: error });
      } else {
        await Job_Schema.deleteOne({ _id: request.kanban_id }, (error) => {
          if (error) {
            res.send({ error: error });
          } else {
            res.send({ success: "xoa thanh cong" });
          }
        });
      }
    }
  );
}
