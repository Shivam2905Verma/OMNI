import { useState } from "react";
import {
  deleteFolder,
  setFolderColorfunc,
  updatePillarNameAPI,
} from "../../service/note.api";
import ConfirmModal from "../ConfirmationBox";

const FolderDropDown = ({ value }) => {
  const {
    setAllpillar,
    pillarName,
    COLORS,
    dropDown,
    setDropDown,
    folderColor,
    setFolderColor,
    pillarId,
  } = value;

  const [updatePillarName, setUpdatePillarName] = useState(pillarName);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const description = `You are about to delete ${pillarName}`;
  const warning = `All notes inside will also be deleted.`;

  async function handleSetFolderColor(e, pillarId, color) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await setFolderColorfunc(pillarId, color);
      console.log(res);
    } catch (error) {
      console.log(" this is error from handle set folder color");
    }
  }

  async function handledeleteFolder() {
    try {
      const res = await deleteFolder(pillarId);

      setAllpillar((prev) => prev.filter((pillar) => pillar._id !== pillarId));
    } catch (error) {
      console.log(" this is error from handle set folder color");
    }
    setConfirmationOpen(false);
  }

  async function handleOnCancelDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmationOpen(false);
  }

  async function handleUpdatePillarName(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await updatePillarNameAPI(pillarId, updatePillarName);
      console.log(res);
      setDropDown(false);
    } catch (error) {
      console.log(" this is error from update Pillar Name ", error);
    }
  }

  return (
    <div className="folder-dropdown-container">
      <div
        className="folder-dropdown"
        style={{ display: dropDown ? "block" : "none" }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="folder-dropdown-colors-container">
          {COLORS.map((color) => (
            <div
              key={color.bg}
              className="color-circle"
              style={{ background: color.bg }}
              onClick={(e) => {
                setFolderColor(color);
                setDropDown(false);
                handleSetFolderColor(e, pillarId, color);
              }}
            >
              {folderColor.bg === color.bg && (
                <i className="ri-check-line" style={{ color: color.icon }} />
              )}
            </div>
          ))}
        </div>
        <div className="folder-dropdown-update-delete">
          <input
            className="input-style"
            type="text"
            maxLength={30}
            placeholder="Update Folder name..."
            value={updatePillarName}
            onChange={(e) => setUpdatePillarName(e.target.value)}
          />

          <div className="folder-dropdown-update-delete-btns">
            <button
              onClick={(e) => {
                handleUpdatePillarName(e, pillarId);
                console.log("click");
              }}
              className="folder-dropdown-update-btn btn-style"
            >
              Update
            </button>
            <button
              onClick={() => setConfirmationOpen(true)}
              className="folder-dropdown-delete-btn btn-style"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <i
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setDropDown(!dropDown);
        }}
        className="ri-more-line"
      />

      {confirmationOpen ? (
        <ConfirmModal
          onConfirm={handledeleteFolder}
          onCancel={handleOnCancelDelete}
          warning={warning}
          description={description}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default FolderDropDown;
