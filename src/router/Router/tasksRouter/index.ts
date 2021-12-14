import * as express from "express";
import { listTaskKanban, createTask } from "./taskModal";
const router = express.Router();

router.post("/ListTasks/kaban", listTaskKanban);
router.post("/create_a_new_task", createTask);

export default router;
