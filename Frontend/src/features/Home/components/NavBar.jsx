import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../auth/auth.slice";

const NavBar = () => {
  const location = useLocation();
  const [style, setStyle] = useState({});

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const homeRef = useRef(null);

  const moveAnchor = (element, color) => {
    if (!element) return;

    setStyle({
      left: element.offsetLeft + "px",
      width: element.offsetWidth + "px",
      background: color,
    });
  };

  useEffect(() => {
    if (location.pathname === "/") {
      moveAnchor(homeRef.current);
    }
  }, [location]);

  return (
    <div className="navbar-container">
      <div className="navbar-right">
        <h2>Omni</h2>
      </div>

      <div className="navbar-left">
        <div className="anchor" style={style}></div>
        <NavLink
          ref={homeRef}
          className="nav-link"
          to="/"
          onMouseEnter={(e) => moveAnchor(e.target, "gray")}
          onMouseLeave={() => {
            if (location.pathname === "/") {
              moveAnchor(homeRef.current);
            }
          }}
        >
          Home
        </NavLink>
        <NavLink
          className="nav-link"
          to="/notes"
          onMouseEnter={(e) => moveAnchor(e.target, "gray")}
          onMouseLeave={() => {
            if (location.pathname === "/") {
              moveAnchor(homeRef.current);
            }
          }}
        >
          Notes
        </NavLink>

        {user ? (
          <NavLink
            className="nav-link nav-logout"
            onClick={() => {
              dispatch(setUser(null));
            }}
            onMouseEnter={(e) => moveAnchor(e.target, "red")}
            onMouseLeave={() => {
              if (location.pathname === "/") {
                moveAnchor(homeRef.current);
              }
            }}
          >
            LogOut
          </NavLink>
        ) : (
          <NavLink
            className="nav-link"
            to="/login"
            onMouseEnter={(e) => moveAnchor(e.target, "gray")}
            onMouseLeave={() => {
              if (location.pathname === "/") {
                moveAnchor(homeRef.current);
              }
            }}
          >
            Account
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default NavBar;
