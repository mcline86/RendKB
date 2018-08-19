var mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
  text: String,
  locked: Boolean,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Logon"
    },
    username: String
  },
  reply: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  votes: Number
});

module.exports = mongoose.model("Comment", commentSchema)
