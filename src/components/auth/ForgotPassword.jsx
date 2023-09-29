import { useState } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from 'aws-amplify';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
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
  }

  const forgotPasswordHandler = async event => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const error = Validate(event, { email });
    if (error) {
      setErrors({ ...errors, ...error });
    }

    // AWS Cognito integration here
    try {
      await Auth.forgotPassword(email);
      navigate("/forgotpasswordverification");
    } catch (error) {
      console.log(error);
    }
  }

  const onInputChange = event => {
    // Just one state need change is email so set state direct is email
    setEmail(event.target.value);
    document.getElementById(event.target.id).classList.remove("is-danger");
  }


  return (
    <section className="section auth">
      <div className="container">
        <h1>Forgot your password?</h1>
        <p>
          Please enter the email address associated with your account and we'll
          email you a password reset link.
        </p>
        <FormErrors formerrors={errors} />

        <form onSubmit={forgotPasswordHandler}>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input
                type="email"
                className="input"
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
            <p className="control">
              <a href="/forgotpassword">Forgot password?</a>
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

export default ForgotPassword;