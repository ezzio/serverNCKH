import { Request, Response, NextFunction } from 'express';
import user_Schema from '../../../db/schema/User_Schema';
import project_Schema from '../../../db/schema/Project_Schema';
import task_Schema from '../../../db/schema/task_Schema';
import { Job_Schema } from '../../../db/schema/jobs_Schema';
let PORT = process.env.PORTURL || 'http://localhost:4000';

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
        display_name: userInfo[0].display_name || '',
        avatar: userInfo[0].avatar,
        bio: userInfo[0].bio || '',
        company: userInfo[0].company || '',
        email: userInfo[0].email || '',
        location: userInfo[0].location || '',
      },
    });
  }
  /// find project of User
  let projectUserJoin = await project_Schema
    .find({
      'members.idMember': { $in: request.owner },
    })
    .lean()
    .exec();
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
    allProject.push({
      idProject: project[0]._id,
      title: project[0].name,
      members: memberInRoom,
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
    // <-- search id project

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
      location: request.location || userInfo[0].location,
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
            location: infoEdit.location,
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
    res.send({ isSuccess: false, error: 'user not found !' });
  }
}

export async function uploadAvatar(req: Request, res: Response) {
  let request = req.body;
  if (req.file === undefined) return res.send('you must select a file.');
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
        display_name: eachUser.display_name || '',
        avatar: eachUser.avatar,
      });
    }
    res.send({ isSuccess: true, listUserFound });
  } else {
    res.send({ isSuccess: false });
  }
}
