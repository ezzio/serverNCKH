import * as express from "express";
import {
  createARoomInConversation,
  listConversationInProject,
  deleteConversation,
} from "./conversationModal";

const router = express.Router();

router.post("/createARoomInConversation", createARoomInConversation);
router.post("/listConversationInProject", listConversationInProject);
router.post("/deletRoomInConversation", deleteConversation);
export default router;
