const express = require("express");
const dataRouter = express.Router();
const multer = require("multer");
const {
  generateTags,
  saveOmniData,
  searchOmni,
  getPillars,
  getDataforPillar,
  folderColorName,
  getFolderColorName,
  setFolderColor,
  saveStickyNote,
  getAllStickyNotes,
  setfavouriteNote,
  getfavouriteNote,
  addFolderFromWeb
} = require("../controllers/omni.controller");
const identifyUser = require("../middleware/identifyUser");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

dataRouter.post(
  "/process-item",
  upload.single("file"),
  identifyUser,
  generateTags,
);
dataRouter.post(
  "/save-data",
  upload.single("file"),
  identifyUser,
  saveOmniData,
);
dataRouter.post("/set-foldercolor/:pillarId", identifyUser, setFolderColor);
dataRouter.post("/save-foldercolorName", identifyUser, folderColorName);
dataRouter.post("/save-stickyNote", identifyUser, saveStickyNote);
dataRouter.post("/add-favouriteNote", identifyUser, setfavouriteNote);
dataRouter.post("/add-folder-fromWeb", identifyUser, addFolderFromWeb);
dataRouter.get("/get-favouriteNote", identifyUser, getfavouriteNote);
dataRouter.get("/get-StickyNotes", identifyUser, getAllStickyNotes);
dataRouter.get("/get-save-foldercolorName", identifyUser, getFolderColorName);
dataRouter.get("/search", identifyUser, searchOmni);
dataRouter.get("/get-pillar", identifyUser, getPillars);
dataRouter.get("/notes/:pillarId", identifyUser, getDataforPillar);

module.exports = dataRouter;
