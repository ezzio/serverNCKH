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
  sendImage,
} from "./conversationModal";
import { storage } from "../../../db/functionForDB/upload";
import multer from "multer";
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
router.post("/sendImage", multer({ storage }).single("file"), sendImage);
export default router;
