import { Routes, Route } from "react-router-dom";
import Login from "./features/auth/page/Login";
import Register from "./features/auth/page/Register";
import Home from "./features/Home/page/Home";
import Notes from "./features/notes/page/Notes";
import NotesHome from "./features/notes/components/Folder_page/NotesHome";
import { NoteProvider } from "./features/notes/NoteProvider";
import DetailNote from "./features/notes/components/Detail_NotePage/DetailNote";
import AllNotes from "./features/notes/components/Notes_Page/AllNotes";
import Favourite from "./features/notes/components/Favourite_page/Favourite";
import Search from "./features/notes/components/Searched_page/Search";
import NotFound from "./features/notes/components/Not_FoundPage/NotFound";

function BrowserApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/notes"
        element={
          <NoteProvider>
            <Notes />
          </NoteProvider>
        }
      >
        <Route index element={<NotesHome />} />
        <Route path="search/:search" element={<Search />} />
        <Route path="favourite-notes" element={<Favourite />} />
        <Route path=":pillarId" element={<AllNotes />} />
        <Route path=":pillarId/note/:noteId" element={<DetailNote />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default BrowserApp;
