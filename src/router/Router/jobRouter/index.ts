import * as express from "express";
import { deleteJob, editJob, ListTast, createAJob } from "./JobModal";

const router = express.Router();

router.post("/ListJobs", ListTast);
router.post("/edit_Job", editJob);
router.post("/deleteJob", deleteJob);
router.post("/create_a_Job", createAJob);

export default router;
