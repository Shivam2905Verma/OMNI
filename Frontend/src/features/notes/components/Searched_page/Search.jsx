import { useState } from "react";
import OMNIGraph from "../Graph/OMNIGraph";
import NoteCard from "../Notes_Page/NoteCard";
import { useContext } from "react";
import { NoteContext } from "../../NoteProvider";

const Search = () => {
  const { noteLoading, searchedData, setNoteData } = useContext(NoteContext);
  const [seegraph, setSeegraph] = useState(false);

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
        <h1>Search</h1>
        <div>
          <button className="btn-style" onClick={() => setSeegraph(!seegraph)}>
            {seegraph ? "Back To Notes" : "See In Graph"}
          </button>
        </div>
      </div>
      <div className="note-cards">
        {seegraph ? (
          <OMNIGraph noteData={searchedData} />
        ) : (
          searchedData?.map((note) => (
            <NoteCard
              key={note._id}
              noteData={note}
              setNoteData={setNoteData}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
