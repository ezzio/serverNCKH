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
  await project.save(function (err: any) {
    if (err) {
      console.log(err);
    } else {
      res.send({ isSuccess: true });
    }
  });
}
