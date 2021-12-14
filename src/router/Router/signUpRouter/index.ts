import * as express from "express";
import { register } from "./siginUpModal";
const router = express.Router();

router.post('/', register)

export default router;