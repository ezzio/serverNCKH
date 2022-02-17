import User_Schema from "../../../db/schema/User_Schema";
import { Request, Response } from "express";
import project_Schema from "../../../db/schema/Project_Schema";
import detailTask_Schema from "../../../db/schema/detailTask_Schema";
import { deletProjectWithId } from "../../../router/deleteCollection/deleteCollection";
import conversation_Schema from "../../../db/schema/conversation_Schema";
import Attachment_Schema from "../../../db/schema/Attachments_Schema";
let PORT = process.env.PORTURL || "http://localhost:4000";
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
          // description: "project duoc tao ra boi thang",
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
        { $push: { members: { idMember: userName[0]._id, tag: "Member" } } }
      )
      .exec(async (error) => {
        if (!error) {
          await User_Schema.updateOne(
            { user_name: request.user_name },
            { $push: { InfoAllProjectJoin: request.projectId } }
          );
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
    members: [{ idMember: request.owner, tag: "Leader" }],
  });
  await User_Schema.updateOne(
    { _id: request.owner },
    { $push: { InfoAllProjectJoin: project._id } }
  );
  await project.save((err, modal) => {
    if (err) {
      console.log(err);
    } else {
      let newConversation = {
        projectOwner: modal._id,
      };
      new conversation_Schema(newConversation).save();

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
  let userInfo = await User_Schema.find({ _id: request.owner }).lean().exec();

  if (project.length > 0 && userInfo.length > 0) {
    let listMembers = project[0].members;
    let listMembersResult = [];
    let isProjectOwner = false;
    for (const member of listMembers) {
      let eachMember = await User_Schema.find({ _id: member.idMember })
        .find()
        .exec();
      listMembersResult.push({
        user_name: eachMember[0].user_name,
        display_name: eachMember[0].display_name || "",
        avatar: eachMember[0].avatar,
        tag: member.tag,
      });
    }
    let checkOwnerProject = await project_Schema
      .find({ $and: [{ owners: request.owner }, { _id: request.idProject }] })
      .lean();
    if (checkOwnerProject.length > 0) isProjectOwner = true;

    res.send({ isSuccess: true, listMembersResult, isProjectOwner });
  } else {
    res.send({ isSuccess: false });
  }
}

export const editRoleForUser = async (req: Request, res: Response) => {
  let request = req.body;
  let findUserInProject = await User_Schema.find({
    $and: [
      { user_name: request.user_name },
      { InfoAllProjectJoin: { $in: [request.projectId] } },
    ],
  })
    .lean()
    .exec();
  if (findUserInProject.length > 0) {
    await User_Schema.find({
      user_name: request.user_name,
    })
      .lean()
      .exec(async (error, modal) => {
        let checkOwnerProject = await project_Schema
          .find({
            $and: [{ _id: request.projectId }, { owners: request.owner }],
          })
          .lean()
          .exec();
        if (checkOwnerProject.length > 0) {
          await project_Schema
            .updateOne(
              {
                $and: [
                  { _id: request.projectId },
                  {
                    members: {
                      $elemMatch: { idMember: { $eq: modal[0]._id } },
                    },
                  },
                ],
              },
              { $set: { "members.$.tag": request.newRole } }
            )
            .exec(async (error) => {
              if (error) {
                res.send({
                  isSuccess: false,
                  message: "Không thể sửa thông tin",
                });
              } else {
                res.send({ isSuccess: true });
              }
            });
        } else {
          res.send({
            isSuccess: false,
            message: "Không thê chính sửa thông tin",
          });
        }
      });
  } else {
    res.send({
      isSuccess: false,
      message: "không tìm thấy người dùng trong project",
    });
  }
};

export const deleteMemberInProject = async (req: Request, res: Response) => {
  let request = req.body;
  let findProject = await project_Schema
    .find({ $and: [{ _id: request.projectId }, { owners: request.owner }] })
    .lean()
    .exec();
  if (findProject.length > 0) {
    await User_Schema.find({
      user_name: request.user_name,
    })
      .lean()
      .exec(async (error, modal) => {
        await project_Schema.updateOne(
          {
            _id: request.projectId,
          },
          {
            $pull: {
              members: {
                idMember: modal[0]._id,
              },
            },
          }
        );
        res.send({ isSuccess: true });
      });
  } else {
    res.send({ isSuccess: false, message: "project not found" });
  }
};

export const listAllAttachmentInProject = async (
  req: Request,
  res: Response
) => {
  let request = req.body;
  let userInfo = await User_Schema.find({ _id: request.owner }).lean().exec();
  let projectInfo = await project_Schema
    .find({ _id: request.idproject })
    .lean()
    .exec();
  if (projectInfo.length > 0 && userInfo.length > 0) {
    let result: any[] = [];
    var isProjectOwner = projectInfo[0].owners == request.owner;
    let allDetailTask = await detailTask_Schema
      .find({
        idProjectOwner: request.idproject,
      })
      .lean()
      .exec();
    for (const eachDetailTask of allDetailTask) {
      let eachAttachmentInDetailTask = eachDetailTask.attachments;
      if (eachAttachmentInDetailTask.length > 0) {
        for (const eachAttachment of eachAttachmentInDetailTask) {
          let attachment = await Attachment_Schema.find({ _id: eachAttachment })
            .lean()
            .exec();
          result.push({
            name: attachment[0].name,
            URL: attachment[0].URL,
            nameType: attachment[0].nameType,
            uploaded_at: attachment[0].uploaded_at,
          });
        }
      }
    }
    res.send({ isSuccess: true, allAttachment: result, isProjectOwner });
  } else {
    res.send({ isSuccess: false });
  }
};

export const renameProject = async (req: Request, res: Response) => {
  let request = req.body;
  await project_Schema
    .updateOne(
      {
        _id: request.idProject,
        owners: request.idUser,
      },
      { $set: { name: request.newNameProject } }
    )
    .exec((error) => {
      if (!error) {
        res.send({ isSuccess: true });
      } else {
        res.send({ isSuccess: false });
      }
    });
};

export const transferOwnerShipProject = async (req: Request, res: Response) => {
  let request = req.body;
  let userNameId = await User_Schema.find({ user_name: request.user_name })
    .lean()
    .exec();
  let projectInfo = await project_Schema
    .find({
      $and: [
        { _id: request.idProject },
        {
          members: {
            $elemMatch: { idMember: { $eq: userNameId[0]._id } },
          },
        },
      ],
    })
    .lean();
  // console.log(projectInfo);
  if (projectInfo.length > 0) {
    await project_Schema
      .updateOne(
        { _id: request.idProject, owners: request.idUser },
        { $set: { owners: userNameId[0]._id } }
      )
      .exec(async (error) => {
        if (!error) {
          await project_Schema.updateOne(
            {
              $and: [
                { _id: request.idProject },
                {
                  members: {
                    $elemMatch: { idMember: { $eq: request.idUser } },
                  },
                },
              ],
            },
            { $set: { "members.$.tag": "Member" } }
          );
          await project_Schema.updateOne(
            {
              $and: [
                { _id: request.idProject },
                {
                  members: {
                    $elemMatch: { idMember: { $eq: userNameId[0]._id } },
                  },
                },
              ],
            },
            { $set: { "members.$.tag": "Leader" } }
          );
          res.send({ isSuccess: true });
        } else {
          res.send({ isSuccess: false });
        }
      });
  } else {
    await User_Schema.updateOne(
      { _id: userNameId[0]._id },
      { $push: { InfoAllProjectJoin: request.idProject } }
    );
    await project_Schema
      .updateOne(
        { _id: request.idProject },
        { $push: { members: { idMember: userNameId[0]._id, tag: "Leader" } } }
      )
      .exec(async (err) => {
        if (!err) {
          await project_Schema.updateOne(
            {
              $and: [
                { _id: request.idProject },
                {
                  members: {
                    $elemMatch: { idMember: { $eq: request.idUser } },
                  },
                },
              ],
            },
            { $set: { "members.$.tag": "Member" } }
          );
          res.send({ isSuccess: true });
        } else {
          res.send({ isSuccess: false });
        }
      });
  }
};

export const listInfoProjectForOwner = async (req: Request, res: Response) => {
  let request = req.body;
  let infoProject = await project_Schema
    .find({ _id: request.idProject, owners: request.idUser })
    .lean()
    .exec();
  let infoUser = await User_Schema.find({ _id: request.idUser }).lean().exec();
  console.log(infoUser);
  res.send({
    name: infoProject[0].name,
    user_name: infoUser[0].user_name,
    isSuccess: true,
  });
};

export const removeProjectOwner = async (req: Request, res: Response) => {
  let request = req.body;
  // await project_Schema.deleteOne({ _id: request.idProject }).exec();
  let infoProject = await project_Schema
    .find({ _id: request.idProject })
    .lean()
    .exec();
};

export const updateProgressProject = async (req: Request, res: Response) => {
  let request = req.body;
  await project_Schema
    .updateOne(
      {
        _id: request.idProject,
      },
      { $set: { progress: request.progress } }
    )
    .exec((error) => {
      if (!error) {
        res.send({ isSuccess: true });
      } else {
        res.send({ isSuccess: false });
      }
    });
};

export const deleteProjectWithId = async (req: Request, res: Response) => {
  let request = req.body;

  let result = await deletProjectWithId(request.idProject);
  res.send(result ? { isSuccess: true } : { isSuccess: false });
};
