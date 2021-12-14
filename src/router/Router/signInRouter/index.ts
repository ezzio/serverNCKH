import * as express from "express";
import { login } from "./signInModal";

const router = express.Router();

router.post("/", login);

export default router;