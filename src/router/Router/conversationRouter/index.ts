import * as express from "express";
import {
  createARoomInConversation,
  listConversationInProject,
  listRoomConversation,
  deleteConversation,
  inviteMemberIntoRoomChat
} from "./conversationModal";

const router = express.Router();

router.post("/createARoomInConversation", createARoomInConversation);
router.post("/listConversationInProject", listConversationInProject);
router.post("/deletRoomInConversation", deleteConversation);
router.post("/listRoomConversation", listRoomConversation);
router.post("/inviteMemberToChannel", inviteMemberIntoRoomChat);

export default router;
