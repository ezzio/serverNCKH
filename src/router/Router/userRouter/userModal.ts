import { Request, Response, NextFunction } from "express";
import user_Schema from "../../../db/schema/User_Schema";
import project_Schema from "../../../db/schema/Project_Schema";

let PORT = process.env.PORT || "http://localhost:4000";

export async function getUserInfo(req: Request, res: Response) {
  let request = req.body;
  let result = [];
  let allProject = [];
  let userInfo = await user_Schema.find({ _id: request.owner }).find().exec();
  result.push({
    userInfo: {
      username: userInfo[0].user_name,
      displayName: userInfo[0].display_name,
      avatar: userInfo[0].avatar,
    },
  });
  let projectOfUser = await project_Schema.find({
    owners: request.owner,
  });
  for (let project of projectOfUser) {
    let memberInRoom = [];
    for (let eachMember of project.members) {
      let member = await user_Schema.find({ _id: eachMember }).find().exec();
      memberInRoom.push({
        username: member[0].user_name,
        avatar: member[0].avatar,
      });
    }
    allProject.push({ projectname: project.name, memberInRoom });
  }
  await result.push({ allProject: allProject });
  res.send(result);
}

export async function editProfile(req: Request, res: Response) {
  let request = req.body;
  let userInfo = await user_Schema.find({ _id: request.owners }).find().exec();
  let infoEdit = {};
  if (userInfo.length > 0) {
  }
}

export async function uploadAvatar(req: Request, res: Response) {
  let request = req.body;
  console.log(req.file);

  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = `${PORT}/photo/${req.file.filename}`;
  try {
    await user_Schema.updateOne(
      { _id: request.owners },
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
