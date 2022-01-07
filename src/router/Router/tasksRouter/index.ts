import * as express from "express";
import { listTaskKanban, createTask, deleteTask , createDetailTask , editTask} from "./taskModal";
const router = express.Router();

router.post("/ListTasks/kaban", listTaskKanban);
router.post("/create_a_new_task", createTask);
router.post("/deleteTask", deleteTask);
router.post('/createNewDetailTask' , createDetailTask)
router.post('/editTask', editTask);
export default router;
