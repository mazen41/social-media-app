import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from '../navbar/NavBar';
import servicesApi from '../api/api';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProfileLayout from '../profile_layout/ProfileLayout';
function Profile() {
    const { id } = useParams();
    
    return (
        <div className="profile_container">
            <div className="navbar_container">
                <NavBar />
            </div>
            <div className="profile_layout">
                <ProfileLayout id={id}/>
            </div>
        </div>
    )
    
    
}

export default Profile;
