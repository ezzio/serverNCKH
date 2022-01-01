import User_Schema from "../../../db/schema/User_Schema";
import { Request, Response } from "express";
import project_Schema from "../../../db/schema/Project_Schema";

export async function listAllProject(req: Request, res: Response) {
  let request = req.body;
  let user = await User_Schema.findById({ _id: request.owner }).lean().exec();
  let ListProject = [];
  if (user) {
    for (let i = 0; i < user.InfoAllProjectJoin.length; i++) {
      let eachProject = await project_Schema
        .findById({
          _id: user.InfoAllProjectJoin[i],
        })
        .lean()
        .exec();
      if (eachProject)
        ListProject.push({
          name: eachProject.name,
          createAt: eachProject.createAt,
          description: "project duoc tao ra boi thang",
        });
    }
    res.send(ListProject);
  }
}
export async function addAMemberIntoProject(req: Request, res: Response) {
  let request = req.body;
  let userName = await User_Schema.find({ user_name: request.user_name })
    .lean()
    .exec();
  if (userName.length > 0) {
    await project_Schema
      .updateOne(
        {
          $and: [{ owners: request.projectowner }, { _id: request.projectId }],
        },
        { $push: { members: userName[0]._id } }
      )
      .exec((error: any) => {
        if (!error) {
          res.send({ isSuccess: true });
        } else {
          res.send({ isSuccess: false });
        }
      });
  } else {
    res.send({ isSuccess: false, message: "user not found" });
  }
}

export async function createAProject(req: Request, res: Response) {
  let request = req.body;
  let project = new project_Schema({
    name: request.name,
    owners: request.owner,
    members: [request.owner],
  });
  await User_Schema.findByIdAndUpdate(
    { _id: request.owner },
    { $push: { InfoAllProjectJoin: project._id } }
  );
  await project.save((err, modal) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ isSuccess: true, idProject: modal._id });
    }
  });
}

export async function listUserInProject(req: Request, res: Response) {
  let request = req.body;
  let project = await project_Schema
    .find({ _id: request.idProject })
    .find()
    .exec();
  if (project.length > 0) {
    let listMembers = project[0].members
    let listMembersResult = [];
    for(const member of listMembers) {
      let eachMember = await User_Schema.find({ _id: member}).find().exec()
      listMembersResult.push({
        user_name: eachMember[0].user_name,
        avatar: eachMember[0].avatar
      })
    }
    res.send(listMembersResult)
  }
}
