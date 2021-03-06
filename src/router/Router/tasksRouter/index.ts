import * as express from "express";
import {
  listTaskKanban,
  createTask,
  deleteTask,
  createDetailTask,
  editTask,
  listDetailTask,
  editDetailTask,
  deleteDetailTask,
  uploadFileInDetailTask,
  completeAndUncompleteDetailTask,
  updateTaskOverdue,
  changeTaskInColumn,
  checkIsCompleteTask,
  listMessageInDetailTask,
} from "./taskModal";
import { Request, Response } from "express";
const router = express.Router();
const multer = require("multer");
import { storage } from "../../../db/functionForDB/upload";
import { deletProjectWithId } from "../../../router/deleteCollection/deleteCollection";
import { Job_Schema } from "../../../db/schema/jobs_Schema";
const upload = multer({ dest: "uploads/" });

router.post("/ListTasks/kaban", listTaskKanban);
router.post("/create_a_new_task", createTask);
router.post("/deleteTask", deleteTask);
router.post("/createNewDetailTask", createDetailTask);
router.post("/editTask", editTask);
router.post("/listAllDetailTask", listDetailTask);
router.post("/editDetailTask", editDetailTask);
router.post("/deleteDetailTask", deleteDetailTask);

router.post("/updateTaskOverdue", updateTaskOverdue);
router.post(
  "/completeAndUncompleteDetailTask",
  completeAndUncompleteDetailTask
);
router.post(
  "/uploadFileDetailTask",
  multer({ storage }).single("my_file"),
  uploadFileInDetailTask
);
router.post("/changeColumnTask", changeTaskInColumn);
router.post("/completeAndUncompleteTask", checkIsCompleteTask);
router.post("/listMessageInDetailTask", listMessageInDetailTask);

export default router;
