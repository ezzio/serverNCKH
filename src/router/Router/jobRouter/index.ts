import * as express from "express";
import {
  deleteJob,
  editJob,
  ListJobs,
  createAJob,
  completeAndUncompleteJob,
} from "./JobModal";

const router = express.Router();

router.post("/ListJobs", ListJobs);
router.post("/edit_Job", editJob);
router.post("/deleteJob", deleteJob);
router.post("/create_a_Job", createAJob);
router.post("/completeAndUncompleted", completeAndUncompleteJob);

export default router;
