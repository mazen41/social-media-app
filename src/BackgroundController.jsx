// MyContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';

const MyContext = createContext();

const initialState = {
  background: localStorage.getItem('background') || 'light',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_BACKGROUND':
      localStorage.setItem('background', action.payload);
      return { ...state, background: action.payload };
    default:
      return state;
  }
};

const MyContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // You can perform any additional initialization here
  }, []); // Empty dependency array to run the effect only once

  return (
    <MyContext.Provider value={{ state, dispatch }}>
      {children}
    </MyContext.Provider>
  );
};

const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};

export { MyContextProvider, useMyContext };
