import './Profile.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as jose from 'jose';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Icons/cucina-de-marquina-logo.png';
import { API_URL } from '../../config.js';

const Profile = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);

  const togglePassword1 = () => {
    console.log('trigger shit');
    setPasswordVisible1(!passwordVisible1);
  };

  const togglePassword2 = () => {
    setPasswordVisible2(!passwordVisible2);
  };

  useEffect(() => {
    document.title = 'Account';
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (!event.target.closest('.profile-name')) {
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [loggedInAccount, setLoggedInAccount] = useState(null);
  const [, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decode = jose.decodeJwt(storedToken);
      console.log('Token ' + storedToken);
      console.log({ decode });

      setToken(storedToken);
      setLoggedInAccount(decode);

      const username = decode.username;

      if (username) {
        getLoggedInAccount(storedToken, username); // Call API with token and username
      } else {
        console.error('Username not found in token');
      }
    } else {
      console.error('Token not found in localStorage');
    }
  }, []);

  const getLoggedInAccount = async (token, username) => {
    try {
      const response = await axios.get(
        `${API_URL}/account/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLoggedInAccount(response.data); // Update state with logged-in account data
      console.log(response.data);
      console.log(token);
    } catch (error) {
      console.error('Error fetching logged-in account:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <section id="profile-content">
        {/* NAVBAR */}
        <nav>
          <Link to={'/orders'} className="logo">
            <img src={Logo} width={35} height={35} />
            <h1>Cucina De Marquina</h1>
          </Link>
          <div className="container-logut-drop-down" onClick={toggleDropdown}>
            <div className="profile-name">
              <div className="profile-content-icon">
                <i className="bx bx-user"></i>{' '}
              </div>
              <div className="profile-content-name">
                {loggedInAccount ? loggedInAccount.account_username : ''}{' '}
              </div>
              <div className="profile-content-drop-down-menu">
                <i
                  className={`bx bx-chevron-down ${
                    isDropdownOpen ? 'rotate' : ''
                  }`}
                ></i>{' '}
              </div>
            </div>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <Link to={'/account'}>
                  <i className="bx bx-user"></i>Profile
                </Link>
                <Link to={'/login'} onClick={handleLogout}>
                  <i className="bx bx-log-out"></i>Logout
                </Link>
              </div>
            )}
          </div>
        </nav>
        {/* NAVBAR */}

        {/* MAIN */}
        <main>
          <div className="container-account-form">
            <div className="account-form">
              <div className="account-container">
                <div className="account-content">
                  <h3>
                    My Profile <i id="info" className="bx bx-info-circle"></i>
                  </h3>
                  <div className="account-form-field">
                    <div className="account-inputBox">
                      <input
                        type="text"
                        name="account_firstName"
                        required
                        value={
                          loggedInAccount
                            ? loggedInAccount.account_firstName
                            : ''
                        }
                      />{' '}
                      <i>First Name </i>
                    </div>

                    <div className="account-inputBox">
                      <input
                        type="text"
                        name="account_lastName"
                        required
                        value={
                          loggedInAccount
                            ? loggedInAccount.account_lastName
                            : ''
                        }
                      />{' '}
                      <i>Last Name </i>
                    </div>

                    <div className="account-inputBox">
                      <input
                        type="text"
                        name="account_contactNo"
                        required
                        value={
                          loggedInAccount
                            ? loggedInAccount.account_contactNo
                            : ''
                        }
                      />{' '}
                      <i>Phone Number</i>
                    </div>

                    <div className="edit-save-account">
                      <button type="submit">Save</button>
                    </div>
                  </div>

                  <h3>
                    Email <i id="info" className="bx bx-info-circle"></i>
                  </h3>

                  <div className="account-form-field">
                    <div className="account-inputBox">
                      <input
                        type="text"
                        name="account_firstName"
                        required
                        value={
                          loggedInAccount ? loggedInAccount.account_email : ''
                        }
                      />{' '}
                      <i>Email </i>
                    </div>

                    <div className="edit-save-account">
                      <button type="submit">Save</button>
                    </div>
                  </div>

                  <h3>
                    Password <i id="info" className="bx bx-info-circle"></i>
                  </h3>

                  <div className="account-form-field">
                    <div className="account-inputBox">
                      <input
                        type={passwordVisible1 ? 'text' : 'password'}
                        name="account_password"
                        required
                      />{' '}
                      <i>Current Password </i>
                      <span className="show-password">
                        <i
                          className={`bx ${
                            passwordVisible1 ? 'bx-low-vision' : 'bx-show'
                          }`}
                          onClick={togglePassword1}
                        ></i>
                      </span>
                    </div>

                    <div className="account-inputBox">
                      <input
                        type={passwordVisible2 ? 'text' : 'password'}
                        name="account_verifyPassword"
                        required
                      />
                      <i>New Password</i>
                      <span className="show-password">
                        <i
                          className={`bx ${
                            passwordVisible2 ? 'bx-low-vision' : 'bx-show'
                          }`}
                          onClick={togglePassword2}
                        ></i>
                      </span>
                    </div>
                    <div className="edit-save-account">
                      <button type="submit">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* MAIN */}
      </section>
    </>
  );
};

export default Profile;
