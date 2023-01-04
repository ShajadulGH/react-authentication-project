import React, { useState } from "react";

const AuthContext = React.createContext({
  token: null,
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});
export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const isLoggedIn = !!token;
  const loginHandler = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };
  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const AuthValues = {
    token: token,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={AuthValues}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
