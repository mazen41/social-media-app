import React from 'react'
import './register.css'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import servicesApi from '../api/api';
import { Navigate } from 'react-router-dom';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useMyContext } from "../../BackgroundController";

const Register = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Initialize token from local storage
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [image, setImage] = useState('');
  const navigate = useNavigate();
  const background = localStorage.getItem('background');
  const containerClasses = `register_container ${background}`;
  const [backgroundColor, setBackground] = useState(background);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [showError, setShowError] = useState(false); 
  const [allErrors, setAllErrors] = useState('');
  const { state, dispatch } = useMyContext();

  if (token) {
    return <Navigate to="/dashboard" />
  }
  const mainBackground = () => {
    const newBackground = state.background === "light" ? "dark" : "light";

    dispatch({ type: "UPDATE_BACKGROUND", payload: newBackground });
  };
  const handleBackground = () => {
    if (background === 'dark') {
      localStorage.setItem('background', 'light');
      setBackground('light');
    } else {
      localStorage.setItem('background', 'dark');
      setBackground('dark');
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirmation);
      if(image) {
        formData.append('image', image); 
      }
      // await servicesApi.get('/sanctum/csrf-cookie');

      const response = await servicesApi.post('api/register', formData);

      if (response.status === 201) {
        localStorage.setItem('token', response.data.response.token);
        localStorage.setItem('user', JSON.stringify(response.data.response.user));
        localStorage.setItem('imageUrl', response.data.imagePath)
        navigate('/dashboard')
        
      } else {
        console.log('Registration failed:', response.data);
      }
    } catch (error) {
      console.log(error)
      if (error.response.data.errors.email[0] !== "") {
        setEmailError(error.response.data.errors.email[0]);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
          setEmailError(''); 
        }, 5000);
      }
      if (error.response.data.errors.password[0] !== "") {
        setPasswordError(error.response.data.errors.password[0])
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
          setPasswordError('');
        }, 5000);
      }

      if (error.response.data.errors.name !== "") {
        setAllErrors(error.response.data.errors.name);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
          setAllErrors(''); 
        }, 5000);
      }
      
    }
  }
  return (
    <div className={`register_container ${state.background}`}>
      <div className="register_nav">
        <div className="links">
          <div className="logo">
            <Link to="/"><h2>Social Media App</h2></Link>
          </div>
          <div className="buttons">
            <ul>
              <li className='them'>
                <button onClick={mainBackground}><DarkModeOutlinedIcon /></button>
              </li>
              <li className='login'>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="left">
          <div className="title">
            <h2>Sign up</h2>
          </div>
          <form onSubmit={handleRegister}>
            <div className="input">
              <input type="text" placeholder="Uesrname" name="name" value={name} onChange={(e) => setName(e.target.value)} />
              {
                allErrors && (
                  <div className="error">
                    <p>{allErrors}</p>
                  </div>
                )
              }
            </div>
            <div className="input">
              <input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {
                emailError && (
                  <div className="error">
                    <p>{emailError}</p>
                  </div>
                )
              }
            </div>
            <div className="input">
              <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="input">
              <input type="password" placeholder="Rewrite Password" name="password_confirmation" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
              {
                passwordError && (
                  <div className="error">
                    <p>{passwordError}</p>
                  </div>
                )
              }
            </div>
            <div className="input">
              <input type="file" name="image"  onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="button">
              <button type="submit">Sign up</button>
            </div>
          </form>
        </div>
        <div className='right'>
          <img src="./undraw_button_style_re_uctt.svg" alt="" style={{ "width": "600px" }} />
        </div>
      </div>
    </div>
  )
}

export default Register;