/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useContext } from "react";
import NavBar from "../navbar/NavBar";
import SideBar from "../sidebar/SideBar";
import "./settings.css";
import servicesApi from "../api/api";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import { userImageURL } from "../api/users_image";

const Settings = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userInformation, setUserInformation] = useState(user);
  const imageRef = useRef(null);
  const [popup, setPopup] = useState("none");
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirmation, setPasswordConfirmation] = useState();
  const [oldPassword, setOldPassword] = useState();
  const bearerToken = localStorage.getItem("token");
  const [showOverlay, setShowOverlay] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [toastClassName, setToastClassName] = useState("toast success ");
  const [toastErrorClassName, setToastErrorClassName] =
    useState("toast error ");
  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState();
  const [currentImage, setCurrentImage] = useState(
    localStorage.getItem("imageUrl")
  );
  const [imageError, setImageError] = useState();
  const closeSuccessMessage = () => {
    setToastClassName("toast success");
    // closeMessages();
  };
  const [emailErrors, setEmailErrors] = useState();
  const [nameErrors, setNameErrors] = useState();
  const [deleteAccountPopup, setDeleteAccountPopup] = useState();
  const handleDeleteAccountPopup = () => {
    setDeleteAccountPopup(!deleteAccountPopup)
  }
  const closeErrorMessage = () => {
    setToastErrorClassName("toast error");
    // closeMessages();
  };

  const updateImage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("user_id", userInformation.id);
      await servicesApi.get("/sanctum/csrf-cookie");
      if (image) {
        formData.append("image", image);
      } else {
      }
      const response = await servicesApi.post(
        "api/user/update/image",
        formData
      );

      if (response) {
        user.image = response.data.imagePath;
        localStorage.setItem("user", JSON.stringify(user));

        setUserInformation({
          ...userInformation,
          image: response.data.imagePath,
        });
        if (imageRef.current) {
          imageRef.current = null;
        }
        setImage(null);
      }
    } catch (error) {
      console.log(error);
      setImageError(error.response.data.errors);
      setTimeout(() => {
        setImageError(null);
      }, 7000);
    }
  };
  const closeMessages = () => {
    closeSuccessMessage();
    closeErrorMessage();
  };

  const handleImageRef = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };
  const showPopup = (status) => {
    setPopup(status);
    setShowOverlay(true);
  };
  const cancelUpdate = () => {
    setPopup("");
    setShowOverlay(false);
  };
  const deleteAccount = async (e) => {
    e.preventDefault();
    try {
      
      await servicesApi.get("/sanctum/csrf-cookie");
      const response = await servicesApi.post("/api/account/delete", {user_id: userInformation.id})

      if(response) {
        console.log(response);
      }
    }catch(error) {
      console.log(error);
    }
  }
  const updateEmail = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("user_id", userInformation.id);
      await servicesApi.get("/sanctum/csrf-cookie");
      if (email && password && passwordConfirmation) {
        formData.append("email", email);
        formData.append("password", password);
        formData.append("password_confirmation", passwordConfirmation);
      }
      const response = await servicesApi.post(
        "api/user/update/email",
        formData
      );

      if (response) {
        user.email = response.data.updated_user.email;
        localStorage.setItem("user", JSON.stringify(user));
        setUserInformation(user);
        setToastClassName("toast success active");
        setShowOverlay(false);
        setPopup("none");
        setSuccessMessage("Email Updated Successfully !");
        setTimeout(closeMessages, 3000);
      }
    } catch (error) {
      console.log(error);
      setToastErrorClassName("toast error active");
      if (error.response.data.errors) {
        setErrorMessage(error.response.data.errors);
      } else {
        setErrorMessage(null);
      }
      setTimeout(closeMessages, 3000);
    }
  };
  const handleClickRef = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };
  const updateUsername = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("user_id", userInformation.id);
      await servicesApi.get("/sanctum/csrf-cookie");
      if (name && password && passwordConfirmation) {
        formData.append("name", name);
        formData.append("password", password);
        formData.append("password_confirmation", passwordConfirmation);
      }
      const response = await servicesApi.post("api/user/update/name", formData);

      if (response) {
        user.name = response.data.updated_user.name;
        localStorage.setItem("user", JSON.stringify(user));
        setUserInformation(user);
        setToastClassName("toast success active");
        setShowOverlay(false);
        setPopup("none");
        setSuccessMessage("Username Updated Successfully !");
        setTimeout(closeMessages, 3000);
      }
    } catch (error) {
      console.log(error);
      setToastErrorClassName("toast error active");
      if (error.response.data.errors) {
        setErrorMessage(error.response.data.errors);
      } else {
        setErrorMessage(null);
      }
      setTimeout(closeMessages, 8000);
    }
  };

  const updatePssword = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("user_id", userInformation.id);
      await servicesApi.get("/sanctum/csrf-cookie");
      if (oldPassword && password && passwordConfirmation) {
        formData.append("old_password", oldPassword);
        formData.append("password", password);
        formData.append("password_confirmation", passwordConfirmation);
      }
      const response = await servicesApi.post(
        "api/user/update/password",
        formData
      );

      if (response) {
        setToastClassName("toast success active");
        setShowOverlay(false);
        setPopup("none");
        setSuccessMessage("Password Updated Successfully !");
        setTimeout(closeMessages, 3000);
      }
    } catch (error) {
      console.log(error.response.data);
      setToastErrorClassName("toast error active");
      if (error.response.data.errors) {
        setErrorMessage(error.response.data.errors);
      } else {
        setErrorMessage(null);
      }
      setTimeout(closeMessages, 3000);
    }
  };
  return (
    <div className="settings_container">
      <div className="navbar_container">
        <NavBar updatedInformation={userInformation} />
      </div>
      <div className="side-bar">
        <SideBar />
      </div>
      <div className={`settings`}>
        <div className="title">
          <h2>Personal Info</h2>
          <hr />
          <div className="sm-title">
            <p>
              Update Your Personal Info Username,Email,Password,Profile Image
            </p>
          </div>
        </div>
        <div className="line"></div>
        <div className="form">
          {showOverlay && <div className="overlay"></div>}
          <div className="image">
            {/* <div className="image"> */}
            {userInformation.image ? (
              <img src={`${userImageURL}${userInformation.image}`} alt="none" />
            ) : (
              <img
                src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
                alt=""
                style={{ background: "white" }}
              />
            )}
            <div className="update">
              <form
                action=""
                onSubmit={updateImage}
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <span
                  onClick={handleClickRef}
                  style={{
                    display: "flex",
                    gap: "25px",
                  }}
                >
                  <div className="text">
                    {image && (
                      <>
                        Selected Image:{" "}
                        {image.name.length > 20
                          ? `${image.name.slice(0, 20)}...`
                          : image.name}
                      </>
                    )}
                  </div>
                  <img
                    style={{
                      width: "35px",
                    }}
                    src="./icons/icons8-photo-48.png"
                    alt=""
                  />
                </span>
                <input
                  type="file"
                  name="image"
                  id=""
                  hidden
                  ref={imageRef}
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <button>Update Image ?</button>
              </form>
            </div>
            {/* </div> */}
          </div>
          <div className="errors">
            {imageError && Object.keys(imageError).length > 0
              ? Object.keys(imageError).map((key) => {
                  const value = imageError[key];

                  // Check if the value is an array and has some specific condition
                  if (Array.isArray(value) && value.length > 0) {
                    // Do something with the value
                    return (
                      <div
                        key={key}
                        className="error"
                        style={{
                          broderRadius: "8px",
                          marginTop: "35px",
                          padding: "8px",
                          background: "#ffcccc",
                          color: "#990000",
                        }}
                      >
                        <p>{`${value[0]}`}</p>
                      </div>
                    );
                  }

                  return null; // Skip rendering if conditions are not met
                })
              : null}
          </div>
          <hr />
          <div className="username">
            <div className="input">
              <input
                type="text"
                name="name"
                id=""
                disabled
                value={userInformation.name}
              />
              <div className="show" onClick={() => showPopup("name")}>
                <p>Change Name</p>
              </div>
              {popup === "name" ? (
                <div className="popup">
                  <div className="title">
                    <p>Change Name</p>
                    <form onSubmit={updateUsername}>
                      <div className="input">
                        <input
                          placeholder="Change Uesrname"
                          type="text"
                          name="name"
                          id=""
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="input">
                        <input
                          placeholder="password"
                          type="password"
                          name="password"
                          id=""
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="input">
                        <input
                          placeholder="Rewrite The Password"
                          type="password"
                          name="password_confirmation"
                          id=""
                          onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                          }
                        />
                      </div>
                      <div className="submit">
                        <button>Confirm ?</button>
                        <button onClick={cancelUpdate}>Cancel ?</button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <hr />
          <div className="email">
            <div className="input">
              <input
                type="email"
                name="email"
                id=""
                disabled
                value={userInformation.email}
              />
              <div className="show" onClick={() => showPopup("email")}>
                <p>Change Email</p>
              </div>
              {popup === "email" ? (
                <div className="popup">
                  <div className="title">
                    <p>Change Email</p>
                    <form className="email_form" onSubmit={updateEmail}>
                      <div className="input">
                        <input
                          placeholder="Change Email"
                          type="email"
                          name="email"
                          id=""
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="input">
                        <input
                          placeholder="password"
                          type="password"
                          name="password"
                          id=""
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="input">
                        <input
                          placeholder="Rewrite The Password"
                          type="password"
                          name="password_confirmation"
                          id=""
                          onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                          }
                        />
                      </div>
                      <div className="submit">
                        <button type="submit">Confirm ?</button>
                        <button onClick={cancelUpdate}>Cancel ?</button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <hr />
          <div className="password">
            <div className="input">
              {/* <div className="newPassword"> */}
              <input
                type="password"
                name="password"
                id=""
                disabled
                value={"00000000000"}
              />
              <div className="show" onClick={() => showPopup("password")}>
                <p>Change Password</p>
              </div>
              {/* </div> */}
              {popup === "password" ? (
                <div className="popup">
                  <div className="title">
                    <p>Change Password</p>
                    <form onSubmit={updatePssword}>
                      <div className="input">
                        <input
                          placeholder="Old Password"
                          type="password"
                          name="old_password"
                          id=""
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                      </div>
                      <div className="input">
                        <input
                          placeholder="New Password"
                          type="password"
                          name="password"
                          id=""
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="input">
                        <input
                          placeholder="Rewrite The New Password"
                          type="password"
                          name="password_confirmation"
                          id=""
                          onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                          }
                        />
                      </div>
                      <div className="submit">
                        <button>Confirm ?</button>
                        <button onClick={cancelUpdate}>Cancel ?</button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="delete_acc">
            <div className="input">
              <div
                className="show"
                style={{ background: "#ffcccc", color: "#990000" }}

              >
                <p onClick={handleDeleteAccountPopup}>Delete Account ?</p>
              </div>
            </div>
            {
              deleteAccountPopup && (
                <div className="acc_popup">
                <div className="message">
                  <div className="md">
                    <h2>Delete Account ?</h2>
                  </div>
                  <div className="sm">
                    <p>Delete account will delete your all data, Posts, Commnets, Replies, Actions.</p>
                  </div>
                </div>
                <div className="buttons">
                  <div className="cancel">
                      <button onClick={handleDeleteAccountPopup}>Cancel</button>     
                  </div>
                  <div className="submit">
                    <button onClick={deleteAccount}>Submit</button>
                  </div>
                </div>
              </div>
              )
            }
          </div>
        </div>

        <div class={toastClassName}>
          <div class="toast-content success">
            <span className="close" onClick={closeSuccessMessage}>
              <CloseOutlinedIcon />
            </span>
            <div class="message">
              <span class="text text-1">Success</span>
              <span class="text text-2">{successMessage}</span>
            </div>
          </div>
        </div>

        <div class={toastErrorClassName}>
          <div class="toast-content error">
            <span className="close" onClick={closeErrorMessage}>
              <CloseOutlinedIcon />
            </span>
            <div class="message">
              <span class="text text-1">Erorr</span>
              <span class="text text-2">
                {errorMessage && Object.keys(errorMessage).length > 0 ? (
                  Object.keys(errorMessage).map((key) => {
                    const value = errorMessage[key];

                    // Check if the value is an array and has some specific condition
                    if (Array.isArray(value) && value.length > 0) {
                      // Do something with the value
                      return <p key={key}>{`${value[0]}`}</p>;
                    }

                    return null; // Skip rendering if conditions are not met
                  })
                ) : (
                  <p>The Password Is Incorecct, Try Another</p>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
