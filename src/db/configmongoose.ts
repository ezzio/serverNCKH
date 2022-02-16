import mongoose from "mongoose";

export async function connection() {
  mongoose
    .connect(
      process.env.MONGODB_URL ||
        "mongodb+srv://ezzio:123456thang@cluster0.zbyuh.mongodb.net/Horenso_Manager?retryWrites=true&w=majority",
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
}
