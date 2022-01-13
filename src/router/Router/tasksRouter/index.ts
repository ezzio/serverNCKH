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
} from "./taskModal";
const router = express.Router();
const multer = require("multer");
import { storage } from "../../../db/functionForDB/upload";
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

export default router;
