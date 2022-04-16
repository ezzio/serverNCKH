import { Request, Response, NextFunction } from "express";
import user_Schema from "../../../db/schema/User_Schema";
import project_Schema from "../../../db/schema/Project_Schema";
import task_Schema from "../../../db/schema/task_Schema";
import { Job_Schema } from "../../../db/schema/jobs_Schema";
let PORT = process.env.PORTURL || "http://localhost:4000";

export async function getUserInfo(req: Request, res: Response) {
  let request = req.body;
  let result = [];
  let allProject = [];
  let allTask = [];
  let userInfo = await user_Schema.find({ _id: request.owner }).find().exec();
  if (userInfo.length > 0) {
    result.push({
      userInfo: {
        user_name: userInfo[0].user_name,
        display_name: userInfo[0].display_name || "",
        avatar: userInfo[0].avatar,
        bio: userInfo[0].bio || "",
        company: userInfo[0].company || "",
        email: userInfo[0].email || "",
        address: userInfo[0].address || "",
      },
    });
  }
  /// find project of User
  let projectUserJoin = await project_Schema
    .find({
      "members.idMember": { $in: request.owner },
    })
    .lean()
    .exec();
  // project user join
  for (let eachIdProject of projectUserJoin) {
    let project = await project_Schema
      .find({ _id: eachIdProject })
      .lean()
      .exec();
    let memberInRoom = [];
    for (let eachMember of project[0].members) {
      let member = await user_Schema
        .find({ _id: eachMember.idMember })
        .find()
        .exec();
      if (member) {
        memberInRoom.push({
          username: member[0].user_name,
          avatar: member[0].avatar,
        });
      }
    }
    // all job in project
    let allJobInProject = await Job_Schema.find({ projectowner: eachIdProject })
      .lean()
      .exec();
    let allTaskComplete: any[] = [];
    let allTaskInJob: any[] = [];
    for (const eachJob of allJobInProject) {
      let TaskComplete = await task_Schema
        .find({ $and: [{ idJobOwner: eachJob._id }, { is_complete: true }] })
        .lean()
        .exec();
      allTaskComplete.push(...TaskComplete);
      let TaskInJob = await task_Schema
        .find({ idJobOwner: eachJob._id })
        .lean()
        .exec();
      allTaskInJob.push(...TaskInJob);
    }
    allProject.push({
      idProject: project[0]._id,
      title: project[0].name,
      members: memberInRoom,
      progress: project[0].progress || 0,
      totalTaskInProject: allTaskInJob.length,
      totalTaskComplete: allTaskComplete.length,
    });
  }
  //find task have user
  let findAllTaskuserJoin = await task_Schema.find({
    taskers: {
      $in: request.owner,
    },
  });
  for (const eachTask of findAllTaskuserJoin) {
    // search id project -->

    const idProject = await Job_Schema.find({ _id: eachTask.idJobOwner })
      .lean()
      .exec();
    console.log(idProject);
    // <-- search id project
    if (idProject.length > 0)
      allTask.push({
        idProject: idProject[0].projectowner,
        idTask: eachTask._id,
        idBoard: eachTask.idJobOwner,
        title: eachTask.title,
        progress: eachTask.progress,
        is_complete: eachTask.is_complete,
        priority: eachTask.priority,
        start_time: eachTask.start_time,
        end_time: eachTask.end_time,
      });
  }
  await result.push({
    allProject,
    allTask,
  });
  res.send(result);
}

