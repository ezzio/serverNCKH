import * as express from "express";
import {
  createMeetingRoom,
  removeMeeting,
  setTimeForMeetingRoom,
  listMeetingRoom,
  GetListMemBersWhenJoinRoom,
} from "./meetingRoom";
const router = express.Router();

router.post("/createMeetingRoom", createMeetingRoom);
router.post("/listMeetingRoom", listMeetingRoom);
router.post("/deleteMeetingRoom", removeMeeting);
router.post("/editNewTimeForMeeting", setTimeForMeetingRoom);
router.post("/ListMemberInMemberInMeetingRoom", GetListMemBersWhenJoinRoom);

export default router;
