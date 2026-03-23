import { useState } from "react";
import { addFolderFromWeb } from "../service/note.api";
import { toast } from "react-toastify";
const COLORS = [
  { bg: "#fed6d5", icon: "#f87171" },
  { bg: "#fefced", icon: "#fbbf24" },
  { bg: "#dff0ff", icon: "#60a5fa" },
  { bg: "#d4f5dc", icon: "#34d399" },
  { bg: "#ecdeff", icon: "#9297fb" },
];

const AddFolder = ({ value }) => {
  const { showAddFolder, setshowAddFolder, setAllpillar } = value;
  const [folderColor, setFolderColor] = useState(COLORS[0]);
  const [folderName, setFolderName] = useState("");

  async function handlesaveFolder(e, foldername, color) {
    e.preventDefault();
    try {
      const res = await addFolderFromWeb(foldername, color);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
        return;
      }
      setAllpillar((pre) => [...pre, res.pillar]);
      setshowAddFolder(false);
    } catch (error) {
      console.log("This error is coming from saving handle save Folder");
    }
  }

  return (
    <div
      onClick={() => setshowAddFolder(false)}
      className="Add-folder-box-overlay"
      style={
        showAddFolder
          ? { opacity: 1, visibility: "visible", transform: "scale(1)" }
          : { opacity: 0, visibility: "hidden", transform: "scale(0.50)" }
      }
    >
      <form
        onSubmit={(e) => handlesaveFolder(e, folderName, folderColor)}
        onClick={(e) => e.stopPropagation()}
        className="Add-folder-box"
      >
        <h1>Add a Folder</h1>
        <input
          required
          className="input-style"
          type="text"
          placeholder="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <div className="Add-folder-color-box">
          {COLORS.map((color) => (
            <div
              key={color.bg}
              className="color-circle"
              style={{ background: color.bg }}
              onClick={(e) => {
                setFolderColor(color);
              }}
            >
              {" "}
              {folderColor.bg === color.bg && (
                <i
                  className="ri-check-line"
                  style={{ color: color.icon }} // tick uses icon color
                />
              )}
            </div>
          ))}
        </div>
        <button className="btn-style">Create Folder</button>
      </form>
    </div>
  );
};

export default AddFolder;
