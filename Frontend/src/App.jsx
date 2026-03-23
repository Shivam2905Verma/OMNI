import { useDispatch } from "react-redux";
import BrowserApp from "./BrowserApp.jsx";
import { useEffect } from "react";
import { get_me } from "./features/auth/services/auth.api.js";
import { setLoading, setUser } from "./features/auth/auth.slice.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const dispatch = useDispatch();

  async function handleGet_me() {
    try {
      dispatch(setLoading(true));
      const res = await get_me();
      if (res) {
        dispatch(setUser(res.user));
      }
    } catch (error) {
      console.log("this error come form get-me");
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    handleGet_me();
  }, []);

  return (
    <>
      <ToastContainer />
      <BrowserApp />
    </>
  );
};

export default App;
