import "../style/addnote.scss";
import dragDrop from "../../../assets/drag-and-drop.png";
import { useState } from "react";
import { genrateTagsAndSumaary, saveNoteData } from "../service/note.api";
import { toast } from "react-toastify";

const AddNote = ({ value }) => {
  const { showAddNote, setshowAddNote, handleGetPillar } = value;

  const [generateLoading, setgenerateLoading] = useState(false);
  const [addNoteLoading, setaddNoteLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const [manualNote, setManualNote] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [pillar, setPillar] = useState("");
  const [addNote_Response, setaddNote_Response] = useState();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;
    setFile(selectedFile);

    if (selectedFile.type === "text/plain") {
      const reader = new FileReader();

      reader.onload = (event) => {
        setFilePreview(event.target.result);
      };

      reader.readAsText(selectedFile);
    } else {
      const previewURL = URL.createObjectURL(selectedFile);
      setFilePreview(previewURL);
    }
  };

  const handleGenerate = async () => {
    setaddNote_Response(null);
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    } else {
      console.log(link);
      formData.append("content", link);
    }

    try {
      setgenerateLoading(true);
      const res = await genrateTagsAndSumaary(formData);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setSummary(res.generated.summary);
      setPillar(res.generated.pillar);
      setSubTopic(res.generated.subtopic);
      res?.generated.tags.forEach((tag) => {
        setTags((pre) => pre + " " + `, ${tag} `);
      });

      console.log(res);
      setTags(res.generated.tags);
      setaddNote_Response(res.generated);
    } catch (error) {
      console.log("this error come from handleGenerate");
      toast.error("There is a error in generating content");
    } finally {
      setgenerateLoading(false);
    }
  };

  async function handleSaveData(e) {
    e.preventDefault();
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }
    if (link) {
      formData.append("link", link);
    }

    if (manualNote) {
      formData.append("manualNote", manualNote);
    }
    formData.append("pillar", pillar);
    formData.append("subTopic", subTopic);
    formData.append("tags", tags);
    formData.append("summary", summary);

    try {
      setaddNoteLoading(true);
      const res = await saveNoteData(formData);
      console.log(res);
      setLink("");
      setManualNote("");
      setPillar("");
      setSubTopic("");
      setTags("");
      setSummary("");
      setFile(null);
      setFilePreview(null);
      setshowAddNote(false);
      if (res.success) {
        toast.success(res.message);
        handleGetPillar();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log("this error come from saveData");
    } finally {
      setaddNoteLoading(false);
    }
  }

  return (
    <div
      className="addnote-overlay"
      onClick={() => setshowAddNote(false)}
      style={
        showAddNote
          ? { opacity: 1, visibility: "visible", transform: "scale(1)" }
          : { opacity: 0, visibility: "hidden", transform: "scale(0.50)" }
      }
    >
      <div onClick={(e) => e.stopPropagation()} className="addnote-box">
        <div className="addnote-box-top">
          <h3>Add a note</h3>
          <p onClick={() => setshowAddNote(false)}>
            <i className="ri-close-large-line"></i>
          </p>
        </div>
        <label
          className="addnote-input-file-label"
          htmlFor="addnote-input-file"
        >
          {filePreview ? (
            file?.type === "application/pdf" ? (
              <iframe className="previewFile" src={filePreview}></iframe>
            ) : file?.type.startsWith("image/") ? (
              <img
                className="previewFile"
                src={filePreview}
                alt="preview"
                width="300"
              />
            ) : file?.type === "text/plain" ? (
              <textarea
                className="previewFile"
                value={filePreview}
                readOnly
                rows={10}
              />
            ) : null
          ) : (
            <>
              <img src={dragDrop} alt="" />
            </>
          )}
        </label>
        <input
          type="file"
          id="addnote-input-file"
          accept=".pdf,.txt,image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
            if (e.target.files) {
              setFilePreview(URL.createObjectURL(e.target.files[0]));
              handleFileChange(e);
            }
          }}
        />
        <p className="addnote-input-file-info">Select PDF,Photo ,.txt file</p>
        <input
          value={link}
          className="text-input input-style"
          type="text"
          placeholder={
            file
              ? "What should I remember about this document?"
              : "Feed me a link, or thought..."
          }
          onChange={(e) => setLink(e.target.value)}
        />
        <button className="btn-style" onClick={handleGenerate}>
          {generateLoading ? (
            <div className="loadingspinner" />
          ) : (
            "Generate Tags and get the summary"
          )}
        </button>

        <form
          onSubmit={(e) => handleSaveData(e)}
          className="addnote-response-container"
        >
          <input
            value={pillar}
            onChange={(e) => setPillar(e.target.value)}
            className="response-tags input-style"
            placeholder="Topic.."
            type="text"
            required
          />
          <input
            onChange={(e) => setSubTopic(e.target.value)}
            value={subTopic}
            className="response-tags input-style"
            placeholder="SubTopic.."
            type="text"
            required
          />
          <input
            onChange={(e) => setManualNote(e.target.value)}
            value={manualNote}
            className="response-manual-note input-style"
            placeholder="Any manual Note..."
            type="text"
          />
          <input
            onChange={(e) => setTags(e.target.value)}
            value={tags}
            className="response-tags input-style"
            placeholder="Tags must separate by ,"
            type="text"
            required
          />
          <textarea
            onChange={(e) => setSummary(e.target.value)}
            value={summary}
            placeholder="summary..."
            className="response-summary input-style"
            required
          ></textarea>
          <button className="btn-style">
            {addNoteLoading ? <div className="loadingspinner" /> : "Save data"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
