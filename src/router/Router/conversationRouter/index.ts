import * as express from "express";
import {
  createARoomInConversation,
  listConversationInProject,
} from "./conversationModal";

const router = express.Router();

router.post("/createARoomInConversation", createARoomInConversation);
router.post("/listConversationInProject", listConversationInProject);
export default router;
