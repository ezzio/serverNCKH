import user_Schema from '../../../db/schema/User_Schema';
import { Request, Response } from 'express';

export async function register(req: Request, res: Response) {
  let User = new user_Schema({ ...req.body });
  await User.save(function (err: any) {
    if (!err) {
      res.send({ isSuccess: true });
    } else {
      res.send({ error: 'Register fail', isSuccess: false });
    }
  });
}

export async function checkEmail(req: Request, res: Response) {
  let request = req.body;
  let checkUser = await user_Schema
    .find({ user_name: request.email })
    .lean()
    .exec();
  if (checkUser) {
    res.send({ isSuccess: true });
  } else {
    res.send({ error: 'Your email is existed', isSuccess: false });
  }
}
