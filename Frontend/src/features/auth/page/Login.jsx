import "../style/auth.scss";
import backarrow from "../../../assets/back.png";
import { Link, useNavigate } from "react-router-dom";
import { setError, setLoading, setUser } from "../auth.slice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { login } from "../services/auth.api";
import { useEffect, useState } from "react";

const Login = () => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);

  const dispatch = useDispatch();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await login(identity, password);
      dispatch(setUser(res.user));
      if (!res.success) {
        dispatch(setError(res.message));
      }
      if (user) {
        navigate("/");
        dispatch(setError(null));
      }
    } catch (error) {
      dispatch(setError(error));
      console.log("this error come from login", error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="auth-container">
      <div onClick={() => navigate("/")} className="auth-back-home">
        <img src={backarrow} alt="" />
        <h3>Home</h3>
      </div>
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={(e) => handleLogin(e)}>
          <input
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            className="input-style"
            type="text"
            placeholder="Email or username.."
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-style"
            type="text"
            placeholder="Password..."
            required
          />
          <p>{error ? error : ""}</p>
          <button className="btn-style">
            {loading ? <div className="loadingspinner" /> : "Login"}
          </button>
        </form>
      </div>
      <div
        onClick={() => {
          navigate("/register");
          dispatch(setError(null));
        }}
        className="auth-travel"
      >
        <p>Don't have account ?</p>
        <Link>
          <h4>Register</h4>
        </Link>
      </div>
    </div>
  );
};

export default Login;
