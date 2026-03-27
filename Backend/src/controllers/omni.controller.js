const extractLinkAndText = require("../Helper/helper.function");
const {
  model,
  systemPrompt,
  embeddingModel,
  searchModel,
} = require("../services/googleAI.service");
const noteModel = require("../models/data.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const { default: mongoose } = require("mongoose");
const pillarModel = require("../models/pillar.model");
const folderColorNameModel = require("../models/folderColor.model");
const StickyNoteModel = require("../models/stickyNote.model");
const client = new ImageKit({
  privateKey: "private_JYI8xVvlj55S3q4p/YCfBUJ+rm0=",
});

const generateTags = async (req, res) => {
  const decoded = req.user;

  try {
    if (!req.file && !req.body.content) {
      return res.status(400).json({ error: "No content or file provided." });
    }
    const allPillars = await pillarModel.find({ userId: decoded.id });

    const pillarNames = allPillars.map((p) => p.pillar);
    const finalSystemPrompt = systemPrompt(pillarNames);

    let promptParts = [{ text: finalSystemPrompt }];

    if (req.body.content) {
      let linkAndbody = extractLinkAndText(req.body.content);

      if (linkAndbody.links[0]) {
        const url = linkAndbody.links[0];

        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          promptParts.push({
            fileData: {
              fileUri: url,
              mimeType: "video/mp4",
            },
          });
        } else {
          promptParts.push({
            text: `Analyze the content from this URL: ${url}`,
          });
        }
      }

      if (linkAndbody.text) {
        promptParts.push({ text: `User Context: ${linkAndbody.text}` });
      }
    }

    if (req.file) {
      promptParts.push({
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      });
    }

    const result = await model.generateContent(promptParts);
    const responseText = result.response.text();

    res.status(200).json({
      message: "content generated successfully",
      success: true,
      generated: JSON.parse(responseText),
    });
  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: "Failed to process item with AI." });
  }
};

const saveOmniData = async (req, res) => {
  const decoded = req.user;
  try {
    const { link, pillar, subTopic, tags, summary, manualNote } = req.body;

    let imageUrl;

    if (req.file) {
      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "text/plain",
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Only PDF and Image files are allowed",
          success: false,
        });
      }

      const uploadedFile = await client.files.upload({
        file: await toFile(req.file.buffer, req.file.originalname),
        fileName: req.file.originalname,
      });

      imageUrl = uploadedFile.url;
    }

    let pillarID;

    const existedpillar = await pillarModel.findOne({
      userId: decoded.id,
      pillar,
    });

    if (!existedpillar) {
      const pillarRes = await pillarModel.create({
        userId: decoded.id,
        pillar,
      });

      pillarID = pillarRes._id;
    } else {
      pillarID = existedpillar._id;
    }

    // 2. Generate
    let vector;
    try {
      const textToEmbed = `
               This content belongs to category: ${pillar}.
               Subcategory: ${subTopic}.
               Tags: ${tags}.
               Description: ${summary}.
                `;
      const result = await embeddingModel.embedContent({
        content: {
          parts: [{ text: textToEmbed }],
        },
        outputDimensionality: 768,
      });
      vector = result.embedding.values;
    } catch (apiErr) {
      console.error("Google Embedding API Error:", apiErr);
      return res
        .status(502)
        .json({ message: "AI Embedding failed", success: false });
    }

    const noteData = {
      userId: decoded.id,
      summary,
      tags,
      pillarId: pillarID,
      subtopic: subTopic,
      embedding: vector,
      manualNote,
    };

    if (link) {
      let linkAndbody = extractLinkAndText(link);

      if (linkAndbody.links[0]) {
        noteData.url = linkAndbody.links[0];
      }

      if (linkAndbody.text) {
        noteData.aboutFile = linkAndbody.text;
      }
    }

    if (imageUrl) {
      noteData.imageurl = imageUrl;
    }

    const note = await noteModel.create(noteData);

    return res.status(201).json({
      message: "Note created successfully",
      success: true,
      note,
    });
  } catch (err) {
    console.error("Internal Server Error:", err);
    return res.status(500).json({
      message: "An internal error occurred",
      success: false,
    });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const allNotes = await noteModel.find({ userId: req.user.id });
    return res.status(200).json({
      message: "All notes fetched successfully",
      success: true,
      allNotes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An internal error occurred",
      success: false,
    });
  }
};

