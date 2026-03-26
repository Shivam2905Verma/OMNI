import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { setfavouriteNote } from "../../service/note.api";

const NoteCard = ({ noteData }) => {
  const [liked, setLiked] = useState();

  async function HandleSetfavouriteNote(e, noteId, liked) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await setfavouriteNote(noteId, liked);
      console.log(res);
    } catch (error) {
      console.log("This error is coming from add favourite note");
    }
  }

  useEffect(() => {
    setLiked(noteData.favourite);
  }, []);

  return (
    <Link
      to={`/notes/${noteData.pillarId._id}/note/${noteData._id}`}
      className="note-card"
    >
      <div className="note-card-accent" />
      <div className="note-card-content">
        <p className="note-card-label">Sub-Topic</p>
        <h3 className="note-card-title">{noteData.subtopic}</h3>
        <p className="note-card-label" style={{ marginTop: "0.6rem" }}>
          Summary
        </p>
        <p className="note-card-summary">{noteData.summary}</p>
        {noteData.manualNote && (
          <>
            <p className="note-card-label" style={{ marginTop: "0.6rem" }}>
              Manual Note
            </p>
            <p className="note-card-summary">{noteData.manualNote}</p>
          </>
        )}
      </div>

      {/* Heart button */}
      <div
        className={`note-card-heart ${liked ? "liked" : ""}`}
        onClick={(e) => {
          const newLiked = !liked; 
          setLiked(newLiked); 
          HandleSetfavouriteNote(e, noteData._id, newLiked); 
        }}
      >
        <i className={liked ? "ri-heart-3-fill" : "ri-heart-3-line"}></i>
      </div>
    </Link>
  );
};

export default NoteCard;
