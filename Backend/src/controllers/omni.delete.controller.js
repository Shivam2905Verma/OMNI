const noteModel = require("../models/data.model");
const pillarModel = require("../models/pillar.model");

const deleteFolder = async (req, res) => {
  try {
    const { pillarId } = req.body;

    if (!pillarId) {
      return res.status(400).json({
        message: "Pillar Id is required",
        success: false,
      });
    }

    const isExist = await pillarModel.findById(pillarId);

    if (!isExist) {
      return res.status(400).json({
        message: "Folder is not existed",
        success: false,
      });
    }

    const deleted = await pillarModel.findByIdAndDelete(pillarId);

    const deleteNotes = await noteModel.deleteMany({
      userId: req.user.id,
      pillarId: pillarId,
    });

    res.status(200).json({
      message: "Folder deleted successfully",
      success: true,
      deleted,
      deleteNotes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There is a error in deleting this folder",
      success: false,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({
        message: "Note Id is required",
        success: false,
      });
    }

    const isExist = await noteModel.findById(noteId);

    if (!isExist) {
      return res.status(400).json({
        message: "Folder is not existed",
        success: false,
      });
    }

    const deleted = await noteModel.findByIdAndDelete(noteId);

    res.status(200).json({
      message: "Note deleted successfully",
      success: true,
      deleted,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There is a error in deleting Note",
      success: false,
    });
  }
};

module.exports = { deleteFolder  , deleteNote};
