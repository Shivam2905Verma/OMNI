import { useState } from "react";
import { createContext } from "react";
import { getNotes } from "./service/note.api";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [noteData, setNoteData] = useState();
  const [noteLoading, setNoteLoading] = useState(false);

  async function handleGetNotes(pillarId) {
    try {
      setNoteLoading(true);
      const res = await getNotes(pillarId);
      setNoteData(res.notes);
    } catch (error) {
      console.log("this error is coming from handleGetnotes");
    } finally {
      setNoteLoading(false);
    }
  }

  return (
    <NoteContext.Provider
      value={{
        noteData,
        setNoteData,
        noteLoading,
        setNoteLoading,
        handleGetNotes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
