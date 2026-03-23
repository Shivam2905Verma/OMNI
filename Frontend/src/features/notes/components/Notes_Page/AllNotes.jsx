import { useContext } from "react";
import { NoteContext } from "../../NoteProvider";
import NoteCard from "./NoteCard";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import OMNIGraph from "../Graph/OMNIGraph";
import { useState } from "react";

const AllNotes = () => {
  const { noteData, noteLoading, handleGetNotes } = useContext(NoteContext);
  const [seegraph, setSeegraph] = useState(false);

  const { pillarId } = useParams();

  useEffect(() => {
    handleGetNotes(pillarId);
  }, [pillarId]);

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
        <h1>Notes</h1>
        <button className="btn-style" onClick={() => setSeegraph(!seegraph)}>
          {seegraph ? "Back To Notes" : "See In Graph" }
        </button>
      </div>
      <div className="note-cards">
        {seegraph ? (
          <OMNIGraph noteData={noteData} />
        ) : (
          noteData?.map((note) => <NoteCard key={note._id} noteData={note} />)
        )}
      </div>
    </div>
  );
};

export default AllNotes;
