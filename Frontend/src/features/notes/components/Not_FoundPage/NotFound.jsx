import "../../style/notfound.scss"
import bear from "../../../../assets/bearForNotFound.png"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <div className="bear-wrapper">
          <img src={bear} alt="Lost bear" className="bear-img" />
        </div>
        <h1 className="notfound-code">404</h1>
        <p className="notfound-message">
          Are you lost? Don't worry, let me lead you back to the right path.
        </p>
        <Link to="/notes" className="notfound-link">
          Take me back →
        </Link>
      </div>
    </div>
  )
}

export default NotFound