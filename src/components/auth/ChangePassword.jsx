import { useState } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from 'aws-amplify';
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [oldpassword, setOldpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [errors, setErrors] = useState({
    cognito: null,
    blankfield: false,
    passwordmatch: false
  });
  let navigate = useNavigate();

  const clearErrorState = () => {
    setErrors({
      cognito: null,
      blankfield: false,
      passwordmatch: false
    });
  }

  const handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const error = Validate(event, { oldpassword, newpassword, confirmpassword });
    if (error) {
      setErrors({ ...errors, ...error });
    }

    // AWS Cognito integration here
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      await Auth.changePassword(
        user,
        oldpassword,
        newpassword
      );
      navigate("/changepasswordconfirmation");
    } catch (error) {
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      setErrors({ ...errors, cognito: err });
      console.log(err);
    }
  }

  const onInputChange = event => {
    switch (event.target.id) {
      case "oldpassword":
        setOldpassword(event.target.value);
        break;
      case "newpassword":
        setNewpassword(event.target.value);
        break;
      case "confirmpassword":
        setConfirmpassword(event.target.value);
        break;
      default:
        break;
    }
    document.getElementById(event.target.id).classList.remove("is-danger");
  }


  return (
    <section className="section auth">
      <div className="container">
        <h1>Change Password</h1>
        <FormErrors formerrors={errors} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                id="oldpassword"
                placeholder="Old password"
                value={oldpassword}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                id="newpassword"
                placeholder="New password"
                value={newpassword}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                id="confirmpassword"
                placeholder="Confirm password"
                value={confirmpassword}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <a href="/forgotpassword">Forgot password?</a>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-success">
                Change password
              </button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );

}

export default ChangePassword;