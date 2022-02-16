import * as express from "express";
import { createARoomInConversation } from "./conversationModal";

const router = express.Router();

router.post("/createARoomInConversation", createARoomInConversation);

export default router;
