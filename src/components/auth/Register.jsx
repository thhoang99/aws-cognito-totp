import { useState, useEffect } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const Register = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [errors, setErrors] = useState({
    cognito: null,
    blankfield: false,
    passwordmatch: false
  });
  let navigate = useNavigate();

  useEffect(() => {
    if (props.auth.userPass) {
      navigate("/confirmsignup/" + username, { replace: true });
    }
  }, [props]);

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
    const error = Validate(event, { username, email, phoneNumber, password, confirmpassword, errors });
    if (error) {
      setErrors({ ...errors, ...error });
    }

    // AWS Cognito integration here
    //const { username, email, phoneNumber, password } = state;
    //console.log(username, email, phoneNumber, password)
    try {
      const signUpResponse = await Auth.signUp({
        username,
        password,
        attributes: {
          email: email,
          phone_number: phoneNumber
        },
        autoSignIn: {
          enabled: true
        }
      });

      console.log(signUpResponse);
      props.auth.setUserPass(username, password);

    } catch (error) {
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      setErrors({
        ...errors,
        cognito: err
      });
    }
  }

  const onInputChange = event => {
    switch (event.target.id) {
      case "username":
        setUsername(event.target.value);
        break;
      case "email":
        setEmail(event.target.value);
        break;
      case "phoneNumber":
        setPhoneNumber(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
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
        <h1>Register</h1>
        <FormErrors formerrors={errors} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                id="username"
                aria-describedby="userNameHelp"
                placeholder="Enter username"
                value={username}
                onChange={onInputChange}
              />
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
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
                className="input"
                id="phoneNumber"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-phone"></i>
              </span>
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
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );

}

export default Register;