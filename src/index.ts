import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routers from "./router";
import { connection } from "./db/configmongoose";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cors({ origin: true }));

async function main() {
  connection();

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
  });

  routers(app);
}

main();
