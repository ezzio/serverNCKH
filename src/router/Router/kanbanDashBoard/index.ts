import * as express from "express";
const router = express.Router();
import { taskChartInProject } from "./kanbanDashBoardModal";

router.post("/kanbanDashBoard", taskChartInProject);

export default router;
