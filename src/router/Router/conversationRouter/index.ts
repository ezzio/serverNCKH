import * as express from "express";
import {
  createARoomInConversation,
  listConversationInProject,
  listRoomConversation,
  deleteConversation,
  inviteMemberIntoRoomChat,
  renameChannelChat,
  likeAndDislikeTextChat,
  replyMessageInConversation,
  getInfoUser,
} from "./conversationModal";

const router = express.Router();

router.post("/createARoomInConversation", createARoomInConversation);
router.post("/listConversationInProject", listConversationInProject);
router.post("/deletRoomInConversation", deleteConversation);
router.post("/listRoomConversation", listRoomConversation);
router.post("/inviteMemberToChannel", inviteMemberIntoRoomChat);
router.post("/renameChannel", renameChannelChat);
router.post("/likeAndDislikeText", likeAndDislikeTextChat);
router.post("/replyMessage", replyMessageInConversation);
router.post("/getInfoUser", getInfoUser);

export default router;
