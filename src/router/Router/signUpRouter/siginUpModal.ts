import user_Schema from "../../../db/schema/User_Schema";
import { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  let request = req.body;
  let checkUser = await user_Schema
    .find({ user_name: request.username })
    .lean()
    .exec();
  if (checkUser.length > 0) {
    let User = new user_Schema({ ...req.body, gender: "male" });
    await User.save(function (err: any) {
      if (!err) {
        res.send({ isSuccess: true });
      } else {
        res.send({ error: "Register fail", isSuccess: false });
      }
    });
  } else {
    res.send({ error: "Username is existed", isSuccess: false });
  }
}
