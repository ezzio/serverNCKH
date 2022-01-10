import * as express from "express";
import { downloadFileZip } from "./zipFileModal";
const router = express.Router();

router.get("/dowloadZipFile/:filename", downloadFileZip);

export default router;
