import { Request, Response } from "express";
import meetingRoom from "../../../db/schema/meetingSchema";
export const createMeetingRoom = async (req: Request, res: Response) => {
  let request = req.body;
  let newMeetingRoom = {
    name: request.name,
    description: request.description,
    timeStartMeeting: request.timeStartMeeting,
    projectowner: request.projectowner,
  };
  let newMeeting = new meetingRoom(newMeetingRoom);
  await newMeeting.save((error, modal) => {
    if (!error) {
      res.send({ isSuccess: true, newMeetingRoom: modal });
    } else {
      res.send({ isSuccess: false });
    }
  });
};

export const removeMeeting = async (req: Request, res: Response) => {
  let request = req.body;
  await meetingRoom.deleteOne({ _id: request.idMeetingRoom });
  res.send({ isSuccess: true });
};

export const setTimeForMeetingRoom = async (req: Request, res: Response) => {
  let request = req.body;
  await meetingRoom.updateOne(
    { _id: request.idMeetingRoom },
    { start_time: request.newTimeStart }
  );
  res.send({ isSuccess: true });
};
