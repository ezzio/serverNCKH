const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meeting = new Schema({
  in_meeting: [{ type: Schema.Types.ObjectId, ref: "User" }],
  name: { type: String, required: true },
  description: { type: String },
  start_time: { type: Date, default: new Date() },
});

module.exports = mongoose.model("meeting", meeting);
