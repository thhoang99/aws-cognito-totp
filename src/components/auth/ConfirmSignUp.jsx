import { useState } from 'react';
import FormErrors from "../FormErrors";
import { Auth } from 'aws-amplify';
import { useNavigate, useParams } from "react-router-dom";

const ConfirmSignUp = () => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({
    cognito: null,
    blankfield: false
  });
  const { username } = useParams();
  let navigate = useNavigate();


  const clearErrorState = () => {
    setErrors({
      cognito: null,
      blankfield: false
    });
  }

  const confirmSignUpHandler = async event => {
    event.preventDefault();

    // Form validation
    clearErrorState();
   
    // AWS Cognito integration here
    try {
      await Auth.confirmSignUp(username, code);
      navigate("/setupTOTP");
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
    // Just one state need change is code so set state direct is code
    setCode(event.target.value);
    document.getElementById(event.target.id).classList.remove("is-danger");
  }


  return (
    <section className="section auth">
      <div className="container">
        <h1>Confirm User Sign Up</h1>
        <p>
          Please enter the code sended to email address associated with your account.
        </p>
        <FormErrors formerrors={errors} />

        <form onSubmit={confirmSignUpHandler}>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input
                className="input"
                id="code"
                aria-describedby="codeVer"
                placeholder="Enter code"
                value={code}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-key"></i>
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

export default ConfirmSignUp;