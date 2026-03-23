const mongoose = require("mongoose");

const folderColorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  folderColors: [
    {
      color: { type: String, required: true },
      name: { type: String, default: "" },
    },
  ],
});

const folderColorNameModel = mongoose.model("folderColor", folderColorSchema);

module.exports = folderColorNameModel;
