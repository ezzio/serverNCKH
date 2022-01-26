import * as express from "express";
import {
  listAllProject,
  createAProject,
  addAMemberIntoProject,
  listUserInProject,
  editRoleForUser,
  deleteMemberInProject,
  listAllAttachmentInProject,
  listInfoProjectForOwner,
  transferOwnerShipProject,
  renameProject,
} from "./projectModal";
const router = express.Router();

router.post("/", listAllProject);
router.post("/addAMemberIntoProject", addAMemberIntoProject);
router.post("/listMemberInProject", listUserInProject);
router.post("/create_a_project", createAProject);
router.post("/editRoleOfUser", editRoleForUser);
router.post("/deleteUserInProject", deleteMemberInProject);
router.post("/listAllAttachmentInProject", listAllAttachmentInProject);
router.post("/listSettingPage", listInfoProjectForOwner);
router.post("/renameProject", renameProject);
router.post("/transferProject", transferOwnerShipProject);
export default router;
