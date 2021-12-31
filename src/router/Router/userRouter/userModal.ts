import { Request, Response, NextFunction } from "express";
import user_Schema from "../../../db/schema/User_Schema";
import project_Schema from "../../../db/schema/Project_Schema";
import { resolveSrv } from "dns/promises";

let PORT = process.env.PORTURL || "http://localhost:4000";

export async function getUserInfo(req: Request, res: Response) {
  let request = req.body;
  let result = [];
  let allProject = [];
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
        location: userInfo[0].location || "",
      },
    });
  }
  let projectOfUser = await project_Schema.find({
    owners: request.owner,
  });
  for (let project of projectOfUser) {
    let memberInRoom = [];
    for (let eachMember of project.members) {
      let member = await user_Schema.find({ _id: eachMember }).find().exec();
      if (member) {
        memberInRoom.push({
          username: member[0].user_name,
          avatar: member[0].avatar,
        });
      }
    }
    allProject.push({
      idProject: project._id,
      title: project.name,
      members: memberInRoom,
    });
  }
  await result.push({ allProject: allProject });
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
    res.send({ isSuccess: false, error: "user not found !" });
  }
}

export async function uploadAvatar(req: Request, res: Response) {
  let request = req.body;
  console.log(req.file);
  console.log(request);

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
