import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NoteContext } from "../../NoteProvider";

// ─── Helper: detect file type from URL ───────────────────────────────────────
const getFileType = (url) => {
  if (!url) return null;
  const lower = url.toLowerCase().split("?")[0];
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/)) return "image";
  if (lower.match(/\.pdf$/)) return "pdf";
  if (lower.match(/\.(txt|md|csv|log|json|xml|yaml|yml)$/)) return "text";
  return "unknown";
};

// ─── Text File Viewer — fetches content and shows in a textarea ───────────────
const TextFileViewer = ({ url }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchText = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const text = await res.text();
        setContent(text);
      } catch {
        setContent("Could not load file.");
      } finally {
        setLoading(false);
      }
    };
    fetchText();
  }, [url]);

  if (loading) return <p className="file-loading">Loading file…</p>;

  return (
    <textarea className="detail-note__textarea" value={content} readOnly />
  );
};

// ─── Media Block ─────────────────────────────────────────────────────────────
const MediaBlock = ({ url }) => {
  const type = getFileType(url);

  if (type === "pdf") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="detail-note__pdf-link"
      >
        📄 Open PDF ↗
      </a>
    );
  } else if (type === "text") {
    return <TextFileViewer url={url} />;
  } else {
    return (
     <div className="detail-note__image_container">
       <img src={url} alt="Note attachment" className="detail-note__image" />
    <a   href={url}
        target="_blank"
        rel="noreferrer"
        className="detail-note__pdf-link">{url}</a>
     </div> 
    );
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DetailNote = () => {
  const { noteData, handleGetNotes, noteLoading } = useContext(NoteContext);
  const { noteId, pillarId } = useParams();
  const [detailNote, setDetailNote] = useState();

  useEffect(() => {
    handleGetNotes(pillarId);
  }, []);

  useEffect(() => {
    const note = noteData?.find((e) => e._id == noteId);
    setDetailNote(note || null);
  }, [noteData, noteId]);

  if (noteLoading) {
    return (
      <div className="loader-container-page">
        <div className="page-loader" />
      </div>
    );
  }

  // Support both field names for backward compatibility
  const mediaUrl = detailNote?.fileurl || detailNote?.imageurl || null;

  return (
    <div className="detail-note-container">
      <h1>{detailNote?.subtopic}</h1>

      {/* ── Image / PDF link / Text textarea ── */}
      {mediaUrl && <MediaBlock url={mediaUrl} />}

      {detailNote?.url && (
        <h3>
          Saved Url:{" "}
          <a
            href={detailNote.url}
            target="_blank"
            rel="noreferrer"
            className="url-text"
          >
            {detailNote.url}
          </a>
        </h3>
      )}

      {detailNote?.manualNote && <h3>Manual Note: {detailNote.manualNote}</h3>}

      <h3>Summary: {detailNote?.summary}</h3>

      <h3>Tags:</h3>
      <div className="tags-wrapper">
        {detailNote?.tags ? (
          detailNote.tags[0]
            .split(",")
            .map((tag, index) => <span key={index}>#{tag.trim()}</span>)
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DetailNote;
