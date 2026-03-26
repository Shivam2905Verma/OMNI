import { useRef, useState } from "react";
import { createContext } from "react";
import { getNotes } from "./service/note.api";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [noteData, setNoteData] = useState();
  const [noteLoading, setNoteLoading] = useState(false);
  const [showAddNote, setshowAddNote] = useState(false);
  const [searchedData, setSearchedData] = useState();
  const [searchInput, setSearchInput] = useState("");

  async function handleGetNotes(pillarId) {
    try {
      setNoteLoading(true);
      const res = await getNotes(pillarId);
      setNoteData(res.notes);
    } catch (error) {
      console.log("this error is coming from handleGetnotes", error);
    } finally {
      setNoteLoading(false);
    }
  }

  return (
    <NoteContext.Provider
      value={{
        showAddNote,
        setshowAddNote,
        noteData,
        setNoteData,
        noteLoading,
        setNoteLoading,
        handleGetNotes,
        searchedData,
        setSearchedData,
        searchInput,
        setSearchInput,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
