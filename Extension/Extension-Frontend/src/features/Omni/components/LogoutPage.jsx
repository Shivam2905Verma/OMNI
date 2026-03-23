import "../style/omni.scss";
import gostimg from "../../../assets/ghost (1).png";

const LogoutPage = () => {

  return (
    <div className="logedOut-container">
      <div className="logedOut-box">
        <h3>You're currently a ghost. Log in to become a real human.</h3>
        <a
          href="http://localhost:5174/login"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          <button className="btn-style">
            Login
          </button>
        </a>
        <img className="ghostImg" src={gostimg} alt="/ghost photo" />
      </div>
    </div>
  );
};

export default LogoutPage;
