import { Request, Response } from "express";
import mongoose from "mongoose";
const Grid = require("gridfs-stream");
import { connection } from "../../../db/configmongoose";
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
