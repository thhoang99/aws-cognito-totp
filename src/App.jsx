import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
//import Products from './components/Products';
//import ProductAdmin from './components/ProductAdmin';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
import ChangePassword from './components/auth/ChangePassword';
import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
import Welcome from './components/auth/Welcome';
import Footer from './components/Footer';
import { Auth } from 'aws-amplify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import ConfirmSignUp from './components/auth/ConfirmSignUp';
import { CustomSetupTOTP } from './components/auth/CustomSetupTOTP';
library.add(faEdit);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [user, _setUser] = useState(null);
  const [userPass, _setUserPass] = useState(null);

  const setAuthStatus = authenticated => {
    setIsAuthenticated(authenticated)
  }

  const setUser = user => {
    console.log(user)
    _setUser(user)
  }

  const setUserPass = (username, password) => {
    _setUserPass({ username, password })
  }

  

  useEffect(() => { 
    const fetchUser = async () => {
      try {
        //const session = await Auth.currentSession();
  
        //console.log(session);
        const user = await Auth.currentAuthenticatedUser();
        setAuthStatus(true);
        console.log(user)
        setUser(user);
      } catch (error) {
        if (error !== 'No current user') {
          console.log(error);
        }
      }
      setIsAuthenticating(false);
    }   
    fetchUser();

  }, []);

  const authProps = {
    isAuthenticated: isAuthenticated,
    user: user,
    userPass: userPass,
    setAuthStatus: setAuthStatus,
    setUser: setUser,
    setUserPass: setUserPass
  }

  return (
    !isAuthenticating &&
    <div className="App">
      <Router>
        <div>
          <Navbar auth={authProps} />
          <Routes>
            <Route index path="/" element={<Home auth={authProps} />} />
            {
              // <Route path="/products" element={<Products auth={authProps} />} />
              // <Route path="/admin" element={<ProductAdmin auth={authProps} />} />
            }
            <Route path="/login" element={<LogIn auth={authProps} />} />
            <Route path="/register" element={<Register auth={authProps} />} />
            <Route path="/confirmsignup/:username" element={<ConfirmSignUp auth={authProps} />} />
            <Route path="/setupTOTP" element={<CustomSetupTOTP auth={authProps} />} />
            <Route path="/forgotpassword" element={<ForgotPassword auth={authProps} />} />
            <Route path="/forgotpasswordverification" element={<ForgotPasswordVerification auth={authProps} />} />
            <Route path="/changepassword" element={<ChangePassword auth={authProps} />} />
            <Route path="/changepasswordconfirmation" element={<ChangePasswordConfirm auth={authProps} />} />
            <Route path="/welcome" element={<Welcome auth={authProps} />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
