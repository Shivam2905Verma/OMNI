import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import bear from "../../../assets/bear.png";
import menu from "../../../assets/menu.gif";
import "../style/notes.scss";
import {
  getPillars,
  getSaveFolderColorNames,
  getStickyNotes,
  saveFolderColorNames,
  searchData,
} from "../service/note.api";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { NoteContext } from "../NoteProvider";
import NoteSidebar from "../components/NoteSideBar";
import AddFolder from "../components/AddFolder";
import MenuBarMobile from "../components/MenuBarMobile";
import AddNote from "../components/AddNote";

const DEFAULT_COLORS = [
  { color: "#f87171", name: "" },
  { color: "#fbbf24", name: "" },
  { color: "#60a5fa", name: "" },
  { color: "#34d399", name: "" },
  { color: "#9297fb", name: "" },
];

const Notes = () => {
  const user = useSelector((state) => state.auth.user);
  const laoding = useSelector((state) => state.auth.loading);
  const {
    noteLoading,
    setNoteLoading,
    showAddNote,
    setshowAddNote,
    pillarNameRef,
    setSearchedData,
    searchInput,
    setSearchInput,
  } = useContext(NoteContext);
  const [allpillar, setAllpillar] = useState();
  const [showAddFolder, setshowAddFolder] = useState(false);
  const [menuBarOpen, setMenuBarOpen] = useState(false);

  const [stickyNotes, setStickyNotes] = useState([]);
  const navigate = useNavigate();

  async function handleGetPillar() {
    try {
      setNoteLoading(true);
      const res = await getPillars();
      setAllpillar(res.pillars);
    } catch (error) {
      console.log("This error is comming from handleGetPillars");
    } finally {
      setNoteLoading(false);
    }
  }
  async function handleGetStickyNotes() {
    try {
      setNoteLoading(true);
      const res = await getStickyNotes();
      setStickyNotes(res.stickyNotes);
    } catch (error) {
      console.log("This error is comming from handle get sticky notes");
    } finally {
      setNoteLoading(false);
    }
  }

  // ------------- Side bar and menu bar functions ---------------------
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [isColorNameChange, setisColorNameChange] = useState(false);

  function handleNameChange(index, value) {
    const updated = colors.map((item, i) =>
      i === index ? { ...item, name: value } : item,
    );
    setColors(updated);
    setisColorNameChange(true);
  }

  async function handleSaveFolderColorNames() {
    try {
      const res = await saveFolderColorNames(colors);
      console.log(res);
      setisColorNameChange(false);
    } catch (error) {
      console.log("this error come from change folder color name");
    }
  }

  async function handleGetSaveFolderColorNames() {
    try {
      const res = await getSaveFolderColorNames();
      setColors(res.folderColorName.folderColors);
    } catch (error) {
      console.log("this error is come from getting folder color names");
    }
  }

  // ------------- Side bar and menu bar functions END---------------------

  async function handleSearch(e) {
    e.preventDefault();

    try {
      setNoteLoading(true);
      const res = await searchData(searchInput);
      setSearchedData(res.results);
      console.log(res);
    } catch (error) {
      console.log("This error is comming from handlesearch");
    } finally {
      setNoteLoading(false);
    }
  }

  useEffect(() => {
    if (!laoding && !user) {
      navigate("/login");
    }
  }, [user, laoding]);

  useEffect(() => {
    handleGetPillar();
    handleGetStickyNotes();
    handleGetSaveFolderColorNames();
  }, []);

  if (user && user.verified === false) {
    return (
      <div className="verify-page">
        <div className="verify-card">
          <h2>Email Verification Required</h2>
          <p>Please verify your profile from the email we sent you.</p>
          <img src={bear} alt="" />
        </div>
      </div>
    );
  }

  return (
    <div className="note-container">
      
      <AddNote value={{ pillarNameRef, showAddNote, setshowAddNote  , handleGetPillar}} />
      <AddFolder value={{ showAddFolder, setshowAddFolder, setAllpillar }} />
      <MenuBarMobile
        value={{
          setMenuBarOpen,
          menuBarOpen,
          colors,
          isColorNameChange,
          setStickyNotes,
          setshowAddFolder,
          handleNameChange,
          handleSaveFolderColorNames,
          handleGetSaveFolderColorNames,
        }}
      />
      <div className="note-container-left">
        <NoteSidebar
          values={{
            colors,
            setColors,
            isColorNameChange,
            setisColorNameChange,
            setStickyNotes,
            setshowAddFolder,
            handleNameChange,
            handleSaveFolderColorNames,
            handleGetSaveFolderColorNames,
            handleSearch,
          }}
        />
      </div>
      <div className="note-container-right">
        <div className="note-container-right-top">
          <h1>MY NOTES</h1>
          <form
            onSubmit={(e) => {
              navigate(`/notes/search/${searchInput}`);
              handleSearch(e);
            }}
            className="note-container-search"
          >
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-style"
              type="text"
              placeholder="search"
              required
            />
            <button className="btn-style">search</button>
          </form>
          <div
            onClick={() => setMenuBarOpen(true)}
            className="note-container-menu"
          >
            <img src={menu} alt="" />
          </div>
        </div>
        <div className="note-container-right-bottom">
          <Outlet
            context={{
              showAddNote,
              setshowAddNote,
              allpillar,
              noteLoading,
              setNoteLoading,
              stickyNotes,
              setStickyNotes,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;
