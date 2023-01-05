import React, { useCallback, useEffect, useState } from "react";
let timer;
const AuthContext = React.createContext({
  token: null,
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});
const getStoredData = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpireTime = localStorage.getItem("expireTime");
  const reamainingTime = calculateRemainingTime(storedExpireTime);
  if (reamainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expireTime");
    return null;
  }
  return {
    token: storedToken,
    duration: reamainingTime,
  };
};
const calculateRemainingTime = (expireTime) => {
  const currTime = new Date().getTime();

  const expTime = new Date(expireTime).getTime();
  return expTime - currTime;
};
export const AuthContextProvider = (props) => {
  let initialToken;
  const storedData = getStoredData();
  if (storedData) {
    initialToken = storedData.token;
  }
  const [token, setToken] = useState(initialToken);
  const isLoggedIn = !!token;
  const loginHandler = useCallback((token, expireTime) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expireTime", expireTime);
    setToken(token);
    const reamainingTime = calculateRemainingTime(expireTime);
    timer = setTimeout(logoutHandler, reamainingTime);
  }, []);
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expireTime");
    setToken(null);
    if (timer) {
      clearTimeout(timer);
    }
  };
  useEffect(() => {
    if (storedData) {
      timer = setTimeout(logoutHandler, storedData.duration);
    }
  }, [storedData, loginHandler]);

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
