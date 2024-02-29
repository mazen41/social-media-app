import React, { useState, useEffect, useContext } from "react";
import "./nav_bar.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import NotificationsNoneOutLinedIcon from '@mui/material/NotificationsNoneOutLinedIcon'
import { Link, Navigate, useNavigate } from "react-router-dom";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import servicesApi from "../api/api";
import axios from "axios";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useMyContext } from "../../BackgroundController";
import { userImageURL } from "../api/users_image";

const NavBar = ({ updatedInformation }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [image, setImage] = useState("");
  const [className, setClassName] = useState("");
  const [notificationClass, setNotificationClass] = useState("");
  const userData = JSON.parse(localStorage.getItem("user"));
  const [userInformation, setUserInformation] = useState(userData);
  const navigate = useNavigate();
  const bearerToken = localStorage.getItem("token");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPopup, setSearchPopup] = useState(false);
  const { state, dispatch } = useMyContext();
  const [userError, setUserError] = useState(false);
  const mainBackground = () => {
    const newBackground = state.background === "light" ? "dark" : "light";

    dispatch({ type: "UPDATE_BACKGROUND", payload: newBackground });
  };
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = debounce(async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      if (searchQuery.trim() === "") {
        setResults([]);
      } else {
        const response = await servicesApi.get(
          `/api/user/search/${searchQuery}`
        );
        if (response.data.length > 0) {
          setResults(response.data);
        } else {
          setUserError(true);
        }
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("An error occurred while fetching search results");
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleSettings = () => {
    navigate("/settings");
  };
  const handleProfile = () => {
    navigate(`/profile/${userInformation.id}`);
  };
  const handleUserSearch = (userId) => {
    navigate(`/profile/${userId}`);
    setQuery("");
    setResults("");
    window.location.reload();
  };
  const handleClassName = () => {
    if (className == "active") {
      setClassName("");
    } else {
      setClassName("active");
      setNotificationClass("");
    }
  };
  const logout = async (e) => {
    e.preventDefault();
    try {
      await servicesApi.get("/sanctum/csrf-cookie");

      const response = await servicesApi.post("api/logout", {user_id: userInformation.id});

      if (response && response.status === 200) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("imageUrl");
        navigate("/");
        window.location.reload();
      } else {
        console.error("Logout request failed. Response:", response);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const handleDashboard = () => {
    navigate("/dashboard");
  };
  const handleNotifications = () => {
    if (notificationClass == "active") {
      setNotificationClass("");
    } else {
      setNotificationClass("active");
      setClassName("");
    }
  };

  useEffect(() => {
    const imageLocation = localStorage.getItem("imageUrl");
    if (imageLocation) {
      setImage(imageLocation);
    }
  }, []);
  const handleSearchPopup = () => {
    var input = document.getElementById("search");
    const computedStyles = window.getComputedStyle(input);

    if (computedStyles.display == "none") {
      setSearchPopup(true);
    } else {
      return null;
    }
  };
  const handleCloseSearch = () => {
    setSearchPopup(false);
  };
  return (
    <div className="navbar">
      <div className={`nav ${state.background}`}>
        <div className="right">
          {searchPopup !== true ? (
            <div onClick={handleDashboard} className="logo">
              <h2>Social Media App</h2>
            </div>
          ) : null}
          {searchPopup !== true ? (
            <div className="search">
              <input
                type="text"
                name="search"
                placeholder="Search User"
                value={query}
                onChange={handleChange}
                id="search"
              />
              <span onClick={handleSearchPopup}>
                <SearchIcon />
              </span>
              {loading && !results && <p>Loading...</p>}

              {error && <p style={{ color: "red" }}>{error}</p>}

              {results && results.length > 0 && query
                ? results.map((user) => (
                    <div className="users" key={user.id}>
                      <div
                        className="user"
                        onClick={() => handleUserSearch(user.id)}
                      >
                        {
                          user.image ? (
                            <img src={`${userImageURL}${user.image}`} />
                          ) : (
                            <img src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}/>
                          )
                        }
                        <p>{user.name}</p>
                      </div>
                    </div>
                  ))
                : userError && query && <p>No results found</p>}
            </div>
          ) : null}
          {searchPopup && (
            <div className="searchPopup">
              <div className="search_popup">
                <span style={{ cursor: "pointer" }} onClick={handleCloseSearch}>
                  <ArrowBackOutlinedIcon />
                </span>
                <div className="input">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search User"
                    value={query}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* {results &&
                results.map((user) => (
                  <div className="users" key={user.id}>
                    <div
                      className="user"
                      onClick={() => handleUserSearch(user.id)}
                    >
                      {image && (
                        <img
                          src={`${userImageURL}${user.image}`}
                          alt="Uploaded Image"
                        />
                      )}
                      <p>{user.name}</p>
                    </div>
                  </div>
                ))} */}
              {results && results.length > 0
                ? results.map((user) => (
                    <div className="users" key={user.id}>
                      <div
                        className="user"
                        onClick={() => handleUserSearch(user.id)}
                      >
                        {image && (
                          <img
                            src={`${userImageURL}${user.image}`}
                            alt="Uploaded Image"
                          />
                        )}
                        <p>{user.name}</p>
                      </div>
                    </div>
                  ))
                : userError && query && <p>No results found</p>}
            </div>
          )}
        </div>
        <div className="left">
          <ul>
            <li className="them">
              {/* <span onClick={changeBackground}><NotificationsNoneOutlinedIcon /></span> */}
              <span onClick={mainBackground}>
                <DarkModeOutlinedIcon />
              </span>
            </li>

            <div className="user">
              <div className="information" onClick={handleClassName}>
                {userInformation && (
                  <img
                    // src={`${userImageURL}${updatedInformation ? updatedInformation.image : userInformation.image}`}
                    src={`${userImageURL}${
                      updatedInformation && updatedInformation.image
                        ? updatedInformation.image
                        : userInformation && userInformation.image
                        ? userInformation.image
                        : "icons8-profile-picture-50-removebg-preview.png"
                    }`}
                    alt="Uploaded Image"
                  />
                )}
                <span>
                  <ArrowDropDownIcon />
                </span>
              </div>
              <ul className={className}>
                <li onClick={handleProfile}>Profile</li>
                {/* <Link to={`profile/${userInformation.id}`}>Profile</Link> */}
                <div className="line"></div>
                <li onClick={handleSettings}>Settings</li>
                <div className="line"></div>
                {/* <form onSubmit={logout}> */}
                <li onClick={logout} className="logout">
                  Logout
                </li>
                {/* </form> */}
              </ul>
            </div>
          </ul>
        </div>
      </div>
      <div className="line"></div>
    </div>
  );
};
export default NavBar;
