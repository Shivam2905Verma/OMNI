import "../style/auth.scss";
import backarrow from "../../../assets/back.png";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setUser } from "../auth.slice";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";


const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate();

  const dispatch = useDispatch();

 async function handleRegister(e) {
  e.preventDefault();
  try {
    dispatch(setLoading(true));
    const res = await register(email.trim(), username.trim(), password.trim());
    if (res.success) {
      dispatch(setUser(res.user));
      toast.success(res.message);
      navigate("/");
    }else{
      dispatch(setError(res.message));
         toast.error(res.message);
      return;
    }
  } catch (error) {
    dispatch(setError(error.message || "Registration failed"));
    console.log("this error come from register");
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
        <h2>Register</h2>
        <form>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-style"
            type="text"
            placeholder="Email..."
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-style"
            type="text"
            placeholder="Username.."
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-style"
            type="text"
            placeholder="Password..."
          />
          <p>{error ? error : ""}</p>
          <button onClick={(e) => handleRegister(e)} className="btn-style">
            {loading ? <div className="loadingspinner" /> : "Register"}
          </button>
        </form>
      </div>
      <div onClick={() => {
        navigate("/login")
        dispatch(setError(null));
        }} className="auth-travel">
        <p>Do you already have Account ?</p>
        <Link>
          <h4>Login</h4>
        </Link>
      </div>
    </div>
  );
};

export default Register;
