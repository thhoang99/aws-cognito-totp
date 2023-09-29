import { Alert, Button, TextField } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import QRCode from 'qrcode';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { useNavigate, useParams } from "react-router-dom";
import FormErrors from '../FormErrors';


export function CustomSetupTOTP(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [qrCode, setQrCode] = React.useState('');
  const [token, setToken] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const issuer = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Rc3FWWYRY"
  let navigate = useNavigate();
  //const user = props.auth.user;

  const getTotpCode = (
    issuer,
    username,
    secret,
  ) =>
    encodeURI(
      `otpauth://totp/AWSCognito:${username}?secret=${secret}&issuer=Cognito`,
    );
  //`otpauth://totp/${issuer}:${username}?secret=${secret}&issuer=${issuer}`,

  const generateQRCode = React.useCallback(
    async (currentUser) => {

      try {
        const newSecretKey = await Auth.setupTOTP(currentUser);
        const totpCode = getTotpCode(issuer, currentUser.username, newSecretKey);
        const qrCodeImageSource = await QRCode.toDataURL(totpCode);
        setQrCode(qrCodeImageSource);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [props],
  );

  const verifyTotpToken = async () => {
    // After verifying, user will have TOTP account in his TOTP-generating app (like Google Authenticator)
    // Use the generated one-time password to verify the setup
    setErrorMessage('');
    setIsVerifyingToken(true);

    const user = await Auth.currentAuthenticatedUser();

    //const data = await Auth.getPreferredMFA(user, { bypassCache: false });
    //console.log('Current preferred MFA type is: ' + data);

    Auth.verifyTotpToken(user, token)
      .then(async () => {
        await Auth.setPreferredMFA(user, 'TOTP');
        navigate("/welcome");
        //handleAuthStateChange();
        return null;
      })
      .catch(e => {
        console.error(e);
        /*if (/Code mismatch/.test(e.toString())) {
          setErrorMessage(intl.get('custom-setup-totp.security-code-mismatch'));
        }*/
      })
      .finally(() => {setIsVerifyingToken(false) });
  };

  React.useEffect(() => {
    // declare the data fetching function
    const fetchQR = async () => {
      try {
        const user = await Auth.signIn(props.auth.userPass.username, props.auth.userPass.password);
        //const user = await Auth.currentAuthenticatedUser();        
        if (!user) {
          return null;
        }
        generateQRCode(user);
      } catch (error) {
        if (error !== 'No current user') {
          console.log(error);
        }
      }
    }
    fetchQR();
  }, [generateQRCode]);

  const isValidToken = () => {
    return /^\d{6}$/gm.test(token);
  };

  return (
    <section className="section auth">
      <div className="container">
        <h1>Setup MFA</h1>
        <p>
          Scan QR below, after that type code from your Authenticator to
          input.
        </p>
        <FormErrors formerrors={errorMessage} />
        <form onSubmit={() => false} >
            {!isLoading && (
              <>
                <img
                  data-amplify-qrcode
                  src={qrCode}
                  alt="qr code"
                  width="228"
                  height="228"
                />
                <div className="field has-addons">
                  <div className="control">
                    <input className="input" type="text" onChange={e => {
                      setToken(e.target.value);
                    }} placeholder="Your Code" />
                  </div>
                  <div className="control">
                    <a className="button is-info"
                      disabled={!isValidToken() || isVerifyingToken}
                      onClick={verifyTotpToken}>
                      Send
                    </a>
                  </div>
                </div>              
              </>
            )}
          </form>
      </div>
    </section>


  );
}
