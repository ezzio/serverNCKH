const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Conversation = new Schema(
  {
    room_socket :{ type: String , required: true},
    name: { type: String}
  },

);

module.exports = mongoose.model("Conversation", Conversation);
