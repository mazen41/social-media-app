import React from "react";
// import './login.css';
import "./login.css";
import { useState } from "react";
import servicesApi from "../api/api";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useMyContext } from "../../BackgroundController";

const Login = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const background = localStorage.getItem("background");
  const containerClasses = `login_container ${background}`;
  const [backgroundColor, setBackground] = useState(background);
  const navigate = useNavigate();
  const [loginErrors, setLoginErrors] = useState();
  const [errors, setErrors] = useState(false);
  const { state, dispatch } = useMyContext();

  const mainBackground = () => {
    const newBackground = state.background === "light" ? "dark" : "light";

    dispatch({ type: "UPDATE_BACKGROUND", payload: newBackground });
  };
  const handleBackground = () => {
    if (background === "dark") {
      localStorage.setItem("background", "light");
      setBackground("light");
    } else {
      localStorage.setItem("background", "dark");
      setBackground("dark");
    }
  };
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  const handelLogin = async (e) => {
    e.preventDefault();
    try {
      // await servicesApi.get("/sanctum/csrf-cookie");
      const response = await servicesApi.post("api/login", {
        email,
        password,
      });

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        if (response.data.imageUrl !== null) {
          localStorage.setItem("imageUrl", response.data.imageUrl);
        }
        navigate("/dashboard");
      } else {
        console.log("Login failed:", response);
      }
    } catch (error) {
      console.log(error);
      setErrors(true)
      if (error.response.data.errors) {
        setLoginErrors(error.response.data.errors);
      } else {
        setLoginErrors(null);
      }
      setTimeout(() => {
        setErrors(false)
      }, 5000);
    }
  };
  return (
    <div className={`login_container ${state.background}`}>
      <div className="login_nav">
        <div className="links">
          <div className="logo">
            <Link to="/">
              <h2>Social Media App</h2>
            </Link>
          </div>
          <div className="buttons">
            <ul>
              <li className="them">
                <button onClick={mainBackground}>
                  <DarkModeOutlinedIcon />
                </button>
              </li>
              <li className="login">
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="left">
          <div className="title">
            <h2>Login</h2>
          </div>
          <form onSubmit={handelLogin}>
            <div className="input">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors && (
              <div className="errors"
              style={{
                "display"  : "flex",
                "gap" : "12px",
                "flexDirection" : "column"
              }}
              >
                {loginErrors && Object.keys(loginErrors).length > 0 ? (
                  Object.keys(loginErrors).map((key) => {
                    const value = loginErrors[key];

                    // Check if the value is an array and has some specific condition
                    if (Array.isArray(value) && value.length > 0) {
                      // Do something with the value
                      return (
                        <div
                          key={key}
                          className="error"
                          style={{
                            borderRadius: "5px",
                            padding: "10px",
                            background: "#ffcccc",
                            color: "#990000",
                          }}
                        >
                          <p>{`${value[0]}`}</p>
                        </div>
                      );
                    }

                    return null;
                  })
                ) : (
                  <div
                    className="error"
                    style={{
                      borderRadius: "5px",
                      padding: "10px",
                      background: "#ffcccc",
                      color: "#990000",
                    }}
                  >
                    <p>The Email Or Password Is Incorecct</p>
                  </div>
                )}
              </div>
            )}
            <div className="button">
              <button type="submit">Sign up</button>
            </div>
          </form>
        </div>
        <div className="right">
          <img
            src="./undraw_button_style_re_uctt.svg"
            alt=""
            style={{ width: "600px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
