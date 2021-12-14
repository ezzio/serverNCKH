import * as express from "express";
import { getPhoto, deletePhoto } from "./photoModal";
const router = express.Router();

router.get("/:filename", getPhoto);
router.delete("/:filename", deletePhoto);

export default router;
