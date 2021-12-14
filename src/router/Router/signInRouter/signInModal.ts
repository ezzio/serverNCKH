import user_Schema from "../../../db/schema/User_Schema";

import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
  let request = req.body;
  let user: any;
  let DBfindUser = await user_Schema
    .find({ user_name: request.user_name, password: request.password })
    .lean()
    .exec();
  if (DBfindUser[0]) {
    user = {
      ID: DBfindUser[0]._id,
      user_name: DBfindUser[0].user_name,
      password: DBfindUser[0].password,
    };
    if (user && user.password == request.password) {
      res.send({ id: user.ID, username: user.user_name, isSuccess: true });
    } else {
      res.send({ error: "Invalid password", isSuccess: false });
    }
  } else {
    res.send({
      error: "Username or password is not correct",
      isSuccess: false,
    });
  }
}
