import { createRoot } from 'react-dom/client';
import App from './App';
import 'bulma/css/bulma.min.css';
import './index.css';
import { Amplify } from 'aws-amplify';
import config from "./config";
import * as serviceWorker from './serviceWorker';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
});

const container = document.getElementById('root');

// Create a root.
const root = createRoot(container);

// Initial render
root.render( <App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();


