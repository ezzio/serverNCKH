import detailTask_Schema from "../../../db/schema/detailTask_Schema";
import { Request, Response } from "express";
import mongoose from "mongoose";
const Grid = require("gridfs-stream");
import { connection } from "../../../db/configmongoose";
import Attachments_Schema from "../../../db/schema/Attachments_Schema";
let gfs: any;
connection();
const conn = mongoose.connection;
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

export const downloadFileZip = async (req: Request, res: Response) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    res.send("not found");
  }
};

export const removeZipFile = async (req: Request, res: Response) => {
  let request = req.body;
  let attachmentInfo = await Attachments_Schema.find({
    name: request.name_attachment,
  }).lean();
  if (attachmentInfo.length > 0) {
    let detailTask = await detailTask_Schema
      .find({
        $and: [
          { idProjectOwner: request.idProject },
          { attachments: { $in: attachmentInfo[0]._id } },
        ],
      })
      .lean()
      .exec();
    await detailTask_Schema
      .updateOne(
        { _id: detailTask[0]._id },
        { $pull: { attachments: attachmentInfo[0]._id } }
      )
      .exec(async (error) => {
        if (!error) {
          await Attachments_Schema.deleteOne({ _id: attachmentInfo[0]._id });
          await gfs.files.deleteOne({ filename: request.name_attachment });
          res.send({ isSuccess: true });
        } else {
          res.send({ isSuccess: false });
        }
      });
  } else {
    res.send({ isSuccess: false });
  }
};
