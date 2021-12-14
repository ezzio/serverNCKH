import mongoose from "mongoose";

export async function connection() {
  mongoose
    .connect(
      process.env.MONGODB_URL || "mongodb://localhost:27017/Horenso_Manager",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      }
    )
    .catch((err: any) => console.log(err));

  // mongoose.connection.on("connected", () => {
  //   console.log("Mongoose connected to db");
  // });
};
