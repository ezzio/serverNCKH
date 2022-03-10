import User_Schema from "../../../db/schema/User_Schema";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import meetingRoom from "../../../db/schema/meetingSchema";
import getInFoUserInArray from "../../../db/functionForDB/getInFoUserInArray";
import Project_Schema from "../../../db/schema/Project_Schema";
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
    start_time: request.start_time,
    end_time: request.end_time,
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
  let { idProject, idUser } = req.body;
  let infoMeetingRoom: any[] = [];
  let infoProject = await Project_Schema.find({ _id: idProject }).lean().exec();
  let infoUsername = await User_Schema.find({ _id: idUser }).lean().exec();
  let memberInMeetingRoom = await getInFoUserInArray(
    infoProject[0].members.map((items) => items.idMember)
  );
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
        end_time: eachMeetingRoom.end_time,
        timeStartMeeting: eachMeetingRoom.timeStartMeeting,
        description: eachMeetingRoom.description,
        members: resultMember,
      });
    }
  res.send({
    isSuccess: true,
    infoMeetingRoom,
    infoUsername,
    memberInProject: memberInMeetingRoom.map((items) => {
      return {
        display_name: items.display_name,
        user_name: items.user_name,
        avatar: items.avatar,
      };
    }),
  });
};

export const removeMeeting = async (req: Request, res: Response) => {
  let request = req.body;
  await meetingRoom.deleteOne({ _id: request.idMeetingRoom });
  res.send({ isSuccess: true, idRoomRemove: request.idMeetingRoom });
};

export const setTimeForMeetingRoom = async (req: Request, res: Response) => {
  let request = req.body;
  await meetingRoom.updateOne(
    { _id: request.idMeetingRoom },
    { start_time: request.newTimeStart }
  );
  res.send({ isSuccess: true });
};
