import classes from "./ProfileForm.module.css";

import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
const ProfileForm = () => {
  const newPassRef = useRef();
  const authCtx = useContext(AuthContext);
  const submitHandler = (e) => {
    e.preventDefault();

    const newPassword = newPassRef.current.value;
    const token = authCtx.token;
    const changePassword = async () => {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDjqTuvP9UU9KIdm_58qGM0iISIAigCxsA",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: token,
            password: newPassword,
            returnSecureToken: false,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        newPassRef.current.value = "";
        alert("Succesfully changed password");
      } else {
        let errorMessage = "Authentication Failed!";
        if (data && data.error.errors[0].message) {
          errorMessage = data.error.errors[0].message;
          throw new Error(errorMessage);
        }
      }
      console.log(data);
    };
    changePassword().catch((error) => alert(error.message));
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPassRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
