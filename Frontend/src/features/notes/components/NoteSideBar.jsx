import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userprofile from "../../../assets/userprofile.png";

const NoteSidebar = ({ values }) => {
  const {
    colors,
    isColorNameChange,
    setStickyNotes,
    setshowAddFolder,
    handleNameChange,
    handleSaveFolderColorNames,
  } = values;

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <div className="note-container-side-bar">
      <div
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
        className="side-bar-top"
      >
        <h1>OMNI</h1>
      </div>
      <div className="side-bar-middle">
        <div className="side-bar-colors">
          <button
            className={`btn-style side-bar-colors-btn ${isColorNameChange ? "visible" : ""}`}
            onClick={handleSaveFolderColorNames}
          >
            save colors
          </button>

          {colors.map((item, index) => (
            <div key={index} className="side-bar-colors-names">
              <div
                className="color-circle"
                style={{ background: item.color }}
              ></div>
              <input
                className="input-style"
                type="text"
                placeholder="F-Name"
                value={item.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div
          onClick={() => navigate("/notes")}
          className="side-bar-middle-option side-bar-home"
        >
          <i className="ri-home-fill"></i>
          <p>Home</p>
        </div>
        <div
          onClick={() => navigate("/notes/favourite-notes")}
          className="side-bar-middle-option side-bar-fav"
        >
          <i className="ri-star-fill"></i>
          <p>Favourite</p>
        </div>
        <div className="side-bar-divider"></div>
        <div
          onClick={() => setshowAddFolder(true)}
          className="side-bar-middle-option side-bar-addFolder"
        >
          <i className="ri-sticky-note-add-line"></i>
          <p>+ Folder</p>
        </div>
        <div
          className="side-bar-middle-option side-bar-addstickynote"
          onClick={() => setStickyNotes((prev) => [...prev, {}])}
        >
          <i className="ri-sticky-note-add-line"></i>
          <p>+ s-note</p>
        </div>
      </div>

      <div className="side-bar-bottom">
        <img src={userprofile} alt="" />
        <p>{user?.username}</p>
      </div>
    </div>
  );
};

export default NoteSidebar;
