import axios from "axios";

const api = axios.create({
  baseURL: "",
  withCredentials: true,
  validateStatus: () => true,
});
// const api = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true,
//   validateStatus: () => true,
// });

export async function getPillars() {
  try {
    const res = await api.get("/api/omni/get-pillar");
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function getNotes(pillarId) {
  try {
    const res = await api.get(`/api/omni/notes/${pillarId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function getSaveFolderColorNames() {
  try {
    const res = await api.get(`/api/omni/get-save-foldercolorName`);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function saveFolderColorNames(folderColors) {
  try {
    const res = await api.post(`/api/omni/save-foldercolorName`, {
      folderColors,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function setFolderColorfunc(pillarId, folderColor) {
  try {
    const res = await api.post(`/api/omni/set-foldercolor/${pillarId}`, {
      folderColor,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function saveStickyNote(topic, content, noteId) {
  try {
    const res = await api.post(`/api/omni/save-stickyNote`, {
      topic,
      content,
      noteId,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function setfavouriteNote(noteId, liked) {
  try {
    const res = await api.post(`/api/omni/add-favouriteNote`, {
      noteId,
      liked,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function getfavouriteNote() {
  try {
    const res = await api.get(`/api/omni/get-favouriteNote`);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function addFolderFromWeb(folderName, color) {
  try {
    const res = await api.post(`/api/omni/add-folder-fromWeb`, {
      folderName,
      color,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function getStickyNotes() {
  try {
    const res = await api.get(`/api/omni/get-StickyNotes`);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function genrateTagsAndSumaary(formData) {
  try {
    const res = await api.post("/api/omni/process-item", formData);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function saveNoteData(formData) {
  try {
    const res = await api.post("/api/omni/save-data", formData);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function searchData(search) {
  try {
    const res = await api.get(`/api/omni/search/${search}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteFolder(pillarId) {
  try {
    const res = await api.delete(`/api/omni/delete-folder`, {
      data: { pillarId },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteNote(noteId) {
  try {
    const res = await api.delete(`/api/omni/delete-note`, {
      data: { noteId },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}
