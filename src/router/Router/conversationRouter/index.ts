import * as express from "express";
import {
  createARoomInConversation,
  listConversationInProject,
  listRoomConversation,
  deleteConversation,
  inviteMemberIntoRoomChat,
  renameChannelChat,
} from "./conversationModal";

const router = express.Router();

router.post("/createARoomInConversation", createARoomInConversation);
router.post("/listConversationInProject", listConversationInProject);
router.post("/deletRoomInConversation", deleteConversation);
router.post("/listRoomConversation", listRoomConversation);
router.post("/inviteMemberToChannel", inviteMemberIntoRoomChat);
router.post("/renameChannel", renameChannelChat);

export default router;
