import * as express from "express";
import userRouter from "./Router/userRouter";
import JobRouter from "./Router/jobRouter";
import projectRouter from "./Router/projectRouter";
import photoRouter from "./Router/photoRouter";
import signUpRouter from "./Router/signUpRouter";
import signInRouter from "./Router/signInRouter";
import tasksRouter from "./Router/tasksRouter";
import kanbanRouter from "./Router/kanbanDashBoard";
import zipRouter from "./Router/zipFileRouter";
import dashboardRouter from "./Router/dashboard";
import conversationRouter from './Router/conversationRouter'

export default (app: express.Express) => {
  app.use("/login", signInRouter);
  app.use("/register", signUpRouter);
  app.use("/user", userRouter);
  app.use("/photo", photoRouter);
  app.use("/Tasks", tasksRouter);
  app.use("/Job", JobRouter);
  app.use("/project", projectRouter);
  app.use("/zipFile", zipRouter);
  app.use("/kanban", kanbanRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/conversation", conversationRouter);
};
