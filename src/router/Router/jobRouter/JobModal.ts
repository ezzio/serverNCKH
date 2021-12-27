import { Request, Response } from "express";
import { Job_Schema } from "../../../db/schema/jobs_Schema";
import columns_Schema from "../../../db/schema/columns_Schema";
import moment from "moment";
import project_Schema from "../../../db/schema/Project_Schema";
import User_Schema from "../../../db/schema/User_Schema";
import { ObjectId } from "mongoose";

export async function createAJob(req: Request, res: Response) {
  let request = req.body;
  const dateFormat = "YYYY-MM-DD";
  try {
    let Job = new Job_Schema({
      projectowner: request.projectowner,
      title: request.title || "kanban project",
      priority: request.priority || "Low",
      is_completed: request.is_completed || false,
      start_time: moment(request.start_time).format(dateFormat) || Date.now(),
      end_time: moment(request.end_time).format(dateFormat) || Date.now() + 1,
      process: request.process || "0%",
      members: [],
    });
    if (request.members) {
      await request.members.map(async (member: string) => {
        let user_Id = await User_Schema.find({ user_name: member })
          .lean()
          .exec();
        await Job_Schema.updateOne(
          { _id: Job._id },
          { $push: { members: user_Id[0]._id } }
        );
      });
    }
    new columns_Schema({ jobowner: Job._id }).save();
    await Job.save(async (err: any) => {
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
  let ListJobsofUser: any[] = [];
  if (request.projectowner) {
    let listJob = await Job_Schema.find({ projectowner: request.projectowner })
      .lean()
      .exec();
    if (listJob.length > 0) {
      listJob.map((eachJob) => {
        let infoMembers: any[] = [];
        if (eachJob.members.length > 0) {
          eachJob.members.map(async (eachMember: any) => {
            let eachmember = await User_Schema.find({ _id: eachMember }).lean();
            infoMembers.push(eachmember);
          });
          ListJobsofUser.push({
            projectowner: eachJob.projectowner,
            title: eachJob.title,
            members: infoMembers,
            start_time: eachJob.start_time,
            end_time: eachJob.end_time,
            is_completed: eachJob.is_completed,
            process: eachJob.process,
            priority: eachJob.priority,
          });
        } else {
          ListJobsofUser.push({
            projectowner: eachJob.projectowner,
            title: eachJob.title,
            members: [],
            start_time: eachJob.start_time,
            end_time: eachJob.end_time,
            is_completed: eachJob.is_completed,
            process: eachJob.process,
            priority: eachJob.priority,
          });
        }
      });
    }
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
            name: eachMember[0].user_name,
            avatar: eachMember[0].avatar,
          });
        } catch (error: any) {}
      }
    }
    res.send({
      ListJob: ListJobsofUser,
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
            res.send({ isSuccess: true });
          }
        });
      }
    }
  );
}
