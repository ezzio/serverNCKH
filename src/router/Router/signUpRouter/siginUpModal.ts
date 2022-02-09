import user_Schema from '../../../db/schema/User_Schema';
import { Request, Response } from 'express';

export async function register(req: Request, res: Response) {
  let User = new user_Schema({ ...req.body });
  await User.save(function (err, modal) {
    if (!err) {

      res.send({ isSuccess: true, id: modal._id });
    } else {
      res.send({ error: 'Register fail', isSuccess: false });
    }
  });
}

export async function checkUsername(req: Request, res: Response) {
  let request = req.body;
  console.log(request.user_name);
  let checkUser = await user_Schema
    .find({ user_name: request.user_name })
    .lean()
    .exec();
  if (checkUser.length > 0) {
    res.send({ isSuccess: true });
  } else {
    res.send({ error: 'Your email is existed', isSuccess: false });
  }
}
