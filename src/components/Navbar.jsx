import { Auth } from 'aws-amplify';
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  let navigate = useNavigate();

  const handleLogOut = async event => {
    event.preventDefault();
    try {
      Auth.signOut();
      props.auth.setAuthStatus(false);
      props.auth.setUser(null);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleUserInfo = event => {
    // Placeholder for show info user
    console.log("coming soon");
  }


  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="hexal-logo.png" width="112" height="28" alt="hexal logo" />
        </a>
      </div>
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a href="/" className="navbar-item" style={{ alignSelf: "center" }}>
            Home
          </a>
          {
            /**
              <a href="/products" className="navbar-item">
                Products
              </a>
              <a href="/admin" className="navbar-item">
                Admin
              </a>
             */
          }
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            {props.auth.isAuthenticated && props.auth.user && (
              <a onClick={handleUserInfo} className="button is-link">
                Hello {props.auth.user.username}
              </a>
            )}
            <div className="buttons">
              {!props.auth.isAuthenticated && (
                <div>
                  <a href="/register" className="button is-primary">
                    <strong>Register</strong>
                  </a>
                  <a href="/login" className="button is-light">
                    Log in
                  </a>
                </div>
              )}
              {props.auth.isAuthenticated && (
                <a href="/" onClick={handleLogOut} className="button is-light">
                  Log out
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;