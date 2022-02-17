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

export const listMeetingRoom = async (req: Request, res: Response) => {
  let { idProject } = req.body;
  let infoMeetingRoom: any[] = [];
  let allMeetingRoom = await meetingRoom
    .find({ projectowner: idProject })
    .lean()
    .exec();
  if (allMeetingRoom.length > 0)
    for (const eachMeetingRoom of allMeetingRoom) {
      infoMeetingRoom.push({
        id: eachMeetingRoom._id,
        start_time: eachMeetingRoom.start_time,
        description: eachMeetingRoom.description,
      });
    }
  res.send({ isSuccess: true, infoMeetingRoom });
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
