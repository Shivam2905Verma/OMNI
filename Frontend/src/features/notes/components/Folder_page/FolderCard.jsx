import { Link } from "react-router-dom";
import { useState } from "react";
import FolderDropDown from "./FolderDropDown";

const FolderCard = ({ pillarName, pillarId, pillarColor }) => {
  const [dropDown, setDropDown] = useState(false);
  const COLORS = [
    { bg: "#fed6d5", icon: "#f87171" },
    { bg: "#fefced", icon: "#fbbf24" },
    { bg: "#dff0ff", icon: "#60a5fa" },
    { bg: "#d4f5dc", icon: "#34d399" },
    { bg: "#ecdeff", icon: "#9297fb" },
  ];

  const [folderColor, setFolderColor] = useState(() =>
    pillarColor ? pillarColor[0] : COLORS[1],
  );

  return (
    <Link
      className="folder-card-container"
      style={{ background: folderColor.bg }}
      to={`/notes/${pillarId}`}
    >
      <div className="folder-card-top">
        <i
          className="ri-sticky-note-fill"
          style={{ color: folderColor.icon }} 
        />

        <FolderDropDown
          value={{
            COLORS,
            dropDown,
            setDropDown,
            folderColor,
            setFolderColor,
            pillarId,
          }}
        />
      </div>
      <div className="folder-card-bottom">{pillarName}</div>
    </Link>
  );
};

export default FolderCard;
