import { Request, Response } from "express";
import { Job_Schema } from "../../../db/schema/jobs_Schema";
import columns_Schema from "../../../db/schema/columns_Schema";
import moment from "moment";
import project_Schema from "../../../db/schema/Project_Schema";
import User_Schema from "../../../db/schema/User_Schema";

export async function createAJob(req: Request, res: Response) {
  let request = req.body;
  let allInfoUser: any[] = [];
  let memberInJob: any[] = [];
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
      for (const eachMember of request.members) {
        let userFound = await User_Schema.find({ user_name: eachMember })
          .lean()
          .exec();
        if (userFound.length > 0) {
          allInfoUser.push(userFound[0]._id);
          memberInJob.push({
            user_name: userFound[0].user_name,
            avatar: userFound[0].avatar,
          });
        }
      }
    }
    new columns_Schema({ jobowner: Job._id }).save();
    await Job.save(async (err: any) => {
      if (err) {
        console.log(err);
      } else {
        await Job_Schema.updateOne(
          { _id: Job._id },
          { $push: { members: { $each: allInfoUser } } }
        );
        res.send({
          isSuccess: true,
          infoJob: {
            idJob: Job.idJob,
            priority: Job.priority,
            is_completed: Job.is_completed,
            start_time: Job.start_time,
            end_time: Job.end_time, 
            process: Job.process,
            memberInJob
          },
        });
      }
    });
  } catch (err) {
    res.send({ isSuccess: false });
  }
}

export async function ListJobs(req: Request, res: Response) {
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
            infoMembers.push({
              user_name: eachmember[0].user_name,
              avatar: eachmember[0].avatar,
            });
          });
          ListJobsofUser.push({
            _id: eachJob._id,
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
            _id: eachJob._id,
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
            _id: listMemberInProject[0].members[i].idMember,
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
  let infoJob = await Job_Schema.find({ _id: request.kanban_id }).lean().exec();
  if (infoJob.length > 0) {
    let memberRequestChange = [];
    if (request.members.length > 0) {
      for (const member of request.members) {
        let eachMember = await User_Schema.find({ user_name: member })
          .lean()
          .exec();
        if (eachMember.length > 0) {
          memberRequestChange.push(eachMember[0]._id);
        }
      }
    }
    let edit_Job = {
      title: request.title || infoJob[0].projectowner,
      start_time: request.start_time || infoJob[0].start_time,
      end_time: request.end_time || infoJob[0].end_time,
      priority: request.priority || infoJob[0].priority,
      is_completed: request.is_completed || infoJob[0].is_completed,
      members: infoJob[0].members,
    };
    await Job_Schema.updateOne(
      { _id: request.kanban_id },
      {
        $set: {
          title: edit_Job.title,
          start_time: edit_Job.start_time,
          end_time: edit_Job.end_time,
          priority: edit_Job.priority,
          is_completed: edit_Job.is_completed,

          members: edit_Job.members,
        },
      }
    ).exec((err: any) => {
      if (err) {
        res.send({ error: err });
      } else {
        res.send({ isSuccess: true });
      }
    });
  } else {
    res.send({ isSuccess: false });
  }
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
