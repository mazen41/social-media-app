import React, { useEffect, useState } from "react";
import "./side_bar.css";
import servicesApi from "../api/api";
import { useNavigate, useNavigationType } from "react-router-dom";
import { userImageURL } from "../api/users_image";
import { useMyContext } from "../../BackgroundController";

const SideBar = () => {
  const imageUrl = localStorage.getItem("imageUrl");
  const userData = JSON.parse(localStorage.getItem("user"));
  const [userInformation, setUserInformation] = useState(userData);
  const bearerToken = localStorage.getItem("token");
  const [likedUsers, setLikedUsers] = useState([]);
  const navigate = useNavigate();
  const { state, dispatch } = useMyContext();

  const handleProfile = (id) => {
    navigate(`/profile/${id}`);
  };
  useEffect(() => {
    (async () => {
      try {
        // await servicesApi.get('/sanctum/csrf-cookie');
        const response = await servicesApi.get(
          `api/users/${userInformation.id}/liked-to`
        );

        if (response) {
          setLikedUsers(response.data.users_liked);
        } else {
          console.log("Failed To Get Posts:", response.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div className="side">
      <div className="title">
        <p>People You Like</p>
      </div>
      <ul>
        {likedUsers ? (
          likedUsers.length > 0 ? (
            likedUsers.map((user) => (
              <li key={user.id} onClick={() => handleProfile(user.id)}>
                {user.image ? (
                  <img src={`${userImageURL}${user.image}`} alt={user.name} />
                ) : (
                  <img
                    src={`${userImageURL}icons8-profile-picture-50-removebg-preview.png`}
                  />
                )}
                <p>{user.name}</p>
              </li>
            ))
          ) : (
            <p>No users liked yet</p>
          )
        ) : (
          "no user liked yet"
        )}
      </ul>
    </div>
  );
};
export default SideBar;
