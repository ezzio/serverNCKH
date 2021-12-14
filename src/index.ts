import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routers from "./router";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4200"],
  })
);

async function main() {
  try {
    await mongoose.connect(
      process.env.DB_URL || "mongodb://localhost:27017/Horenso_Manager",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (error: any) {
    console.error(
      `Error occured while creating a db connection: ${error.message}`
    );
    process.exit(0);
  }

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
  });

  routers(app);
}

main();
