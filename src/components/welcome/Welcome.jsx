import React from 'react'
import './welcome.css'
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useMyContext } from "../../BackgroundController";

const Welcome = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const background = localStorage.getItem('background');
  const [backgroundColor, setBackground] = useState(background || null);
  const containerClasses = `container ${backgroundColor}`;
  const { state, dispatch } = useMyContext();

  if (token) {
    return <Navigate to="/dashboard" />
  }
  const handleBackground = () => {
    if (background === 'dark') {
      localStorage.setItem('background', 'light');
      setBackground('light');
    } else {
      localStorage.setItem('background', 'dark');
      setBackground('dark');
    }
  }
  const mainBackground = () => {
    const newBackground = state.background === "light" ? "dark" : "light";

    dispatch({ type: "UPDATE_BACKGROUND", payload: newBackground });
  };
  return (
    <div className={`container ${state.background}`}>
      <div className="nav">
        <div className="links">
          <div className="logo">
            <Link to="/"><h2>Social Media App</h2></Link>
          </div>
          <div className="buttons">
            <ul>
              <li className='them'>
                <button onClick={mainBackground}><DarkModeOutlinedIcon  /></button>
              </li>
              <li className='login'>
                <Link to="/login">Login</Link>
              </li>
              <li className='register'>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="left">
          <div className="title">
            <div className="emoji">
              <img src="./images/icons8-waving-hand-emoji-48.png" alt="" />
            </div>
            <div className="welcome">
              <h2>Connect. Share. Network. Welcome to Social Meida App</h2>
              <p>The Social Media Platform for Building Professional Connections</p>
            </div>
            <div className="button">
              <button>Get Started !</button>
            </div>
          </div>
        </div>
        <div className="right">
          <img src="../images/Allura - UI Windows.png" alt="" />
        </div>
      </div>
      
    </div>
  )
}

export default Welcome