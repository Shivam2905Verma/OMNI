import { useSelector } from "react-redux";
import "../style/menubarmobile.scss";
import userprofile from "../../../assets/userprofile.png";
import { useNavigate } from "react-router-dom";

const MenuBarMobile = ({ value }) => {
  const {
    setMenuBarOpen,
    menuBarOpen,
    colors,
    isColorNameChange,
    setStickyNotes,
    setshowAddFolder,
    handleNameChange,
    handleSaveFolderColorNames,
  } = value;
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <div
      className="menuBar-mobile"
      style={menuBarOpen ? { right: "0%" } : { right: "-100%" }}
    >
      <div className="menuBar-mobile-top">
        <h1>Omni</h1>
        <i onClick={() => setMenuBarOpen(false)} className="ri-close-fill"></i>
      </div>

      <div className="menuBar-mobile-middle">
        <div className="menubar-colors">
          {colors.map((item, index) => (
            <div key={index} className="menu-colors-names">
              <div
                className="color-circle"
                style={{ background: item.color }}
              ></div>
              <input
                className="input-style"
                type="text"
                placeholder="Folder Name"
                value={item.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
              />
            </div>
          ))}

          <button
            className={`btn-style menu-colors-btn ${isColorNameChange ? "visible" : ""}`}
            onClick={handleSaveFolderColorNames}
          >
            save names
          </button>
        </div>
        <div
          onClick={() => {
            navigate("/notes");
            setMenuBarOpen(false);
          }}
          className="side-bar-middle-option side-bar-home"
        >
          <i className="ri-home-fill"></i>
          <p>Home</p>
        </div>
        <div
          onClick={() => {
            navigate("/notes/favourite-notes");
            setMenuBarOpen(false);
          }}
          className="side-bar-middle-option side-bar-fav"
        >
          <i className="ri-star-fill"></i>
          <p>Favourite</p>
        </div>

        <div className="menubar-mobile-divider"></div>
        <div
          onClick={() => {
            setshowAddFolder(true);
            setMenuBarOpen(false);
          }}
          className="side-bar-middle-option side-bar-addFolder"
        >
          <i className="ri-sticky-note-add-line"></i>
          <p>+ Folder</p>
        </div>
        <div
          className="side-bar-middle-option side-bar-addstickynote"
          onClick={() => {
            setStickyNotes((prev) => [...prev, {}]);
            setMenuBarOpen(false);
          }}
        >
          <i className="ri-sticky-note-add-line"></i>
          <p>+ note</p>
        </div>
      </div>
      <div className="side-bar-bottom">
        <img src={userprofile} alt="" />
        <p>{user?.username}</p>
      </div>
    </div>
  );
};

export default MenuBarMobile;