const addFolderFromWeb = async (req, res) => {
  try {
    const { folderName, color } = req.body;
    const decoded = req.user;

    if (!folderName) {
      return res.status(400).json({
        message: "Folder name is needed",
        success: false,
      });
    }

    const existedpillar = await pillarModel.findOne({
      userId: decoded.id,
      pillar: folderName,
    });

    if (existedpillar) {
      return res.status(409).json({
        message: "Folder already existed",
        success: false,
      });
    }

    const pillar = await pillarModel.create({
      userId: decoded.id,
      pillar: folderName,
      color: color,
    });

    res.status(201).json({
      message: "Folder is craeted successfully",
      success: true,
      pillar,
    });
  } catch (error) {
    return res.status(500).json({
      message: "There is some error in making Folder",
      success: false,
    });
  }
};

const searchOmni = async (req, res) => {
  try {
    console.log(req.params);
    const { search } = req.params;

    if (!search || typeof search !== "string" || search.trim().length === 0)
      return res.status(400).json({ message: "Search query is required" });

    const sanitizedSearch = search.trim().slice(0, 500); // prevent prompt injection / huge inputs

    const prompt = `
You are an intelligent search query analyzer.

Your job is to understand the user's search query and extract structured information.

Return ONLY valid JSON in this format:
{
  "searchPillar": "",
  "searchSubtopic": "",
  "searchTags": [],
  "searchSummary": ""
}

Guidelines:
- searchPillar: Choose a broad category (e.g., Music, Technology, Movies, Education, Nature, Finance, etc.)
- searchSubtopic: Be more specific (e.g., Afrobeats, React Hooks, Marvel Movies, Stock Market Basics)
- searchTags: Provide 3 to 5 relevant keywords
- searchSummary: Write a clear 1-line description of what the user is looking for

Important:
- Keep responses concise
- Do not explain anything
- Do not add extra text outside JSON

User Query: "${sanitizedSearch}"
`;

    let parsedQuery;
    try {
      const modelres = await searchModel.generateContent(prompt);
      const rawText = modelres.response.text().trim();

      const cleanText = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "");
      parsedQuery = JSON.parse(cleanText);
    } catch (parseErr) {
      console.error("AI parse error:", parseErr);
      parsedQuery = {
        searchPillar: "",
        searchSubtopic: "",
        searchTags: [],
        searchSummary: sanitizedSearch,
      };
    }

    const { searchPillar, searchSubtopic, searchTags, searchSummary } =
      parsedQuery;

    const queryText = [
      `User is searching for: ${sanitizedSearch}.`,
      searchPillar ? `Category: ${searchPillar}.` : "",
      searchSubtopic ? `Subtopic: ${searchSubtopic}.` : "",
      searchTags?.length ? `Tags: ${searchTags.join(", ")}.` : "",
      searchSummary ? `Description: ${searchSummary}.` : "",
    ]
      .filter(Boolean)
      .join("\n");

    let queryVector;
    try {
      const result = await embeddingModel.embedContent({
        content: { parts: [{ text: queryText }] },
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: 768,
      });

      queryVector = result.embedding.values;
    } catch (embedErr) {
      console.error("Embedding error:", embedErr);
      return res.status(500).json({
        success: false,
        message: "Failed to generate search embedding",
      });
    }

    const results = await noteModel.aggregate([
      {
        $vectorSearch: {
          index: "Omni",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 100,
          limit: 10,
          filter: { userId: new mongoose.Types.ObjectId(req.user.id) },
        },
      },
      {
        $project: {
          _id: 1,
          score: { $meta: "vectorSearchScore" },
          summary: 1,
          pillar: 1,
          pillarId: 1,
          subtopic: 1,
          url: 1,
          tags: 1,
          imageurl: 1,
          aboutFile: 1,
          manualNote: 1,
          favourite: 1,
          embedding: 1,
          createdAt: 1,
        },
      },
      {
        $match: {
          score: { $gte: 0.79 },
        },
      },

      {
        $lookup: {
          from: "pillars", // ⚠️ your actual MongoDB collection name (usually lowercase + plural)
          localField: "pillarId",
          foreignField: "_id",
          as: "pillarId", // overwrites the pillarId field with full object
        },
      },
      // $lookup returns an array, convert it back to single object
      {
        $unwind: {
          path: "$pillarId",
          preserveNullAndEmptyArrays: true, // ✅ won't crash if pillarId is missing
        },
      },
    ]);

    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Vector Search Error:", error);
    return res.status(500).json({ success: false, message: "Search failed" });
  }
};

