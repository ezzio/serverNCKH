import * as express from "express";
import { listAllProject, createAProject, addAMemberIntoProject } from "./projectModal";
const router = express.Router();

router.post("/", listAllProject);
router.post("/addAMemberIntoProject" , addAMemberIntoProject);
router.post("/create_a_project", createAProject);
export default router;
