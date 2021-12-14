const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedback = new Schema(
  {
    content: { type: 'string'},
    create_at: { type:Date , default: new Date}
  },

);

module.exports = mongoose.model("feedback", feedback);