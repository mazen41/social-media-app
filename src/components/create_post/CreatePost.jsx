import React, { useRef, useState, useEffect, useContext } from "react";
import "./create_post.css";
import servicesApi from "../api/api";
import { Navigate, useNavigate } from "react-router-dom";
// import { PostAdd } from '@mui/icons-material';
import { BackgroundContext } from "../.././BackgroundController";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { userImageURL } from "../api/users_image";
import axios from "axios";
const CreatePost = () => {
  const user = localStorage.getItem("user");
  const userData = JSON.parse(user);
  const [name, setName] = useState(userData.name);
  const [image, setImage] = useState(localStorage.getItem("imageUrl"));
  const firstName = name.split(" ");
  const placeHolder = `What do you think of ${firstName[0]} ?`;
  const inputRef = useRef(null);
  const [popup, setPopup] = useState(false);
  const popupClassName = `popupForm ${popup ? "active" : ""}`;
  const overlayClassName = `overlay ${popup ? "active" : ""} `;
  const [post, setPost] = useState("");
  const [postImage, setPostImage] = useState("");
  const [accessibility, setAccessibility] = useState("");
  const [color, setColor] = useState("#fffff");
  const [postDisabled, setDisabled] = useState(false);
  const [colorDisabled, setColorDisabled] = useState(false);
  const bearerToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const [createPostError, setCreatePostError] = useState();
  const [toastClassName, setToastClassName] = useState("toast ");
  const closeSuccessMessage = () => {
    setToastClassName("toast");
  };

  const removeImage = () => {
    setPostImage("");
  };
  useEffect(() => {
    if (post !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [post]);

  useEffect(() => {
    if (postImage.name == undefined) {
      setColorDisabled(false);
    } else {
      setColorDisabled(true);
    }
  }, [postImage]);

  const handlePopup = () => {
    setPopup(true);
    document.body.style.overflow = "hidden";
  };
  const handleClosePopup = () => {
    setPopup(false);
    document.body.style.overflow = "";
    setToastClassName("toast");
  };
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  // console.log(color);
  // const createPost = async (e) => {
  //   e.preventDefault();
  //   setToastClassName("toast");
  //   try {
  //     const formData = new FormData();
  //     formData.append("title", post);
  //     formData.append("user_id", userData.id);
  //     formData.append("background_color", color);

  //     if (postImage) {
  //       formData.append("image", postImage);
  //     }
  //     if (accessibility) {
  //       formData.append("accessibility", accessibility);
  //     }
  //     // await axios.get("https://socialmediapproject.000webhostapp.com/sanctum/csrf-cookie").then(response => {
  //     //   const response = await servicesApi.post("api/posts", formData, {
  //     //     headers: {
  //     //       Authorization: `Bearer ${bearerToken}`,
  //     //     },
  //     //   });
  //     // });
  //     axios.get("https://socialmediapproject.000webhostapp.com/sanctum/csrf-cookie")
  //     .then(response => {
  //       // CSRF token obtained successfully, now make the post request
  //       return servicesApi.post("api/posts", formData, {
  //         headers: {
  //           Authorization: `Bearer ${bearerToken}`,
  //         },
  //       });
  //     })
  //     .then(postResponse => {
  //       // Handle the response from the post request
  //       console.log(postResponse);
  //       window.location.reload();
  //     })
  //     .catch(error => {
  //       // Handle errors
  //       setCreatePostError("Something Went Wrong. Try Again Later!");
  //       setToastClassName("toast active");

  //       setTimeout(closeSuccessMessage, 3000);
  //       console.error(error);
  //     });

  //   }
  //   // catch (error) {
  //   //   setCreatePostError("Something Went Wrong Try Again Later !");
  //   //   setToastClassName("toast active");

  //   //   setTimeout(closeSuccessMessage, 3000);
  //   //   console.log(error);
  //   // }
  // };

  const createPost = async (e) => {
    e.preventDefault();

    setToastClassName("toast");
    try {
      const formData = new FormData();
      formData.append("title", post);
      formData.append("user_id", userData.id);
      formData.append("background_color", color);

      if (postImage) {
        formData.append("image", postImage);
      }
      if (accessibility) {
        formData.append("accessibility", accessibility);
      }

      axios
        .get(
          "https://socialmediapproject.000webhostapp.com/sanctum/csrf-cookie"
        )
        .then((response) => {
          // CSRF token obtained successfully, now make the post request
          return servicesApi.post("api/posts", formData);
        })
        .then((postResponse) => {
          // Handle the response from the post request
          console.log(postResponse);
          window.location.reload();
        })
        .catch((error) => {
          // Handle errors
          setCreatePostError("Something Went Wrong. Try Again Later!");
          setToastClassName("toast active");

          setTimeout(closeSuccessMessage, 3000);
          console.error(error);
        });
    } catch (error) {
      setCreatePostError("Something Went Wrong. Try Again Later!");
      setToastClassName("toast active");

      setTimeout(closeSuccessMessage, 3000);
      console.error(error);
    }
  };

  const RemoveColor = () => {
    setColor("#fffff");
  };
  function getTextColorContrast(backgroundColor) {
    if (!backgroundColor) return "black";

    const hexColor = backgroundColor.replace("#", "");
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness >= 128 ? "black" : "white";
  }

  return (
    <div className={`create_post`}>
      <div className="title">
        <h4>New Post test?</h4>
      </div>
      <div className="new_post">
        {/* <img src={image} alt="User" /> */}
        {/* {userData.image ? (
          <img src={`${userImageURL}${userData.image}`} />
         
          ) : <img src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}>} */}
        {userData.image ? (
          <img src={`${userImageURL}${userData.image}`} />
        ) : (
          <img
            src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
          />
        )}
        <div className="post" onClick={handlePopup}>
          <div>
            <p>What do you think of {firstName[0]} ?</p>
          </div>
        </div>
      </div>
      <div className={overlayClassName}></div>
      <div className={popupClassName}>
        <form onSubmit={createPost}>
          <div className="title">
            <p>New Post</p>
          </div>
          <div className="line"></div>
          <div className="user">
            {userData.image ? (
              <img src={`${userImageURL}${userData.image}`} />
            ) : (
              <img src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`} style={{"background":"white"}}/>
            )}
            <p>{firstName[0]}</p>
          </div>
          <div className="input">
            <textarea
              style={{
                // backgroundColor: color ? `${color}` : "white",
                backgroundColor: color == "#fffff" ? "white" : `${color}`,
                // color: color == "white" ? "black" : "white",
                color: getTextColorContrast(color),
                padding: "15px",
                borderRadius: "5px",
              }}
              name="title"
              cols="45"
              rows="10"
              placeholder={placeHolder}
              value={post}
              onChange={(e) => setPost(e.target.value)}
            ></textarea>
          </div>
          <div className="input_color">
            <div className="input">
              <input
                disabled={colorDisabled}
                type="color"
                name="background_color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            {color !== "#fffff" ? (
              <div className="cancel">
                <button onClick={RemoveColor}>Remove The Color?</button>
              </div>
            ) : null}
          </div>
          <div className="photo">
            {/* <p>{postImage ? `Selected Image: ${postImage.name}` : null}</p>
                        <p>{color !== "white" ? "Remove The Color To Choose An Image" : "Select An Image"}</p> */}
            {/* <img onClick={handleClick} src="./icons/icons8-photo-48.png" alt="" /> */}
            <div className="text">
              {/* <p>{postImage ? `Selected Image: ${
                postImage.length > 100 ? (
                  postImage.slice(0, 100) + "..."
                ) : postImage
              }` : null}</p> */}
              <p>
                {postImage && (
                  <>
                    Selected Image:{" "}
                    {postImage.name.length > 10
                      ? `${postImage.name.slice(0, 100)}...`
                      : postImage.name}
                  </>
                )}
              </p>
              <p>
                {color !== "#fffff"
                  ? "Remove The Color To Choose An Image"
                  : null}
                {postImage !== "" ? "Select An image" : null}
              </p>
            </div>
            <div className="icon">
              {color !== "#fffff" ? null : (
                <img
                  onClick={handleClick}
                  src="./icons/icons8-photo-48.png"
                  alt=""
                />
              )}
              {postImage ? (
                <button onClick={removeImage}>
                  Remove Image To Choose Color ?
                </button>
              ) : null}
            </div>
            <input
              ref={inputRef}
              type="file"
              name="image"
              hidden
              onChange={(e) => setPostImage(e.target.files[0])}
            />
          </div>
          <div className="accessibility">
            <div className="public">
              <input
                type="radio"
                id="public"
                name="accessibility"
                value="public"
                onChange={(e) => setAccessibility(e.target.value)}
              />
              <label htmlFor="public">Public</label>
            </div>
            <div className="private">
              <input
                type="radio"
                id="private"
                name="accessibility"
                value="private"
                onChange={(e) => setAccessibility(e.target.value)}
              />
              <label htmlFor="private">Private</label>
            </div>
          </div>
          <div className="buttons">
            <div className="cancel" onClick={handleClosePopup}>
              Cancel
            </div>
            <div className="submit">
              <input disabled={postDisabled} type="submit" value="Create" />
            </div>
          </div>
        </form>
      </div>
      <div className={toastClassName}>
        <div className="toast-content">
          {/* <i className="fas fa-solid fa-check check"></i> */}
          <span className="close" onClick={closeSuccessMessage}>
            <CloseOutlinedIcon />
          </span>
          <div className="message">
            <span className="text text-1">Success</span>
            <span className="text text-2">{createPostError}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
