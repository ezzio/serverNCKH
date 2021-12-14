import * as express from "express";
import multer from "multer";
import { getUserInfo, uploadAvatar } from "./userModal";
import { storage } from "../../../db/functionForDB/upload";
const router = express.Router();

router.post("/", getUserInfo);
router.post("/uploadAvatar", multer({ storage }).single("file"), uploadAvatar);

export default router;
