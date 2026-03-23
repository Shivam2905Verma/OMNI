import "../style/home.scss";
import NavBar from "../components/NavBar";
import { logout } from "../../auth/services/auth.api";
import { setUser } from "../../auth/auth.slice";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();

  async function handleLogout() {
    try {
      const res = await logout();
      dispatch(setUser(null));

      console.log(res);
    } catch (error) {
      console.log("This error is comming from logout");
    }
  }

  return (
    <div className="home-container">
      <NavBar value={{ handleLogout }} />
    </div>
  );
};

export default Home;
