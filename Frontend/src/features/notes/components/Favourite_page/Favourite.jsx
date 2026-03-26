import { useContext, useEffect, useState } from "react";
import { NoteContext } from "../../NoteProvider";
import NoteCard from "../Notes_Page/NoteCard";
import { getfavouriteNote } from "../../service/note.api";
import OMNIGraph from "../Graph/OMNIGraph";

const Favourite = () => {
  const { noteLoading, setNoteLoading } = useContext(NoteContext);

  const [favouriteNote, setFavouriteNote] = useState();
  const [seegraph, setSeegraph] = useState(false);

  async function handleFavouriteNotes() {
    try {
      setNoteLoading(true);
      const res = await getfavouriteNote();
      setFavouriteNote(res.notes);
    } catch (error) {
      console.log("this error is coming from handle set Favourite Notes");
    } finally {
      setNoteLoading(false);
    }
  }

  useEffect(() => {
    handleFavouriteNotes();
  }, []);

  if (noteLoading) {
    return (
      <div className="loader-container-page">
        <div className="page-loader"></div>
      </div>
    );
  }

  return (
    <div className="allnotes-container">
      <div className="allnotes-container-top">
        <h1>Favourite Notes</h1>
        <button className="btn-style" onClick={() => setSeegraph(!seegraph)}>
          {seegraph ? "Back To Notes" : "See In Graph"}
        </button>
      </div>
      <div className="note-cards">
        {seegraph ? (
          <OMNIGraph noteData={favouriteNote} />
        ) : favouriteNote?.length > 0 ? (
          favouriteNote.map((note) => (
            <NoteCard key={note._id} noteData={note} />
          ))
        ) : (
          <p>No favourite notes yet!</p>
        )}
      </div>
    </div>
  );
};

export default Favourite;
