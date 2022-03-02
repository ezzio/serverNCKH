import User_Schema from "../../../db/schema/User_Schema";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import meetingRoom from "../../../db/schema/meetingSchema";
import getInFoUserInArray from "../../../db/functionForDB/getInFoUserInArray";
export const createMeetingRoom = async (req: Request, res: Response) => {
  let request = req.body;
  let memberInMeeting: ObjectId[] = [];

  if (request.memberInMeetingRoom.length > 0) {
    for (const eachMemberInRoom of request.memberInMeetingRoom) {
      let findIdUser = await User_Schema.find({
        user_name: eachMemberInRoom,
      })
        .lean()
        .exec();
      memberInMeeting.push(findIdUser[0]._id);
    }
  }
  let newMeetingRoom = {
    name: request.name,
    description: request.description,
    timeStartMeeting: request.timeStartMeeting,
    projectowner: request.projectowner,
    in_meeting: memberInMeeting,
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
      let listUserNameInMeeting = await getInFoUserInArray(
        eachMeetingRoom.in_meeting
      );
      let resultMember = listUserNameInMeeting.map((items) => {
        return {
          display_name: items.display_name,
          avatar: items.avatar,
        };
      });
      infoMeetingRoom.push({
        id: eachMeetingRoom._id,
        name: eachMeetingRoom.name,
        start_time: eachMeetingRoom.start_time,
        description: eachMeetingRoom.description,
        members: resultMember,
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
