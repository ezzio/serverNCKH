import * as express from "express";
import { createMeetingRoom, removeMeeting, setTimeForMeetingRoom } from "./meetingRoom";
const router = express.Router();


router.post('/createMeetingRoom' , createMeetingRoom);
router.post('/deleteMeetingRoom' , removeMeeting);
router.post('/editNewTimeForMeeting' , setTimeForMeetingRoom);

