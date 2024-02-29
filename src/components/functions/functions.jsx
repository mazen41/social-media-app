import servicesApi from "../api/api";
import React, { useState } from "react";
// import React, { useState } from 'react';
export const handleLike = async (
  postId,
  postUser,
  userId,
  bearerToken,
  setData
) => {
  try {
    await servicesApi.get("/sanctum/csrf-cookie");
    const response = await servicesApi.post(`/api/posts/${postId}/like`, {
      userId: userId,
      LikedTo: postUser,
    });

    if (response) {
      setData((prevData) => {
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

export const selectedPostLike = async (
  postId,
  postUser,
  userId,
  bearerToken,
  setSelectedPost
) => {
  try {
    await servicesApi.get("/sanctum/csrf-cookie");
    const response = await servicesApi.post(`/api/posts/${postId}/like`, {
      userId: userId,
      LikedTo: postUser,
    });

    if (response) {
      setSelectedPost((prevState) => {
        const updatedPost = { ...prevState.post };

        updatedPost.likes = response.data.likes_count;

        return {
          ...prevState,
          post: updatedPost,
        };
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const selectedPostdislike = async (
  postId,
  postUser,
  userId,
  bearerToken,
  setSelectedPost
) => {
  try {
    await servicesApi.get("/sanctum/csrf-cookie");
    const response = await servicesApi.post(`/api/posts/${postId}/dislike`, {
      userId: userId,
      dislikedTo: postUser,
    });

    if (response) {
      setSelectedPost((prevState) => {
        const updatedPost = { ...prevState.post };

        updatedPost.dislikes = response.data.dislikes_count;

        return {
          ...prevState,
          post: updatedPost,
        };
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleReplyCancel = (setAddReply) => {
  setAddReply(false);
};
export const createReply = async (
  e,
  postId,
  userId,
  content,
  commentId,
  bearerToken,
  setComments,
  setAddReply
) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("comment_id", commentId);
    formData.append("user_id", userId);
    formData.append("post_id", postId);

    await servicesApi.get("/sanctum/csrf-cookie");

    const response = await servicesApi.post(
      "api/posts/comment/reply",
      formData
    );

    if (response) {
      setAddReply(false);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...comment.replies, response.data.reply],
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
export const handleDislike = async (
  postId,
  postUser,
  userId,
  bearerToken,
  setData
) => {
  try {
    await servicesApi.get("/sanctum/csrf-cookie");
    const response = await servicesApi.post(`/api/posts/${postId}/dislike`, {
      userId: userId,
      LikedTo: postUser,
    });

    if (response) {
      setData((prevData) => {
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

export const createComment = async (
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
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("content", postComment);
    formData.append("user_id", userId);
    formData.append("post_id", postId);

    await servicesApi.get("/sanctum/csrf-cookie");

    const response = await servicesApi.post("api/posts/comment", formData);

    if (response) {
      setComments((prevComments) => [...prevComments, response.data.comment]);
      setData((prevData) => {
        return {
          ...prevData,
          posts: prevData.posts.map((post) => {
            if (post.id === postId) {
              return { ...post, comments_count: response.data.comments_count };
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
      setPostComment("");
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

export function getTextColorContrast(backgroundColor) {
  if (!backgroundColor) return "black";

  const hexColor = backgroundColor.replace("#", "");
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness >= 128 ? "black" : "white";
}

export const createPost = async (
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
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("title", post);
    formData.append("user_id", userId);
    formData.append("background_color", color);

    // Append postImage only if it's not null
    if (postImage) {
      formData.append("image", postImage);
    }
    if (accessibility) {
      formData.append("accessibility", accessibility);
    }
    // await servicesApi.get("/sanctum/csrf-cookie");

    const response = await servicesApi.post("api/posts", formData);

    if (response) {
      // Handle success
      window.location.reload();
    } 
  } catch (error) {
    console.log(error);
    setCreatePostError("Something Went Wrong Try Again Later");
    setToastClassName("toast active");
  }
};

export const commentAction = async (
  postId,
  userId,
  commentId,
  bearerToken,
  actionType,
  setSelectedPostComments
) => {
  try {
    const formData = new FormData();
    formData.append("post_id", postId);
    formData.append("user_id", userId);
    formData.append("comment_id", commentId);
    formData.append("action_type", actionType);

    await servicesApi.get("/sanctum/csrf-cookie");

    const response = await servicesApi.post(
      "api/posts/comment/action",
      formData
    );

    if (response) {
      setSelectedPostComments((prevData) => {
        return prevData.map((item) => {
          if (item.id === commentId) {
            return { ...item, [actionType]: response.data };
          }
          return item;
        });
      });
    } else {
      console.log("Something Went Wrong We Are Going To Handle It !");
    }
  } catch (error) {
    console.log(error);
  }
};

export const replyAction = async (
  postId,
  userId,
  replyId,
  bearerToken,
  actionType,
  setSelectedPostComments,
  commentId
) => {
  try {
    const formData = new FormData();
    formData.append("post_id", postId);
    formData.append("user_id", userId);
    formData.append("reply_id", replyId);
    formData.append("action_type", actionType);

    await servicesApi.get("/sanctum/csrf-cookie");

    const response = await servicesApi.post("api/posts/reply/action", formData);

    if (response) {
      setSelectedPostComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId
                    ? { ...reply, [actionType]: response.data.action_count }
                    : reply
                ),
              }
            : comment
        )
      );
    } else {
      console.log("Something Went Wrong We Are Going To Handle It !");
    }
  } catch (error) {
    console.log(error);
  }
};
