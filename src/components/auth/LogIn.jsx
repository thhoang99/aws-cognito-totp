import { useState } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const LogIn = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [errors, setErrors] = useState({
    cognito: null,
    blankfield: false,
  });
  let navigate = useNavigate();

  const clearErrorState = () => {
    setErrors({
      cognito: null,
      blankfield: false
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const error = Validate(event, { username, password });
    if (error) {
      setErrors({ ...errors, ...error });
      return;
    }

    // if not mfa code return
    if (!mfaCode) {
      document.getElementById("Authenticate Code").classList.add("is-danger");
      return;
    }

    // AWS Cognito integration here
    try {
      const user = await Auth.signIn(username, password);
      const mfaType = "SOFTWARE_TOKEN_MFA"; // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
      if (user?.challengeName === 'SMS_MFA' || user?.challengeName === 'SOFTWARE_TOKEN_MFA') {
        // You need to get the code from the UI inputs
        // and then trigger the following function with a button click
        const code = mfaCode;
        // If MFA is enabled, sign-in should be confirmed with the confirmation code
        const loggedUser = await Auth.confirmSignIn(
          user, // Return object from Auth.signIn()
          code, // Confirmation code
          mfaType // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
        );
        if (loggedUser) {
          navigate("/welcome", { replace: true });
        }
      } else if (user?.challengeName === 'NEW_PASSWORD_REQUIRED') {
        /*const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
        // You need to get the new password and required attributes from the UI inputs
        // and then trigger the following function with a button click
        // For example, the email and phone_number are required attributes
        const { username, email, phone_number } = await getInfoFromUserInput();
        const loggedUser = await Auth.completeNewPassword(
          user, // the Cognito User Object
          newPassword, // the new password
          // OPTIONAL, the required attributes
          {
            email, // from user input
            phone_number, // from user input
          }
        );*/
      } else if (user?.challengeName === 'MFA_SETUP') {
        // This happens when the MFA method is TOTP
        // The user needs to setup the TOTP before using it
        // More info please check the Enabling MFA part
        // await Auth.setupTOTP(user);
        navigate("setupTOTP");
      } else if (user?.challengeName === 'SELECT_MFA_TYPE') {
        // You need to get the MFA method (SMS or TOTP) from user
        // and trigger the following function
        // user object needs to be CognitoUser type
        user.sendMFASelectionAnswer(mfaType, {

          onFailure: (err) => {
            console.error(err);
          },
          mfaRequired: (challengeName, parameters) => {
            // Auth.confirmSignIn with SMS code
          },
          totpRequired: (challengeName, parameters) => {
            // Auth.confirmSignIn with TOTP code
          },
        });
      } else {
        // The user directly signs in
        console.log(user);
      }

      console.log(user);
      props.auth.setAuthStatus(true);
      props.auth.setUser(user);

    } catch (error) {
      console.log(error)
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      setErrors({
        ...errors,
        cognito: err
      });
    }
  };

  const onInputChange = event => {
    switch (event.target.id) {
      case "username":
        setUsername(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      case "mfaCode":
        setMfaCode(event.target.value);
        break;
      default:
        break;
    }
    document.getElementById(event.target.id).classList.remove("is-danger");
  };


  return (
    <section className="section auth">
      <div className="container">
        <h1>Log in</h1>
        <FormErrors formerrors={errors} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                id="username"
                aria-describedby="usernameHelp"
                placeholder="Enter username or email"
                value={username}
                onChange={onInputChange}
              />
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                id="password"
                placeholder="Password"
                value={password}
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
                id="mfaCode"
                placeholder="mfaCode"
                value={mfaCode}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-key"></i>
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
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LogIn;