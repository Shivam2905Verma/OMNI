const mongoose = require("mongoose");

const noteScema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    url: String,
    imageurl: String,
    aboutFile: String,

    pillarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pillar",
      required: true,
    },

    subtopic: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    favourite: {
      type: Boolean,
      default: false,
    },

    manualNote: String,

    embedding: {
      type: [Number],
      required: true,
      index: false,
    },
  },
  { timestamps: true },
);

const noteModel = mongoose.model("note", noteScema);

module.exports = noteModel;
