import * as express from 'express';
import { checkUsername, register } from './siginUpModal';
const router = express.Router();

router.post('/', register);
router.post('/check-username', checkUsername);

export default router;
