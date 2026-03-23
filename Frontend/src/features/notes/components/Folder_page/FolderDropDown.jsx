import { setFolderColorfunc } from "../../service/note.api";

const FolderDropDown = ({ value }) => {
  const {
    COLORS,
    dropDown,
    setDropDown,
    folderColor,
    setFolderColor,
    pillarId,
  } = value;

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

  return (
    <div className="folder-dropdown-container">
      <div
        className="folder-dropdown"
        style={{ display: dropDown ? "flex" : "none" }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
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
              <i
                className="ri-check-line"
                style={{ color: color.icon }} // tick uses icon color
              />
            )}
          </div>
        ))}
      </div>

      <i
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setDropDown(!dropDown);
        }}
        className="ri-more-line"
      />
    </div>
  );
};

export default FolderDropDown;