const folderColorName = async (req, res) => {
  try {
    const { folderColors } = req.body;

    const result = await folderColorNameModel.findOneAndUpdate(
      { userId: req.user.id },
      { folderColors },
      { returnDocument: "after", upsert: true },
    );

    res.status(200).json({
      message: "Colors saved successfully",
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const getFolderColorName = async (req, res) => {
  try {
    const folderColorName = await folderColorNameModel.findOne({
      userId: req.user.id,
    });

    if (!folderColorName) {
      return res.status(404).json({
        message: "Folder colors not found for this user",
        success: false,
      });
    }

    res.status(200).json({
      message: "Folder colors fetched successfully",
      success: true,
      folderColorName,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const setFolderColor = async (req, res) => {
  try {
    const { pillarId } = req.params;
    const { folderColor } = req.body;

    const pillar = await pillarModel.findByIdAndUpdate(
      pillarId,
      { color: folderColor },
      { returnDocument: "after" },
    );

    if (!pillar) {
      return res.status(404).json({
        message: "Folder not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Color updated successfully",
      success: true,
      pillar,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const getPillars = async (req, res) => {
  const decoded = req.user;

  const pillars = await pillarModel.find({ userId: decoded.id });

  res.status(200).json({
    message: "pillars are fetched successfully",
    success: true,
    pillars,
  });
};

const updatePillarName = async (req, res) => {
  try {
    console.log(req.body);
    const { pillarId, updatedName } = req.body;

    const isExisted = await pillarModel.findById(pillarId);

    if (!isExisted) {
      return res.status(404).json({
        message: "There is no folder with this ID",
        success: false,
      });
    }

    const updated = await pillarModel.findByIdAndUpdate(pillarId, {
      pillar: updatedName,
    });

    return res.status(200).json({
      message: "Pillar Name is updated successfully",
      success: true,
      updated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There is a error in updating pillar name",
      success: false,
    });
  }
};

const getDataforPillar = async (req, res) => {
  const decoded = req.user;
  const { pillarId } = req.params;

  const notes = await noteModel
    .find({ userId: decoded.id, pillarId: pillarId })
    .populate("pillarId");

  res.status(200).json({
    message: "notes are fetched successfully",
    success: true,
    notes,
  });
};

const saveStickyNote = async (req, res) => {
  try {
    const { topic, content, noteId } = req.body;

    let stickyNote;

    if (noteId) {
      stickyNote = await StickyNoteModel.findByIdAndUpdate(
        noteId,
        { topic, content },
        { returnDocument: "after" },
      );
    } else {
      stickyNote = await StickyNoteModel.create({
        userId: req.user.id,
        topic,
        content,
      });
    }

    res.status(201).json({
      message: "Sticky note saved successfully",
      success: true,
      stickyNote,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const getAllStickyNotes = async (req, res) => {
  const stickyNotes = await StickyNoteModel.find({ userId: req.user.id });
  res.status(200).json({
    message: "sticky notes are fetched successfully",
    success: true,
    stickyNotes,
  });
};

const setfavouriteNote = async (req, res) => {
  try {
    const { noteId, liked } = req.body;
    console.log(liked);

    const note = await noteModel.findByIdAndUpdate(noteId, {
      favourite: liked,
    });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found", success: false });
    }

    res.status(200).json({
      message: "Note favourite updated",
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong in add to favourite",
      success: false,
      error,
    });
  }
};

const getfavouriteNote = async (req, res) => {
  try {
    const notes = await noteModel
      .find({
        userId: req.user.id,
        favourite: true,
      })
      .populate("pillarId");

    res.status(200).json({
      message: "fetched favourite notes",
      success: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong in getting favourite",
      success: false,
      error,
    });
  }
};

module.exports = {
  generateTags,
  saveOmniData,
  searchOmni,
  getPillars,
  setFolderColor,
  getDataforPillar,
  folderColorName,
  getFolderColorName,
  saveStickyNote,
  getAllStickyNotes,
  setfavouriteNote,
  getfavouriteNote,
  addFolderFromWeb,
  updatePillarName,
  getAllNotes,
};
