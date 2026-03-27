import { useOutletContext } from "react-router-dom";
import FolderCard from "./FolderCard";
import PaperNote from "./PaperNote";
import { saveStickyNote } from "../../service/note.api";
import { toast } from "react-toastify";
import OMNIGraph from "../Graph/OMNIGraph";
import { useState } from "react";

const NotesHome = () => {
  const {
    allNotes,
    allpillar,
    setAllpillar,
    noteLoading,
    stickyNotes,
    showAddNote,
    setshowAddNote,
  } = useOutletContext();

  const [seeGraph, setSeeGraph] = useState(false);

  if (noteLoading) {
    return (
      <div className="loader-container-page">
        <div className="page-loader"></div>
      </div>
    );
  }

  async function handleSaveStickyNote(topic, content, noteId) {
    if (!content.trim()) {
      toast.error("Please write something before saving!");
      return;
    }

    try {
      const res = await saveStickyNote(topic, content, noteId);
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      console.log("this error is coming from the handle save sticky note");
    }
  }

  return (
    <div className="note-container-pillars">
      <div className="note-container-folders-top">
        <h2>Folders</h2>
        <div>
          <button onClick={() => setshowAddNote(true)} className="btn-style">
            Add Note
          </button>
          <button onClick={() => setSeeGraph(!seeGraph)} className="btn-style">
            {seeGraph ? "Back to Folders" : "See Graph"}
          </button>
        </div>
      </div>
      {seeGraph ? (
        <OMNIGraph noteData={allNotes} />
      ) : (
        <>
          <div className="note-container-folders">
            <div className="note-container-folders-box">
              {allpillar?.map((pillar) => {
                return (
                  <FolderCard
                    key={pillar._id}
                    pillarName={pillar.pillar}
                    pillarId={pillar._id}
                    pillarColor={pillar.color}
                    allpillar={allpillar}
                    setAllpillar={setAllpillar}
                  />
                );
              })}
            </div>
          </div>
          <div className="note-containe-stickyNotes">
            <h2>My Sticky Notes</h2>
            <div className="paper-wrap">
              {stickyNotes?.map((note, idx) => (
                <PaperNote
                  key={idx}
                  noteId={note._id}
                  noteContent={note.content}
                  noteTitle={note.topic}
                  noteDate={note.date}
                  handleSaveStickyNote={handleSaveStickyNote}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotesHome;