export async function editProfile(req: Request, res: Response) {
  let request = req.body;
  let userInfo = await user_Schema.find({ _id: request.owner }).find().exec();
  if (userInfo.length > 0) {
    let infoEdit = {
      display_name: request.display_name || userInfo[0].display_name,
      bio: request.bio || userInfo[0].bio,
      company: request.company || userInfo[0].company,
      address: request.location || userInfo[0].address,
      email: request.email || userInfo[0].email,
    };
    user_Schema
      .updateOne(
        { _id: request.owner },
        {
          $set: {
            display_name: infoEdit.display_name,
            bio: infoEdit.bio,
            company: infoEdit.company,
            address: infoEdit.address,
            email: infoEdit.email,
          },
        }
      )
      .exec((error) => {
        if (error) {
          res.send({ isSuccess: false });
        } else {
          res.send({ isSuccess: true });
        }
      });
  } else {
    res.send({ isSuccess: false, error: "user not found !" });
  }
}

export async function uploadAvatar(req: Request, res: Response) {
  let request = req.body;
  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = `${PORT}/photo/${req.file.filename}`;
  try {
    await user_Schema.updateOne(
      { _id: request.owner },
      { $set: { avatar: imgUrl } }
    );
    res.send({ isSuccess: true });
  } catch (exception: any) {
    if (!exception) {
      res.send({ isSuccess: true });
    } else {
      res.send({ isSuccess: false });
    }
  }
}

export async function searchSubStringUserName(req: Request, res: Response) {
  let request = req.body;
  let userNameFound = await user_Schema
    .find({ user_name: { $regex: request.user_name } })
    .exec();
  if (userNameFound.length > 0) {
    let listUserFound: any[] = [];
    for (const eachUser of userNameFound) {
      listUserFound.push({
        user_name: eachUser.user_name,
        display_name: eachUser.display_name || "",
        avatar: eachUser.avatar,
      });
    }
    res.send({ isSuccess: true, listUserFound });
  } else {
    res.send({ isSuccess: false });
  }
}

export const checkRoleUserInProject = async (req: Request, res: Response) => {
  let { id, idProject } = req.body;
  let infoUser = await user_Schema.find({ _id: id }).lean().exec();
  let infoUserInProject = await project_Schema.find({
    $and: [
      { _id: idProject },
      {
        members: {
          $elemMatch: { idMember: { $eq: infoUser[0]._id } },
        },
      },
    ],
  });

  if (infoUserInProject.length > 0) {
    let checnRole = await project_Schema.find(
      { _id: idProject },
      {
        members: {
          $elemMatch: { idMember: { $eq: infoUser[0]._id } },
        },
      }
    );
    // console.log(checnRole[0].members);
    const result = checnRole[0].members.filter(
      (member) => (member.idMember = infoUser[0]._id)
    );

    res.send({ isSuccess: true, result });
  } else {
    res.send({ isSuccess: false });
  }
};

export const getInfoByUserName = async (req: Request, res: Response) => {
  let { user_name } = req.body;
  let result = [];
  let projectOwner = [];
  let userInfo = await user_Schema.find({ user_name: user_name }).find().exec();
  if (userInfo.length > 0) {
    result.push({
      userInfo: {
        username: userInfo[0].user_name,
        displayName: userInfo[0].display_name || "",
        avatarURL: userInfo[0].avatar,
        bio: userInfo[0].bio || "",
        company: userInfo[0].company || "",
        email: userInfo[0].email || "",

        address: userInfo[0].address || "",
      },
    });
  }
  /// find project of User
  let projectUserJoin = await project_Schema
    .find({
      "members.idMember": { $in: userInfo[0]._id },
    })
    .lean()
    .exec();
  // project user join
  for (let eachIdProject of projectUserJoin) {
    let project = await project_Schema
      .find({ _id: eachIdProject })
      .lean()
      .exec();
    let memberInRoom = [];
    for (let eachMember of project[0].members) {
      let member = await user_Schema
        .find({ _id: eachMember.idMember })
        .find()
        .exec();
      if (member) {
        memberInRoom.push({
          username: member[0].user_name,
          avatar: member[0].avatar,
        });
      }
    }

    projectOwner.push({
      title: project[0].name,
      progress: project[0].progress,
      members: memberInRoom,
    });
  }
  //find task have user

  await result.push({ projectOwner });
  res.send(result);
};
