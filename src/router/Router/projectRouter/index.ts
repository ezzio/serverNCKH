import * as express from "express";
import { listAllProject, createAProject } from "./projectModal";
const router = express.Router();

router.post("/", listAllProject);
router.post("create_a_project", createAProject);
export default router;
