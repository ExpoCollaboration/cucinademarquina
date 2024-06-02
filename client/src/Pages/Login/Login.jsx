/* eslint-disable react/no-unescaped-entities */
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import CucinaDeMarquina from '../../assets/Icons/cucina-de-marquina-logo.png';
import googleImage from '../../assets/Icons/google.png';
import { API_URL } from '../../config.js';

const Login = () => {
  const toastConfig = {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  };

  const navigate = useNavigate();

  const [loginformData, setLoginFormData] = useState({
    emailOrUsername: '',
    account_password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const storedEmailOrUsername = localStorage.getItem('emailOrUsername');
    if (storedEmailOrUsername) {
      setLoginFormData(prevData => ({
        ...prevData,
        emailOrUsername: storedEmailOrUsername,
      }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setLoginFormData({ ...loginformData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginformData.emailOrUsername || !loginformData.account_password) {
      toast.error('Please enter both email/username and password', toastConfig);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, loginformData);
      const { message, token } = response.data;
      console.log(message, token);

      // Save JWT token securely
      localStorage.setItem('token', token);

      // Save email/username if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('emailOrUsername', loginformData.emailOrUsername);
      } else {
        localStorage.removeItem('emailOrUsername');
      }

      toast.success('Successfully logged in! Redirecting to order pages', toastConfig);
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error('Login failed: ' + error.response.data.message, toastConfig);
      } else {
        toast.error('An error occurred while logging in. Please try again.', toastConfig);
      }
    }
  };

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const googleLogin = () => {
    window.open(`${API_URL}/auth/google`, '_self');
  };

  return (
    <>
      <div className="container-login-form">
        <div className="login-form">
          <div className="signin">
            <div className="content">
              <Link to={'https://www.facebook.com/CucinaDeMarquina?mibextid=ZbWKwL'}>
                <div className="container-logo">
                  <img src={CucinaDeMarquina} alt={CucinaDeMarquina} width={150} height={150} />
                </div>
              </Link>
              <h2>Log In</h2>

              <form className="form">
                <div className="inputBox">
                  <input
                    type="text"
                    required
                    name="emailOrUsername"
                    value={loginformData.emailOrUsername}
                    onChange={handleChange}
                  />
                  <i className="no-event">Username</i>
                </div>

                <div className="inputBox">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="account_password"
                    value={loginformData.account_password}
                    onChange={handleChange}
                    required
                  />
                  <i className="no-event">Password</i>
                  <span className="show-password" onClick={togglePassword}>
                    <i className={`bx ${passwordVisible ? 'bx-low-vision' : 'bx-show'}`}></i>
                  </span>
                </div>

                <div className="links">
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    {' '}
                    Remember Me
                  </label>
                  <a href="#">Forgot Password</a>
                </div>

                <div className="inputBox">
                  <input onClick={handleSubmit} type="submit" value="Login" />
                </div>

                <div className="links-register">
                  Don't have an account?
                  <Link to={'/register'}> register here</Link>
                </div>
                <div className="break">
                  <hr />
                  <span>Or</span>
                  <hr />
                </div>
                <div className="google-container" onClick={googleLogin}>
                  <div className="google-img">
                    <img src={googleImage} width={25} height={25} alt="Google Logo" />
                  </div>
                  <div className="google-text">
                    <div className="google-login">Continue with Google</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
