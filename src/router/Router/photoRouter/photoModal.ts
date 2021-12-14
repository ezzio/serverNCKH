import { Request, Response } from "express";
import mongoose from "mongoose";

const Grid = require("gridfs-stream");
// const connection = require("../public/db/configmongoose");
import { connection } from "../../../db/configmongoose";

let gfs: any;
connection();

const conn = mongoose.connection;
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

export async function getPhoto(req: Request, res: Response) {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    res.send("not found");
  }
}

export async function deletePhoto(req: Request, res: Response) {
  try {
    await gfs.files.deleteOne({ filename: req.params.filename });
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send("An error occured.");
  }
}
