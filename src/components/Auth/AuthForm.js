import { useRef, useState } from "react";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler = (e) => {
    console.log("working");

    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const sendUser = async () => {
      setIsLoading(true);
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDjqTuvP9UU9KIdm_58qGM0iISIAigCxsA",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      if (response.ok) {
        setIsLoading(false);
        alert("Succesfully Signed Up");
      } else {
        let errorMessage = "Authentication Failed!";
        const data = await response.json();
        if (data && data.error.errors[0].message) {
          errorMessage = data.error.errors[0].message;
          alert(errorMessage);
          setIsLoading(false);
        }
      }
    };
    if (isLogin) {
    } else {
      sendUser();
    }
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordRef} />
        </div>
        <div className={classes.actions}>
          {isLoading ? (
            <button>Loading...</button>
          ) : (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
