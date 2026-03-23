import { useState, useEffect, useRef } from "react";
import "../../style/papernote.scss";

const PaperNote = ({
  handleSaveStickyNote,
  noteId,
  noteContent,
  noteTitle,
  noteDate,
}) => {
  const [topic, setTopic] = useState("");
  const [note, setNote] = useState("");
  const [lines, setLines] = useState(4);
  const textareaRef = useRef(null);
  const LINE_H = 36;

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newLines = Math.max(4, Math.ceil(el.scrollHeight / LINE_H));
    setLines(newLines);
    el.style.height = newLines * LINE_H + "px";
  }

  useEffect(() => {
    autoResize();
  }, [note]);

  useEffect(() => {
    if (noteTitle) setTopic(noteTitle);
    if (noteContent) setNote(noteContent);
  }, [noteTitle, noteContent]);

  return (
    <div className="paper">
      <div className="paper-content">
        <div className="date-label">{noteDate ? noteDate : date}</div>

        <div className="topic-area">
          <input
            className="topic-input"
            type="text"
            placeholder="Topic / Title..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={80}
          />
        </div>

        <div className="lines-area">
          <div className="lines-bg">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="line-rule" />
            ))}
          </div>
          <textarea
            ref={textareaRef}
            className="lined-textarea"
            placeholder="Start writing here..."
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              autoResize();
            }}
          />
        </div>
      </div>

      <div className="paper-footer">
        <button
          className="save-btn"
          onClick={() => handleSaveStickyNote(topic, note, noteId)}
        >
          Save note
        </button>
      </div>
    </div>
  );
};

export default PaperNote;
