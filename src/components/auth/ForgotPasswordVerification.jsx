import { useState } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from 'aws-amplify';
import { useNavigate } from "react-router-dom";

const ForgotPasswordVerification = () => {
  const [verificationcode, setVerificationcode] = useState("");
  const [email, setEmail] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [errors, setErrors] = useState({
    cognito: null,
    blankfield: false
  });
  let navigate = useNavigate();

  const clearErrorState = () => {
    setErrors({
      cognito: null,
      blankfield: false
    });
  };

  const passwordVerificationHandler = async event => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const error = Validate(event, { verificationcode, email, newpassword });
    if (error) {
      setErrors({ ...errors, ...error });
    }

    // AWS Cognito integration here
    try {
      await Auth.forgotPasswordSubmit(
        email,
        verificationcode,
        newpassword
      );
      navigate("/changepasswordconfirmation");
    } catch (error) {
      console.log(error);
    }
  };

  const onInputChange = event => {
    switch (event.target.id) {
      case "verificationcode":
        setVerificationcode(event.target.value);
        break;
      case "email":
        setEmail(event.target.value);
        break;
      case "newpassword":
        setNewpassword(event.target.value);
        break;
      default:
        break;
    }
    document.getElementById(event.target.id).classList.remove("is-danger");
  };


  return (
    <section className="section auth">
      <div className="container">
        <h1>Set new password</h1>
        <p>
          Please enter the verification code sent to your email address below,
          your email address and a new password.
        </p>
        <FormErrors formerrors={errors} />

        <form onSubmit={passwordVerificationHandler}>
          <div className="field">
            <p className="control">
              <input
                type="text"
                className="input"
                id="verificationcode"
                aria-describedby="verificationCodeHelp"
                placeholder="Enter verification code"
                value={verificationcode}
                onChange={onInputChange}
              />
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="email"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                type="password"
                className="input"
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
            <p className="control">
              <button className="button is-success">
                Submit
              </button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ForgotPasswordVerification;