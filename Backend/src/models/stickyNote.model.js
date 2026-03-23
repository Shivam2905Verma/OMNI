const mongoose = require("mongoose");

const stickyNoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
});

const StickyNoteModel = mongoose.model("stickyNote", stickyNoteSchema);

module.exports = StickyNoteModel;
