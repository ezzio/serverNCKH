import * as express from "express";
import { downloadFileZip , removeZipFile } from "./zipFileModal";
const router = express.Router();

router.get("/dowloadZipFile/:filename", downloadFileZip);
router.post('/removeZipFile' , removeZipFile);
export default router;
