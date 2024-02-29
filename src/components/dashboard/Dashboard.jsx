import React, {useState, useContext} from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import './dashboard.css';
import SideBar from '../sidebar/SideBar';
import CreatePost from '../create_post/CreatePost';
import AllPosts from '../all_posts/AllPosts';
import { useMyContext } from '../../BackgroundController';

const Dashboard = ({mainBackground}) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const navigate = useNavigate();
   const { state, dispatch } = useMyContext();
    

    if(!token){
        return navigate('/login')
    }
    return (
        <div className={`dashboard ${state.background}`}>
            <div className="navbar-container">
                <NavBar/>
            </div>
            
            <div className="create-post">
                <CreatePost />
            </div>

            <div className="all-posts">
                <AllPosts />
            </div>


            <div className={`side-bar ${state.background}`}>
                <SideBar />
            </div>
            
        </div>
    )
}
export default Dashboard;