import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteNote, setfavouriteNote } from "../../service/note.api";
import ConfirmModal from "../ConfirmationBox";

const NoteCard = ({ noteData }) => {
  const [liked, setLiked] = useState();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const description = `You are about to delete`;
  const warning = `All notes inside will also be deleted.`;

  async function handleDeleteNote() {
    try {
      const res = await deleteNote(noteData._id)
      console.log(res)
    } catch (error) {
      console.log("This error is coming from handle Delete note")
    }
    setConfirmationOpen(false)
  }
  
  async function handleOnCancelDeleteNote(e) {
    e.preventDefault()
    e.stopPropagation()
    setConfirmationOpen(false)
  }

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
      <div className="note-card-btns">
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
        <div
          className={`note-card-heart ${liked ? "liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault()
            setConfirmationOpen(true);
          }}
        >
          <i className="ri-delete-bin-line"></i>
        </div>
      </div>

      {confirmationOpen ? (
        <ConfirmModal
          onConfirm={handleDeleteNote}
          onCancel={handleOnCancelDeleteNote}
          warning={warning}
          description={description}
        />
      ) : (
        <></>
      )}
    </Link>
  );
};

export default NoteCard;
