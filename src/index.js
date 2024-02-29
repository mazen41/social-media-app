// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// // import reportWebVitals from './reportWebVitals';
// import { BackgroundProvider } from "./BackgroundController";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BackgroundProvider>
//       <App />
//     </BackgroundProvider>
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById("root")
);
