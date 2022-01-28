import * as express from 'express';
import { getAllJob } from './Controller/getAllJob';
import { getAllTask } from './Controller/getAllTask';
import { getLinePlot } from './Controller/getLinePlot';
import { getTimeLine } from './Controller/getTimeLine';

const router = express.Router();

router.post('/get-all-job', getAllJob);
router.post('/get-all-task', getAllTask);
router.post('/get-time-line', getTimeLine);
router.post('/get-line-plot', getLinePlot);

export default router;
