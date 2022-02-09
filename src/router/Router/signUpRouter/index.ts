import * as express from 'express';
import { checkEmail, register } from './siginUpModal';
const router = express.Router();

router.post('/', register);
router.post('/check-email', checkEmail);

export default router;
