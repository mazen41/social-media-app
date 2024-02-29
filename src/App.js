// // import React, { useContext, useState, useCallback } from 'react';
// // import './App.css';
// // import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
// // import Register from './components/register/Register';
// // import Login from './components/login/Login';
// // import Dashboard from './components/dashboard/Dashboard';
// // import Profile from './components/profile/Profile';
// // import Settings from './components/personal_info_page/Settings';
// // import Welcome from './components/welcome/Welcome';
// // import { BackgroundContext, BackgroundProvider } from './BackgroundController';
// // const App = () => {
// //   const bearerToken = localStorage.getItem('token');

// //   const currentBackground = localStorage.getItem('background');

// //   const [background, setBackground] = useState(currentBackground);
// //   const mainBackground = () => {
// //     setBackground((prevBackground) => (prevBackground === 'light' ? 'dark' : 'light'));
// //   };

// //   return (
// //     <div className={`App ${background}`}>
// //       <BrowserRouter>
// //         <Routes>

// //           <Route path="/register" element={<Register />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/dashboard" element={<Dashboard mainBackground={mainBackground} />} />
// //           <Route path="/profile/:id" element={<Profile />} />
// //           <Route path="/settings" element={<Settings />} />
// //           {bearerToken ? (
// //             <Route path="/" element={<Navigate to="/dashboard" />} />
// //           ) : (
// //             <Route path="/" element={<Welcome />} />
// //           )}
// //         </Routes>
// //       </BrowserRouter>
// //     </div>
// //   );
// // }

// // export default App; 

// import React, { useContext, useState, useCallback } from 'react';
// import './App.css';
// import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
// import Register from './components/register/Register';
// import Login from './components/login/Login';
// import Dashboard from './components/dashboard/Dashboard';
// import Profile from './components/profile/Profile';
// import Settings from './components/personal_info_page/Settings';
// import Welcome from './components/welcome/Welcome';

// import { MyContextProvider } from './BackgroundController';



// const App = () => {
//   const bearerToken = localStorage.getItem('token');


//   return (

//     <BrowserRouter>
//       <div className={`App`}>
//         <Routes>
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/profile/:id" element={<Profile />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route
//             path="/"
//             element={bearerToken ? <Navigate to="/dashboard" /> : <Welcome />}
//           />
//         </Routes>
//       </div>
//     </BrowserRouter>

//   );
// }

// export default App;
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/register/Register';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Settings from './components/personal_info_page/Settings';
import Welcome from './components/welcome/Welcome';
import { MyContextProvider, useMyContext } from './BackgroundController';

const App = () => {
  const bearerToken = localStorage.getItem('token');

  // Move the MyContextProvider to wrap the entire component tree
  return (
    <MyContextProvider>
      <BrowserRouter>
        {/* Now useMyContext is within the scope of MyContextProvider */}
        <InnerApp bearerToken={bearerToken} />
      </BrowserRouter>
    </MyContextProvider>
  );
};

// Create an inner component to use the useMyContext hook
const InnerApp = ({ bearerToken }) => {
  const { state, dispatch } = useMyContext();
  const currentBackground = state.background;

  return (
    <div className={`App ${currentBackground}`}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/"
          element={bearerToken ? <Navigate to="/dashboard" /> : <Welcome />}
        />
      </Routes>
    </div>
  );
};

export default App;