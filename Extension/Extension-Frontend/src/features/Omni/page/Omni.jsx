import "../style/omni.scss";
import { useContext } from "react";
import { OmniContext } from "../OmniProvider";
import dragDrop from "../../../assets/drag-and-drop.png";
import LogoutPage from "../components/LogoutPage";
import { get_me } from "../service/omni.api";
import { useEffect } from "react";

export const Omni = () => {
  const {
    user,
    setUser,
    data,
    summary,
    setSummary,
    tags,
    setTags,
    file,
    filePreview,
    setFilePreview,
    link,
    setLink,
    setFile,
    pillar,
    setPillar,
    subTopic,
    setSubTopic,
    manualNote,
    setManualNote,
    loading,
    handleFileChange,
    handleGenerate,
    handleSaveData,
  } = useContext(OmniContext);

  async function getMe() {
    try {
      const res = await get_me();
      console.log(res);
      setUser(res.user);
    } catch (error) {
      console.log("this error come from getMe in extension");
    }
  }

  useEffect(() => {
    getMe();
  }, []);

  return (
    <div className="omni-container">
      {user ? (
        <>
          <div className="omni-topheading">
            <h3>Omni</h3>
          </div>
          <div className="inputs">
            <label className="file-input-label" htmlFor="file-input">
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
            <p className="info">Select PDF,Photo ,.txt file </p>
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
            <input
              id="file-input"
              type="file"
              accept=".pdf,.txt,image/*"
              onChange={(e) => {
                setFile(e.target.files[0]);
                if (e.target.files) {
                  setFilePreview(URL.createObjectURL(e.target.files[0]));
                  handleFileChange(e);
                }
              }}
            />
            <button className="btn-style" onClick={handleGenerate}>
              {loading ? (
                <div className="spinner" />
              ) : (
                "Generate Tags and get the summary"
              )}
            </button>
            {data ? (
              <div className="response-container">
                <input
                  onChange={(e) => setPillar(e.target.value)}
                  value={pillar}
                  className="response-tags input-style"
                  placeholder="Topic.."
                  type="text"
                />
                <input
                  onChange={(e) => setSubTopic(e.target.value)}
                  value={subTopic}
                  className="response-tags input-style"
                  placeholder="SubTopic.."
                  type="text"
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
                  placeholder="tags..."
                  type="text"
                />
                <textarea
                  onChange={(e) => setSummary(e.target.value)}
                  value={summary}
                  placeholder="summary..."
                  className="response-summary input-style"
                ></textarea>
                <button className="btn-style" onClick={handleSaveData}>
                  {loading ? <div className="spinner" /> : "Save data"}
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <LogoutPage />
      )}
    </div>
  );
};
