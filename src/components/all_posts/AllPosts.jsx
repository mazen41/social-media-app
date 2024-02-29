import React, { useState, useEffect, useRef, useContext } from "react";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import servicesApi from "../api/api";
import "./all_posts.css";
import { PlusOneTwoTone } from "@mui/icons-material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { selectClasses } from "@mui/material";
import { handleReplyCancel } from "../functions/functions";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../BackgroundController";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { commentAction } from "../functions/functions";
import { replyAction } from "../functions/functions";
import { userImageURL } from "../api/users_image";
import { postsImage } from "../api/posts_image";
const AllPosts = () => {
  const [postData, setPostData] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState();
  const [visiblePostTitleLength, setVisiblePostTitleLength] = useState(100);
  const [visiblePostCommentTitleLength, setVisiblePostCommentTitleLength] =
    useState(100);
  const [visiblePostCommentReplyLength, setVisiblePostReplyTitleLength] =
    useState(100);
  const userData = JSON.parse(localStorage.getItem("user"));
  const [showReplies, setShowReplies] = useState(false);
  const [userInformation, setUserInformation] = useState(userData);
  const bearerToken = localStorage.getItem("token");
  const [selectedPostLikes, setSelectedPostLikes] = useState();
  const [selectedPostDislikes, setSelectedPostDislikes] = useState();
  const [selectedPostCommentsLikes, setSelectedPostCommentsLikes] = useState();
  const [selectedPostCommentsDislikes, setSelectedPostCommentsDislikes] =
    useState();
  const [selectedPostComments, setSelectedPostComments] = useState();
  const inputRef = useRef(null);
  const [postComment, setPostComment] = useState("");
  const [addReply, setAddReply] = useState(false);
  const [Reply, setReply] = useState();
  const [replyTo, setReplyTo] = useState();
  const [commentReplyToId, setCommentReplyToId] = useState();
  const submitRef = useRef(null);
  const navigate = useNavigate();

  const [expandedComments, setExpandedComments] = useState([]);
  const [expandedReplies, setExpandedReplies] = useState([]);

  const { state, dispatch } = useMyContext();

  const toggleCommentContentLength = (commentId) => {
    setExpandedComments((prevExpandedComments) => {
      if (prevExpandedComments.includes(commentId)) {
        return prevExpandedComments.filter((id) => id !== commentId);
      } else {
        return [...prevExpandedComments, commentId];
      }
    });
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

  const handleSubmitRef = () => {
    if (submitRef.current) {
      submitRef.current.click();
    }
  };
  const handleReplyUser = (username, commentId) => {
    setReplyTo(username);
    setCommentReplyToId(commentId);
    setAddReply(true);
  };
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleCreateReply = async (e, postId) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("content", Reply);
      formData.append("comment_id", commentReplyToId);
      formData.append("user_id", userInformation.id);
      formData.append("post_id", postId);

      // await servicesApi.get("/sanctum/csrf-cookie");

      const response = await servicesApi.post(
        "api/posts/comment/reply",
        formData
      );

      if (response) {
        setAddReply(false);
        // setSelectedPostComments((prevComments) =>
        //   prevComments.map((comment) =>
        //     comment.id === commentReplyToId
        //       ? { ...comment, replies: [...comment.replies, response.data.reply] }
        //       : comment
        //   )
        // );
        setSelectedPostComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentReplyToId
              ? {
                  ...comment,
                  replies: comment.replies
                    ? [...comment.replies, response.data.reply]
                    : [response.data.reply],
                  replies_count: response.data.replies_count,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(selectedPostComments);
  const createComment = async (postId, userId, e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("content", postComment);
      formData.append("user_id", userId);
      formData.append("post_id", postId);

      // await servicesApi.get("/sanctum/csrf-cookie");

      const response = await servicesApi.post("api/posts/comment", formData);

      if (response) {
        setSelectedPostComments((prevComments) => [
          ...prevComments,
          response.data.comment,
        ]);
        setPostComment("");
        setPostData((prevData) => {
          return {
            ...prevData,
            posts: prevData.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  comments_count: response.data.comments_count,
                };
              }
              return post;
            }),
          };
        });
        setSelectedPost((prevState) => ({
          ...prevState,
          post: {
            ...prevState.post,
            comments_count: response.data.comments_count,
          },
        }));
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(selectedPost);
  const togglePostTitleLength = () => {
    setVisiblePostTitleLength(visiblePostTitleLength === 100 ? 1000 : 100);
  };
  const togglePostCommentTitleLength = () => {
    setVisiblePostCommentTitleLength(
      visiblePostCommentTitleLength === 100 ? 1000 : 100
    );
  };
  const togglePostReplyTitleLength = () => {
    setVisiblePostReplyTitleLength(visiblePostTitleLength === 100 ? 1000 : 100);
  };
  const handleGetPost = async (id) => {
    try {
      // await servicesApi.get("/sanctum/csrf-cookie");
      const response = await servicesApi.get(`/api/posts/${id}`);
      if (response) {
        setSelectedPost(response.data);
        setShowPostModal(true);
        document.body.style.overflow = "hidden";
        setSelectedPostLikes(response.data.post.likes);
        setSelectedPostDislikes(response.data.post.dislikes);
        setSelectedPostComments(response.data.post.comments);

        response.data.post.comments.forEach((comment) => {
          setSelectedPostCommentsLikes(comment.likes);
          setSelectedPostCommentsDislikes(comment.dislikes);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
    document.body.style.overflow = "";
  };
  useEffect(() => {
    (async () => {
      try {
        const response = await servicesApi.get("api/posts");

        if (response) {
          setPostData(response.data);
        } else {
          console.log("Failed To Get Posts:", response.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const handleLike = async (postId, postUser, likes) => {
    try {
      // await servicesApi.get("/sanctum/csrf-cookie");
      const response = await servicesApi.post(`api/posts/${postId}/like`, {
        userId: userInformation.id,
        LikedTo: postUser,
      });

      if (response) {
        setSelectedPostLikes(response.data.likes_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislikes = async (postId, postUser) => {
    try {
      // await servicesApi.get("/sanctum/csrf-cookie");
      const response = await servicesApi.post(`/api/posts/${postId}/dislike`, {
        userId: userInformation.id,
        LikedTo: postUser,
      });

      if (response) {
        setSelectedPostDislikes(response.data.dislikes_count);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCommentAction = (
    postId,
    userId,
    commentId,
    bearerToken,
    actionType,
    setSelectedPostComments
  ) => {
    commentAction(
      postId,
      userId,
      commentId,
      bearerToken,
      actionType,
      setSelectedPostComments
    );
  };
  const handleReplyAction = (
    postId,
    userId,
    replyId,
    bearerToken,
    actionType,
    setSelectedPostComments,
    commentId
  ) => {
    replyAction(
      postId,
      userId,
      replyId,
      bearerToken,
      actionType,
      setSelectedPostComments,
      commentId
    );
  };
  const Post = ({ post, specificPost }) => {
    const [visibleTitleLength, setVisibleTitleLength] = useState(100);
    const userData = JSON.parse(localStorage.getItem("user"));
    const [userInformation, setUserInformation] = useState(userData);
    const [likeColor, setLikeColor] = useState();
    const [liked, setLiked] = useState("");
    const bearerToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const postLikes = post.likes;
    const postDislikes = post.dislikes;

    const profileNavigate = (id) => {
      navigate(`/profile/${id}`);
    };
    const toggleTitleLength = () => {
      setVisibleTitleLength(visibleTitleLength === 100 ? 1000 : 100);
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
    const handleLike = async (postId) => {
      try {
        // await servicesApi.get("/sanctum/csrf-cookie");
        const response = await servicesApi.post(`/api/posts/${post.id}/like`, {
          userId: userInformation.id,
          LikedTo: post.user.id,
        });

        if (response) {
          setPostData((prevData) => {
            return {
              ...prevData,
              posts: prevData.posts.map((post) => {
                if (post.id === postId) {
                  // Update the likes property for the specific post
                  return { ...post, likes: response.data.likes_count };
                }
                return post;
              }),
            };
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleDislike = async (postId) => {
      // console.log(post.id)
      try {
        // await servicesApi.get("/sanctum/csrf-cookie");
        const response = await servicesApi.post(
          `/api/posts/${post.id}/dislike`,
          { userId: userInformation.id, dislikedTo: post.user.id }
        );

        if (response) {
          // setPostDislikes(response.data.dislikes_count);
          setPostData((prevData) => {
            return {
              ...prevData,
              posts: prevData.posts.map((post) => {
                if (post.id === postId) {
                  // Update the likes property for the specific post
                  return { ...post, dislikes: response.data.dislikes_count };
                }
                return post;
              }),
            };
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    return (
      post &&
      post.accessibility === "public" && (
        <div
          className="post"
          style={{
            backgroundColor: post.background_color
              ? post.background_color
              : "white",
            color:
              post.image || post.background_color == "white"
                ? "black"
                : getTextColorContrast(post.background_color),
          }}
        >
          <div className="user">
            {/* <img
              src={`${userImageURL}${post.user.image}`}
              style={{ cursor: "pointer" }}
              alt="User"
              onClick={() => profileNavigate(post.user.id)}
            /> */}
            {post.user.image ? (
              <img src={`${userImageURL}${post.user.image}`} />
            ) : (
              <img
                src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
              />
            )}
            <p>{post.user.name}</p>
          </div>

          <div className="line"></div>
          <div className="post_title">
            <p>
              {post.title.length > visibleTitleLength ? (
                <>
                  {visibleTitleLength === 100
                    ? post.title.slice(0, visibleTitleLength)
                    : post.title}
                  <button onClick={toggleTitleLength}>
                    {visibleTitleLength === 100 ? "See More" : "See Less"}
                  </button>
                </>
              ) : (
                post.title
              )}
            </p>
          </div>
          <div className="post_rest">
            {post.image && (
              <img src={`${postsImage}${post.image}`} alt="Uploaded Image" />
            )}
            <div className="post_information">
              <div className="like">
                <span
                  onClick={() => handleLike(post.id)}
                  style={{ color: likeColor ? likeColor : "" }}
                >
                  <FavoriteBorderIcon />
                </span>
                <p>{post.likes}</p>
              </div>
              <div className="dislikes">
                <span onClick={() => handleDislike(post.id)}>
                  <ThumbDownOffAltIcon />
                </span>
                <p>{post.dislikes}</p>
              </div>
              <div className="comments">
                <span onClick={() => handleGetPost(post.id)}>
                  <ChatOutlinedIcon />
                </span>
                <p>{post.comments_count}</p>
              </div>
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <div className={`all_posts ${state.background}`}>
      {/* {postData.posts &&
        postData.posts.map((data, index) => <Post key={index} post={data} />)
      } */}
      {postData.posts && postData.posts.length > 0 ? (
        postData.posts.map((data, index) => <Post key={index} post={data} />)
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
          <p>No Posts Have been made yet. Be the first one!</p>
        </div>
      )}

      {showPostModal && selectedPost && (
        <div className="post_modle_overlay"></div>
      )}

      {showPostModal && selectedPost && selectedPost.post && (
        <div className="selected_post">
          <div className="title">
            <div className="into">
              {selectedPost.post.user.image ? (
                <img src={`${userImageURL}${selectedPost.post.user.image}`} />
              ) : (
                <img
                  src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
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
              {selectedPost.post.title.length > visiblePostTitleLength ? (
                <>
                  {visiblePostTitleLength === 100
                    ? selectedPost.post.title.slice(0, visiblePostTitleLength) +
                      "..."
                    : selectedPost.title}
                  <button onClick={togglePostTitleLength}>
                    {visiblePostTitleLength === 100 ? "See More" : "See Less"}
                  </button>
                </>
              ) : (
                selectedPost.post.title
              )}
            </p>
          </div>
          <div
            className="image"
            style={{
              marginTop: "6px",
              paddingLeft: "15px",
              justifyContent: "start",
            }}
          >
            {selectedPost.post.image ? (
              <img
                src={`${postsImage}${selectedPost.post.image}`}
                style={{ width: "239px" }}
              />
            ) : null}
          </div>
          <div className="reset_of_post">
            <div className="like">
              <span
                onClick={() =>
                  handleLike(selectedPost.post.id, selectedPost.post.user.id)
                }
              >
                <FavoriteBorderIcon />
              </span>
              <p>{selectedPostLikes}</p>
            </div>
            <div className="dislikes">
              <span
                onClick={() =>
                  handleDislikes(
                    selectedPost.post.id,
                    selectedPost.post.user.id
                  )
                }
              >
                <ThumbDownOffAltIcon />
              </span>
              <p>{selectedPostDislikes}</p>
            </div>

            <div className="">
              <span>
                <ChatOutlinedIcon />
              </span>
              <p>{selectedPost.post.comments_count}</p>
            </div>
          </div>
          <hr />

          {selectedPostComments && selectedPostComments.length > 0 && (
            <div className="comments">
              {selectedPostComments.map((comment) => {
                return (
                  <div key={comment.id} className="comment">
                    <div className="user">
                      {comment.user.image ? (
                        <img src={`${userImageURL}${comment.user.image}`} />
                      ) : (
                        <img
                          src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
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
                              setSelectedPostComments
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
                              setSelectedPostComments
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
                            <div className="user">
                              {reply.user.image ? (
                                <img
                                  src={`${userImageURL}${reply.user.image}`}
                                />
                              ) : (
                                <img
                                  src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
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
                                      setSelectedPostComments,
                                      comment.id
                                    )
                                  }
                                >
                                  <FavoriteBorderIcon />
                                </span>
                                <p>{reply.likes}</p>
                              </div>
                              <div className="comment_dislikes">
                                <span>
                                  <ThumbDownOffAltIcon
                                    onClick={() =>
                                      handleReplyAction(
                                        selectedPost.post.id,
                                        userInformation.id,
                                        reply.id,
                                        bearerToken,
                                        "dislikes",
                                        setSelectedPostComments,
                                        comment.id
                                      )
                                    }
                                  />
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
                createComment(selectedPost.post.id, userInformation.id, e)
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

          {addReply && <div className="reply_overlay"></div>}
          {addReply && (
            <div className="new_reply">
              <form
                className="form"
                onSubmit={(e) => handleCreateReply(e, selectedPost.post.id)}
              >
                <div className="input">
                  <textarea
                    name="reply"
                    id=""
                    value={Reply}
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
                  <input hidden type="submit" ref={submitRef} />
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllPosts;
