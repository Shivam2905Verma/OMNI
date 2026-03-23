import { useContext, useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { NoteContext } from "../../NoteProvider";

const DetailNote = () => {
  const { noteData, handleGetNotes, noteLoading } = useContext(NoteContext);
  const { noteId } = useParams();
  const [detailNote, setDetailNote] = useState();

  const { pillarId } = useParams();

  useEffect(() => {
    handleGetNotes(pillarId);
  }, []);

  useEffect(() => {
    const note = noteData?.filter((e) => e._id == noteId);
    setDetailNote(() => {
      if (note) {
        return note[0];
      }
    });
  }, [noteData]);

  if (noteLoading) {
    return (
      <div className="loader-container-page">
        <div className="page-loader"></div>
      </div>
    );
  }

  return (
    <div className="detail-note-container">
      <h1>{detailNote?.subtopic}</h1>

      {detailNote?.imageurl && (
        <img src={detailNote?.imageurl} alt="Note Preview" />
      )}

      {detailNote?.url && (
        <h3>
          Saved Url:{" "}
          <a href={detailNote.url} target="_blank" className="url-text">
            {detailNote.url}
          </a>
        </h3>
      )}

      {detailNote?.manualNote && <h3>Manual Note: {detailNote?.manualNote}</h3>}

      <h3>Summary: {detailNote?.summary}</h3>

      <h3>Tags:</h3>
      <div className="tags-wrapper">
        {detailNote?.tags ? (
          detailNote.tags[0]
            .split(",")
            .map((tag, index) => <span key={index}>#{tag}</span>)
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DetailNote;
