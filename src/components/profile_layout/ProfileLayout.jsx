import React from "react";
import { useRef, useState, useEffect, useContext } from "react";
import servicesApi from "../api/api";
import "../profile/profile.css";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { handleLike } from "../functions/functions";
import { getTextColorContrast } from "../functions/functions";
import { createPost } from "../functions/functions";
import { handleDislike } from "../functions/functions";
import { selectClasses } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { createComment } from "../functions/functions";
import { createReply } from "../functions/functions";
import { handleReplyCancel } from "../functions/functions";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import { useNavigate } from "react-router-dom";
import { BackgroundContext } from "../.././BackgroundController";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { selectedPostLike } from "../functions/functions";
import { selectedPostdislike } from "../functions/functions";
import { commentAction } from "../functions/functions";
import { replyAction } from "../functions/functions";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { userImageURL } from "../api/users_image";
import { postsImage } from "../api/posts_image";
import { useMyContext } from "../../BackgroundController";
import { SignalCellularNullSharp } from "@mui/icons-material";

const ProfileLayout = ({ id }) => {
  const [image, setImage] = useState("");
  const [userData, setUserData] = useState();
  const [popup, setPopup] = useState(false);
  const inputRef = useRef(null);
  const popupClassName = `popupForm ${popup ? "active" : ""}`;
  const overlayClassName = `overlay ${popup ? "active" : ""} `;
  const [post, setPost] = useState("");
  const [postImage, setPostImage] = useState("");
  const [accessibility, setAccessibility] = useState("");
  const [color, setColor] = useState("#fffff");
  const [postDisabled, setDisabled] = useState(false);
  const [colorDisabled, setColorDisabled] = useState(false);
  const bearerToken = localStorage.getItem("token");
  const [data, setData] = useState();
  const [likes, setLikes] = useState();
  const [dislikes, setDislikes] = useState();
  const [comments, setComments] = useState();
  const user = JSON.parse(localStorage.getItem("user"));
  const [userInformation, setUserInformation] = useState(user);
  const [expandedPosts, setExpandedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState();
  const [postStatus, setPostStatus] = useState(false);
  const [visiblePostCommentTitleLength, setVisiblePostCommentTitleLength] =
    useState(100);
  const [postComment, setPostComment] = useState();
  const submitRef = useRef(null);
  const [addReply, setAddReply] = useState(false);
  const [reply, setReply] = useState();
  const [replyTo, setReplyTo] = useState();
  const [commentReplyToId, setCommentReplyToId] = useState();
  const clickRef = useRef(null);
  const [editProfile, setEditProfile] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);
  const navigate = useNavigate();
  // const { backgroundColor } = useContext(BackgroundContext);
  const cleanId = id.replace(/[^\w\s]/gi, "").trim();
  const [createPostError, setCreatePostError] = useState();
  const [toastClassName, setToastClassName] = useState("toast ");
  const [expandedComments, setExpandedComments] = useState([]);
  const [expandedReplies, setExpandedReplies] = useState([]);
  const [activePostId, setActivePostId] = useState();
  const [editPostPopup, setEditPostPopup] = useState(false);
  const [currentEditedPost, setCurrentEditedPost] = useState();
  const [editedPostTitle, setEditedPostTitle] = useState();
  const [editedPostBackground, setEditedPostBackground] = useState();
  const [editedPostAccessibility, setEditedPostAccessibility] = useState();
  const [editedPostImage, setEditedPostImage] = useState(null);
  const editedImageRef = useRef(null);
  const { state, dispatch } = useMyContext();
  const [editPostErrors, setEditPostErrors] = useState();
  const handleDeletePost = async (postId) => {
    try {
      const response = await servicesApi.post(
        `api/post/destroy/${postId}`,
        null
      );

      if (response) {
        setData((prevState) => ({
          ...prevState,
          posts: prevState.posts.filter((post) => post.id !== postId),
        }));
      }
    } catch (error) {
      return error;
    }
  };

  const handleEditPost = async (e, postId) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("post_id", postId);
      formData.append("user_id", userInformation.id);
      formData.append("background_color", editedPostBackground);
      if (editedPostImage) {
        formData.append("image", editedPostImage);
      }
      if (editedPostTitle) {
        formData.append("title", editedPostTitle);
      }
      if (editedPostAccessibility) {
        formData.append("accessibility", editedPostAccessibility);
      }
      // await servicesApi.get("/sanctum/csrf-cookie");

      const response = await servicesApi.post("api/post/edit", formData);

      if (response) {
        // return response;
        window.location.reload();
      }
    } catch (error) {
      setEditPostErrors(error.response.data.errors);
      setTimeout(() => {
        setEditPostErrors(null);
      }, 5000);
      console.log(error);
    }
  };

  const handleEditImage = () => {
    if (editedImageRef.current) {
      editedImageRef.current.click();
    }
  };
  const handleEditingPostTitle = (e) => {
    setEditedPostTitle(e.target.value);
    setCurrentEditedPost({ ...currentEditedPost, title: e.target.value });
  };
  const handleChoosingImage = (e) => {
    setEditedPostImage(e.target.files[0]);
    setCurrentEditedPost({
      ...currentEditedPost,
      image: e.target.files[0].name,
    });
  };
  const handleColorChange = (e) => {
    setEditedPostBackground(e.target.value);
    setCurrentEditedPost({
      ...currentEditedPost,
      background_color: editedPostBackground,
    });
  };
  const handleRemoveTheImage = () => {
    setCurrentEditedPost({
      ...currentEditedPost,
      image: null,
      background_color: "#fffff",
    });
    setEditedPostBackground("#fffff");
    setEditedPostImage(null);
  };
  const handleRemoveTheColor = () => {
    setCurrentEditedPost({ ...currentEditedPost, background_color: "#fffff" });
    setEditedPostBackground("#fffff");
  };
  const showEditPost = async (id) => {
    try {
      await servicesApi.get("/sanctum/csrf-cookie");
      const response = await servicesApi.get(`/api/posts/${id}`);
      if (response) {
        setCurrentEditedPost(response.data.post);
        setEditPostPopup(true);
        setActivePostId(null);
        document.body.style.overflow = "hidden";
      }
    } catch (error) {
      return error;
    }
  };
  const showPostManage = (id) => {
    if (id === activePostId) {
      setActivePostId(null);
    } else {
      setActivePostId(id);
    }
  };
  const toggleRepliesContentLength = (replyId) => {
    setExpandedReplies((prevExpandedReplies) => {
      if (prevExpandedReplies.includes(replyId)) {
        return prevExpandedReplies.filter((id) => id !== replyId);
      } else {
        return [...prevExpandedReplies, replyId];
      }
    });
  };

  const toggleCommentContentLength = (commentId) => {
    setExpandedComments((prevExpandedComments) => {
      if (prevExpandedComments.includes(commentId)) {
        return prevExpandedComments.filter((id) => id !== commentId);
      } else {
        return [...prevExpandedComments, commentId];
      }
    });
  };
  const handleReplyAction = (
    postId,
    userId,
    replyId,
    bearerToken,
    actionType,
    setComments,
    commentId
  ) => {
    replyAction(
      postId,
      userId,
      replyId,
      bearerToken,
      actionType,
      setComments,
      commentId
    );
  };
  const handleCommentAction = (
    postId,
    userId,
    commentId,
    bearerToken,
    actionType,
    setComments
  ) => {
    commentAction(
      postId,
      userId,
      commentId,
      bearerToken,
      actionType,
      setComments
    );
  };
  const closeSuccessMessage = () => {
    setToastClassName("toast");
  };
  const profileNavigate = (id) => {
    navigate(`/profile/${id}`);
  };
  const RemoveColor = () => {
    setColor("#fffff");
  };
  const handleSubmitRef = () => {
    if (clickRef.current) {
      clickRef.current.click();
    }
  };
  const handleCreateReply = (
    e,
    postId,
    userId,
    content,
    commentId,
    bearerToken,
    setComments,
    setAddReply
  ) => {
    createReply(
      e,
      postId,
      userId,
      content,
      commentId,
      bearerToken,
      setComments,
      setAddReply
    );
  };
  const handleReplyUser = (username, commentId) => {
    setReplyTo(username);
    setCommentReplyToId(commentId);
    setAddReply(true);
  };
  const handleSubmit = () => {
    if (submitRef.current) {
      submitRef.current.click();
    }
  };
  const handleCloseEditPost = () => {
    setEditPostPopup(false);
    setCurrentEditedPost(null);

    document.body.style.overflow = "";
  };
  const toggleTitleLength = (postId) => {
    setExpandedPosts((prevExpandedPosts) => {
      if (prevExpandedPosts.includes(postId)) {
        return prevExpandedPosts.filter((id) => id !== postId);
      } else {
        return [...prevExpandedPosts, postId];
      }
    });
  };

  useEffect(() => {
    if (postImage.name == undefined) {
      setColorDisabled(false);
    } else {
      setColorDisabled(true);
    }
  }, [postImage]);
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
    // setPopup(!popup);
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
  useEffect(() => {
    (async () => {
      try {
        await servicesApi.get("/sanctum/csrf-cookie");
        const response = await servicesApi.get(`api/user/${id}`);
        if (response) {
          setUserData(response.data.user);
          setData(response.data);
          const allComments = response.data.posts
            .map((post) => post.comments)
            .flat();
        } else {
          return response.data;
        }
      } catch (error) {
        return error;
      }
    })();
  }, []);
  useEffect(() => {
    const imageLocation = localStorage.getItem("imageUrl");
    if (imageLocation) {
      setImage(imageLocation);
    }
  }, []);
  const handleLikeClick = (postId, postUser, userId, bearerToken, setData) => {
    handleLike(postId, postUser, userId, bearerToken, setData);
  };
  const handleDislikeClick = (
    postId,
    postUser,
    userId,
    bearerToken,
    setData
  ) => {
    handleDislike(postId, postUser, userId, bearerToken, setData);
  };
  const handleCreatePost = (
    e,
    post,
    accessibility,
    userId,
    color,
    postImage,
    bearerToken,
    setCreatePostError,
    setToastClassName
  ) => {
    const imageToUpload = postImage ? postImage : null;
    createPost(
      e,
      post,
      accessibility,
      userId,
      color,
      imageToUpload,
      bearerToken,
      setCreatePostError,
      setToastClassName
    );
  };

  const handleCreateComment = (
    e,
    postComment,
    postId,
    userId,
    bearerToken,
    setComments,
    setPostComment,
    setData,
    setSelectedPost
  ) => {
    createComment(
      e,
      postComment,
      postId,
      userId,
      bearerToken,
      setComments,
      setPostComment,
      setData,
      setSelectedPost
    );
  };

  const handleGetPost = async (id) => {
    try {
      await servicesApi.get("/sanctum/csrf-cookie");
      const response = await servicesApi.get(`/api/posts/${id}`);
      if (response) {
        setSelectedPost(response.data);
        setComments(response.data.post.comments);
        if (postStatus == true) {
          setPostStatus(false);
        } else {
          setPostStatus(true);
        }
        document.body.style.overflow = "hidden";
      }
    } catch (error) {
      return error;
    }
  };
  const handleEditPopup = () => {
    setEditProfile(true);
  };
  const handleShowEditBio = () => {
    if (showEditBio == true) {
      setShowEditBio(false);
    } else {
      setShowEditBio(true);
    }
  };
  const handleCloseModal = () => {
    // setShowPostModal(false);
    setSelectedPost(null);
    document.body.style.overflow = "";
    setPostStatus(false);
  };
  const handleSelectedPostLike = (
    postId,
    postUser,
    userId,
    bearerToken,
    setSelectedPost
  ) => {
    selectedPostLike(postId, postUser, userId, bearerToken, setSelectedPost);
  };
  const handleSelectedPostDislike = (
    postId,
    postUser,
    userId,
    bearerToken,
    setSelectedPost
  ) => {
    selectedPostdislike(postId, postUser, userId, bearerToken, setSelectedPost);
  };
  return (
    <div className={`profile ${state.background}`}>
      {data && (
        <div className={`top `}>
          <div className="user">
            <div className="user_image">
              {/* <img src={`${userImageURL}${data.user.image}`} alt="" /> */}
              {data.user.image ? (
                <img src={`${userImageURL}${data.user.image}`} />
              ) : (
                <img
                  src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
                  alt=""
                />
              )}
            </div>
            <div className="username">
              <p>{data.user.name}</p>
            </div>
          </div>
          <div className="edit">
            {editProfile && (
              <div className="edit_profile_popup">
                <div className="profile_image">
                  <form>
                    <div className="title">
                      <p>Edit Profile Image</p>
                    </div>
                    <div className="image">
                      <img src="" alt="" />
                      <span>
                        <AddAPhotoOutlinedIcon />
                      </span>
                    </div>
                  </form>
                </div>
                <div className="bio_edit">
                  <div className="title">
                    <p>Edit BIO</p>
                  </div>
                  <form action="">
                    <div className="title">Edit Bio YOU IDIOt</div>
                    {showEditBio && (
                      <div className="edit">
                        <div className="input">
                          <textarea
                            name=""
                            id=""
                            cols="30"
                            rows="10"
                          ></textarea>
                          <span>
                            <SendOutlinedIcon />
                          </span>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {data && (
        <div className="line_container">
          <div className="line"></div>
        </div>
      )}
      {data && (
        <div className="list">
          <ul>
            <li>Posts</li>
          </ul>
        </div>
      )}
      {data && (
        <div className={`profile_content `}>
          <div className="info">
            {cleanId == userInformation.id && (
              <div className="add_post">
                <div className="user_image">
                  {/* <img src={`${userImageURL}${data.user.image}`} alt="" /> */}
                  {data.user.image ? (
                    <img src={`${userImageURL}${data.user.image}`} />
                  ) : (
                    <img
                      src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
                      alt=""
                    />
                  )}
                </div>
                <div className="post">
                  <div onClick={handlePopup}>
                    <p>What do you think of {data.user.name}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="posts_title">
              <p>Posts</p>
            </div>
            <div className={`${overlayClassName}`}></div>
            <div className={`popupForm ${popupClassName}`}>
              <form
                onSubmit={(e) =>
                  handleCreatePost(
                    e,
                    post,
                    accessibility,
                    userInformation.id,
                    color,
                    postImage,
                    bearerToken,
                    setCreatePostError,
                    setToastClassName
                  )
                }
              >
                <div className="title">
                  <p>New Post</p>
                </div>
                <div className="line"></div>
                <div className="user">
                  {/* <img src={`${userImageURL}${data.user.image}`} alt="" /> */}
                  {data.user.image ? (
                    <img src={`${userImageURL}${data.user.image}`} />
                  ) : (
                    <img
                      src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
                      alt=""
                    />
                  )}
                  <p>{data.user.name}</p>
                </div>
                <div className="input">
                  <textarea
                    style={{
                      backgroundColor: color ? `${color}` : "white",

                      // color: color == "white" ? "black" : "white",
                      color: getTextColorContrast(color),
                      padding: "15px",
                      borderRadius: "5px",
                    }}
                    name="title"
                    cols="45"
                    rows="10"
                    // placeholder={placeHolder}
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                  ></textarea>
                </div>
                <div
                  className="input_color"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    "border-radius": "5px",
                    padding: "5px",
                    "align-items": "center",
                    "text-align": "center",
                    "margin-top": "13px",
                  }}
                >
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
                    <p>
                      {postImage ? `Selected Image: ${postImage.name}` : null}
                    </p>
                    <p>
                      {color !== "#fffff"
                        ? "Remove The Color To Choose An Image"
                        : "Select An Image"}
                    </p>
                  </div>
                  <div className="icon">
                    {color !== "#fffff" ? null : (
                      <img
                        onClick={handleClick}
                        src="../icons/icons8-photo-48.png"
                        alt=""
                      />
                    )}
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
                    <input
                      disabled={postDisabled}
                      type="submit"
                      value="Create"
                    />
                  </div>
                </div>
              </form>
            </div>
            {data.posts.length > 0 ? (
              data.posts.map((post) => (
                <div className="posts" key={post.id}>
                  <div
                    className="post"
                    style={{
                      backgroundColor: post.background_color
                        ? post.background_color
                        : "white",
                      color:
                        post.image || post.background_color === "white"
                          ? "black"
                          : getTextColorContrast(post.background_color),
                    }}
                  >
                    <div className="user">
                      <div className="user_information">
                        {/* <img
                          src={`${userImageURL}${post.user.image}`}
                          style={{ cursor: "pointer" }}
                          alt="User"
                          onClick={() => profileNavigate(post.user.id)}
                        /> */}
                        {post.user.image ? (
                          <img
                            src={`${userImageURL}${post.user.image}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => profileNavigate(post.user.id)}
                          />
                        ) : (
                          <img
                            src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
                            alt=""
                          />
                        )}
                        <p>{post.user.name}</p>
                      </div>
                      <div className="manage_post">
                        {cleanId == userInformation.id && (
                        <span
                          style={{
                            backgroundColor: post.background_color
                              ? post.background_color
                              : "white",
                            color:
                              post.image || post.background_color === "white"
                                ? "black"
                                : getTextColorContrast(post.background_color),
                            cursor: "pointer",
                          }}
                          onClick={() => showPostManage(post.id)}
                        >
                          <MoreVertIcon />
                        </span>
                        )}
                          <div className="dropdown">
                            <ul
                              className={`dropdown ${
                                activePostId === post.id ? "active" : ""
                              }`}
                            >
                              <li onClick={() => showEditPost(post.id)}>
                                Edit Post
                              </li>
                              <div className="line"></div>
                              <li onClick={() => handleDeletePost(post.id)}>
                                Move This Post To Trash
                              </li>
                            </ul>
                          </div>
                      </div>
                    </div>
                    <div className="line"></div>
                    <div className="post_title">
                      {/* <p>{post.title}</p> */}
                      <p>
                        {expandedPosts.includes(post.id)
                          ? post.title
                          : post.title.slice(0, 100)}
                      </p>
                      <button
                        onClick={() => toggleTitleLength(post.id)}
                        style={{
                          display:
                            post.title.length > 100 ? "inline-block" : "none",
                          cursor: "pointer",
                        }}
                      >
                        {expandedPosts.includes(post.id)
                          ? "See Less"
                          : "See More"}
                      </button>
                    </div>
                    <div className="post_rest">
                      {post.image && (
                        <img
                          src={`${postsImage}${post.image}`}
                          alt="Uploaded Image"
                        />
                      )}
                      <div className="post_information">
                        <div className="like">
                          <span
                            onClick={() =>
                              handleLikeClick(
                                post.id,
                                post.user.id,
                                userInformation.id,
                                bearerToken,
                                setData
                              )
                            }
                          >
                            <FavoriteBorderIcon />
                          </span>
                          <p>{post.likes}</p>
                        </div>
                        <div className="dislikes">
                          <span
                            onClick={() =>
                              handleDislikeClick(
                                post.id,
                                post.user.id,
                                userInformation.id,
                                bearerToken,
                                setData
                              )
                            }
                          >
                            <ThumbDownOffAltIcon />
                          </span>
                          <p>{post.dislikes}</p>
                        </div>
                        <div className="">
                          <span onClick={() => handleGetPost(post.id)}>
                            <ChatOutlinedIcon />
                          </span>
                          <p>{post.comments_count}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="alert"
                style={{
                  "z-index": "1",
                  background: "#f9bc2d",
                  "border-radius": "6px",
                  padding: "13px",
                  color: "#111",
                  "margin-left": "4px",
                }}
              >
                <p>No Posts Have been made yet. By this user.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedPost && selectedPost.post && (
        <div className="selecetd_post">
          <div className="s_post">
            <div className="title">
              <div className="into">
                {selectedPost.post.user.image ? (
                  <img src={`${userImageURL}${selectedPost.post.user.image}`} />
                ) : (
                  <img
                    src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
                    alt=""
                  />
                )}
                <h4>{selectedPost.post.user.name}'s Post</h4>
                <span style={{ cursor: "pointer" }} onClick={handleCloseModal}>
                  <CloseRoundedIcon />
                </span>
              </div>
            </div>
            <hr />
            <div className="post_title">
              <p>
                {/* {selectedPost.post.title.length > visiblePostTitleLength ? (
                  <>
                    {visiblePostTitleLength === 100
                      ? selectedPost.post.title.slice(
                          0,
                          visiblePostTitleLength
                        ) + "..."
                      : selectedPost.title}
                    <button onClick={togglePostTitleLength}>
                      {visiblePostTitleLength === 100 ? "See More" : "See Less"}
                    </button>
                  </>
                ) : (
                  selectedPost.post.title
                )} */}

                {selectedPost.post.title}
              </p>
            </div>
            <div className="post_image">
              {selectedPost.post.image ? (
                <img src={`${postsImage}${selectedPost.post.image}`} />
              ) : null}
            </div>
            <div className="reset_of_post">
              <div className="like">
                <span
                  onClick={() =>
                    handleSelectedPostLike(
                      selectedPost.post.id,
                      selectedPost.post.user.id,
                      userInformation.id,
                      bearerToken,
                      setSelectedPost
                    )
                  }
                >
                  <FavoriteBorderIcon />
                </span>
                <p>{selectedPost.post.likes}</p>
              </div>
              <div className="dislikes">
                <span
                  onClick={() =>
                    handleSelectedPostDislike(
                      selectedPost.post.id,
                      selectedPost.post.user.id,
                      userInformation.id,
                      bearerToken,
                      setSelectedPost
                    )
                  }
                >
                  <ThumbDownOffAltIcon />
                </span>
                <p>{selectedPost.post.dislikes}</p>
              </div>
              <div className="">
                <span>
                  <ChatOutlinedIcon />
                </span>
                <p>{selectedPost.post.comments_count}</p>
              </div>
            </div>
            <hr />

            {comments && comments.length > 0 && (
              <div className="comments">
                {comments.map((comment) => {
                  return (
                    <div key={comment.id} className="comment">
                      <div className="comment_user">
                        {comment.user.image ? (
                          <img src={`${userImageURL}${comment.user.image}`} />
                        ) : (
                          <img
                            src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
                            alt=""
                          />
                        )}
                        <div className="comment_content">
                          <p>
                            {expandedComments.includes(comment.id)
                              ? comment.content
                              : `${comment.content.slice(0, 100)}`}
                            {comment.content.length > 100 && (
                              <button
                                onClick={() =>
                                  toggleCommentContentLength(comment.id)
                                }
                              >
                                {expandedComments.includes(comment.id)
                                  ? "See Less"
                                  : "See More"}
                              </button>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="comment_information">
                        <div className="comment_likes">
                          <span
                            onClick={() =>
                              handleCommentAction(
                                selectedPost.post.id,
                                userInformation.id,
                                comment.id,
                                bearerToken,
                                "likes",
                                setComments
                              )
                            }
                          >
                            <FavoriteBorderIcon />
                          </span>
                          <p>{comment.likes}</p>
                        </div>
                        <div className="comment_dislikes">
                          <span
                            onClick={() =>
                              handleCommentAction(
                                selectedPost.post.id,
                                userInformation.id,
                                comment.id,
                                bearerToken,
                                "dislikes",
                                setComments
                              )
                            }
                          >
                            <ThumbDownOffAltIcon />
                          </span>
                          <p>{comment.dislikes}</p>
                        </div>
                        <div className="comment_comments">
                          <span
                            onClick={() =>
                              handleReplyUser(comment.user.name, comment.id)
                            }
                          >
                            <ChatOutlinedIcon />
                          </span>
                          <p>{comment.replies_count}</p>
                        </div>
                      </div>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="replies">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="reply">
                              <div className="reply_user">
                                {reply.user.image ? (
                                  <img
                                    src={`${userImageURL}${reply.user.image}`}
                                  />
                                ) : (
                                  <img
                                    src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
                                    alt=""
                                  />
                                )}
                                <div className="reply_content">
                                  <div className="content">
                                    {/* <p>{reply.content}</p> */}
                                    <p>
                                      {expandedReplies.includes(reply.id)
                                        ? reply.content
                                        : `${reply.content.slice(0, 100)}`}
                                      {reply.content.length > 100 && (
                                        <button
                                          onClick={() =>
                                            toggleRepliesContentLength(reply.id)
                                          }
                                        >
                                          {expandedReplies.includes(reply.id)
                                            ? "See Less"
                                            : "See More"}
                                        </button>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="reply_information">
                                <div className="comment_likes">
                                  <span
                                    onClick={() =>
                                      handleReplyAction(
                                        selectedPost.post.id,
                                        userInformation.id,
                                        reply.id,
                                        bearerToken,
                                        "likes",
                                        setComments,
                                        comment.id
                                      )
                                    }
                                  >
                                    <FavoriteBorderIcon />
                                  </span>
                                  <p>{reply.likes}</p>
                                </div>
                                <div className="comment_dislikes">
                                  <span
                                    onClick={() =>
                                      handleReplyAction(
                                        selectedPost.post.id,
                                        userInformation.id,
                                        reply.id,
                                        bearerToken,
                                        "dislikes",
                                        setComments,
                                        comment.id
                                      )
                                    }
                                  >
                                    <ThumbDownOffAltIcon />
                                  </span>
                                  <p>{reply.dislikes}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="create_comment">
              <form
                onSubmit={(e) =>
                  handleCreateComment(
                    e,
                    postComment,
                    selectedPost.post.id,
                    userInformation.id,
                    bearerToken,
                    setComments,
                    setPostComment,
                    setData,
                    setSelectedPost
                  )
                }
              >
                <div className="input">
                  <textarea
                    value={postComment}
                    onChange={(e) => setPostComment(e.target.value)}
                    name="comment"
                  ></textarea>
                  <div className="submit">
                    <span onClick={handleClick}>
                      <SendOutlinedIcon />
                    </span>
                  </div>
                </div>
                <div className="submit-input">
                  <input ref={inputRef} type="submit" hidden />
                </div>
              </form>
            </div>
          </div>
          {addReply && <div className="reply_overlay"></div>}
          {addReply && (
            <div className="new_reply">
              <form
                className="form"
                onSubmit={(e) =>
                  handleCreateReply(
                    e,
                    selectedPost.post.id,
                    userInformation.id,
                    reply,
                    commentReplyToId,
                    bearerToken,
                    setComments,
                    setAddReply
                  )
                }
              >
                <div className="input">
                  <textarea
                    name="reply"
                    id=""
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  ></textarea>
                  <span onClick={handleSubmitRef}>
                    <SendOutlinedIcon />
                  </span>
                  <div className="replyToUser">
                    <p>{replyTo}</p>
                  </div>
                </div>
                <div className="submit">
                  <button onClick={() => handleReplyCancel(setAddReply)}>
                    cancel
                  </button>
                  <input hidden type="submit" ref={clickRef} />
                </div>
              </form>
            </div>
          )}
        </div>
      )}
      {postStatus && <div className="selected_post_overlay"></div>}
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
      {editPostPopup && <div className="edit_post_overlay"></div>}
      <div className="edit_post">
        {editPostPopup && currentEditedPost && (
          <div className="popupForm">
            <form onSubmit={(e) => handleEditPost(e, currentEditedPost.id)}>
              <div className="title">
                <p>Edit Post</p>
              </div>
              <div className="line"></div>
              <div className="user">
                {/* <img src={`${userImageURL}${data.user.image}`} alt="" /> */}
                {/* <p>{firstName[0]}</p> */}
                {data.user.image ? (
                  <img src={`${userImageURL}${data.user.image}`} />
                ) : (
                  <img
                    src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
                    alt=""
                  />
                )}
                <p>{data.user.name}</p>
              </div>
              <div className="input">
                <textarea
                  style={{
                    backgroundColor: currentEditedPost.background_color
                      ? `${currentEditedPost.background_color}`
                      : "white",
                    color: getTextColorContrast(
                      currentEditedPost.background_color
                    ),
                    padding: "15px",
                    borderRadius: "5px",
                  }}
                  name="title"
                  cols="45"
                  rows="10"
                  value={currentEditedPost.title}
                  onChange={(e) => handleEditingPostTitle(e)}
                ></textarea>
              </div>
              <div className="input_color">
                <div className="input">
                  {currentEditedPost.image ? (
                    <input
                      type="color"
                      value={editedPostBackground}
                      onChange={(e) => setEditedPostBackground(e.target.value)}
                      name=""
                      disabled
                      id=""
                    />
                  ) : (
                    <input
                      value={currentEditedPost.background_color}
                      onChange={(e) => handleColorChange(e)}
                      type="color"
                      name=""
                      id=""
                    />
                  )}
                </div>
                {currentEditedPost.image ? (
                  <div className="cancel">
                    <button
                      onClick={handleRemoveTheImage}
                      style={{
                        marginTop: "10px",
                        cursor: "pointer",
                        background: "none",
                        color: "#111",
                        borderRadius: "5px",
                        padding: "8px",
                      }}
                    >
                      Remove image or update ?
                    </button>
                  </div>
                ) : null}
                {currentEditedPost.background_color !== "#fffff" &&
                editedPostBackground !== "#fffff" ? (
                  <div className="cancel">
                    <button
                      onClick={handleRemoveTheColor}
                      style={{
                        marginTop: "10px",
                        cursor: "pointer",
                        background: "none",
                        color: "#111",
                        borderRadius: "5px",
                        padding: "8px",
                      }}
                    >
                      Remove The Color ?{" "}
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="photo">
                {currentEditedPost.image ? (
                  <div className="image">
                    {/* <img src={`${postsImage}${currentEditedPost.image}`} alt="Error" /> */}
                    <p>{currentEditedPost.image}</p>
                  </div>
                ) : (
                  <div
                    className="icon"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      type="file"
                      name="image"
                      hidden
                      ref={editedImageRef}
                      onChange={(e) => handleChoosingImage(e)}
                    />
                    <div className="text">
                      {editedPostImage !== null ? (
                        <p>{editedPostImage.name}</p>
                      ) : currentEditedPost.background_color !== "#fffff" &&
                        editedPostBackground !== "#fffff" ? null : (
                        "Select An Image"
                      )}
                    </div>
                    {currentEditedPost.background_color == "#fffff" ? (
                      <img
                        src="../icons/icons8-photo-48.png"
                        alt=""
                        onClick={handleEditImage}
                      />
                    ) : null}
                  </div>
                )}
              </div>
              <div className="accessibility">
                <div className="public">
                  <input
                    type="radio"
                    id="public"
                    name="accessibility"
                    value="public"
                    checked={currentEditedPost.accessibility === "public"}
                    onChange={(e) => setEditedPostAccessibility(e.target.value)}
                  />
                  <label htmlFor="public">Public</label>
                </div>
                <div className="private">
                  <input
                    type="radio"
                    id="private"
                    name="accessibility"
                    value="private"
                    onChange={(e) => setEditedPostAccessibility(e.target.value)}
                    checked={currentEditedPost.accessibility === "private"}
                  />
                  <label htmlFor="private">Private</label>
                </div>
              </div>
              <div className="buttons">
                <div className="cancel" onClick={handleCloseEditPost}>
                  Cancel
                </div>
                <div className="submit">
                  <input type="submit" value="Create" />
                </div>
              </div>
              <div className="errors">
                {editPostErrors && Object.keys(editPostErrors).length > 0
                  ? Object.keys(editPostErrors).map((key) => {
                      const value = editPostErrors[key];

                      // Check if the value is an array and has some specific condition
                      if (Array.isArray(value) && value.length > 0) {
                        // Do something with the value
                        return (
                          <div
                            key={key}
                            className="error"
                            style={{
                              broderRadius: "5px",
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

                      return null;
                    })
                  : null}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfileLayout;
