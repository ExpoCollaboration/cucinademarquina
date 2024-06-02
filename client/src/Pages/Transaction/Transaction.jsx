import './Transaction.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../../assets/Icons/cucina-de-marquina-logo.png';
import {API_URL} from '../../config.js';

const Transaction = ({normalAccount, account}) => {

  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loggedInAccount, setLoggedInAccount] = useState(null);
  useEffect(() => {
    if (role && role !== 'Admin') {
      navigate('/forbidden');
    } else {
      console.log('Role:', role || 'not defined yet');
    }
  }, [role, navigate]);
  
  const [googleEmail, setGoogleEmail] = useState(null);

  useEffect(() => {
    if(googleEmail && googleEmail !== 'web.versatily@gmail.com') {
      navigate('/forbidden');
    } else {
      console.log('Email', googleEmail || 'not defined yet');
    }
  }, [googleEmail, navigate]);

  useEffect(() => {
    // eslint-disable-next-line require-await
    const getEmailGoogleData = async () => {
      if(!account || !account.profile.emails[0].value) {
        console.error('Normal account or email is not defined');
        return;
      }

      const GoogleAccountEmail = account.profile.emails[0].value;
      setGoogleEmail(GoogleAccountEmail);
      console.log('Email', googleEmail);

    };

    getEmailGoogleData();
  }, [account]);

  useEffect(() => {
    const getUsernameForData = async () => {
      if (!normalAccount || !normalAccount.email) {
        console.error('Normal account or email is not defined');
        return;
      }

      const normalAccount_email = normalAccount.email;
      console.log('User email:', normalAccount_email);

      try {
        const response = await axios.get(`${API_URL}/account/${normalAccount_email}`);
        setLoggedInAccount(response.data);
        console.log('here is the account details', loggedInAccount);
        const createdBy = response.data.createdBy;
        setRole(createdBy);
        console.log('Role:', createdBy);
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      }
    };

    getUsernameForData();
  }, [normalAccount]);


  const [orders, setOrders] = useState([]);

  const [activeMenuItem, setActiveMenuItem] = useState(0);

  const handleMenuItemClick = (index) => {
    setActiveMenuItem(index); // Set active menu item index
  };

  const handleToggleSidebar = () => {
    // Toggle sidebar
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hide');
  };

  const getAllOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching the orders', error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  // Function to format a timestamp into a readable date string
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.open(`${API_URL}/auth/logout`, '_self');
    navigate('/login');
  };

  return (
    <>
      {/* SIDEBAR */}
      <section id="sidebar">
        <Link to="/">
          <a href="#" className="brand">
            <div className='logo'>
              <img src={Logo} width={35} height={35} />
            </div>
            <div className="text-logo">
              <span className="text">Cucina De Marquina</span>
            </div>
          </a>
        </Link>
        <ul className="side-menu top">
          <span className="side-text-category">Menu</span>
          <Link to="/orders">
            <li className={activeMenuItem === 1 ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuItemClick(0)}>
                <i className="bx bx-cart"></i>
                <span className="text">Order</span>
              </a>
            </li>
          </Link>
          <span className="side-text-category">Customize</span>
          <Link to="/products">
            <li className={activeMenuItem === 1 ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuItemClick(0)}>
                <i className="bx bx-package"></i>
                <span className="text">Product</span>
              </a>
            </li>
          </Link>
          <Link to="/categories">
            <li className={activeMenuItem === 1 ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuItemClick(0)}>
                <i className="bx bx-category"></i>
                <span className="text">Category</span>
              </a>
            </li>
          </Link>
          <span className="side-text-category">Transaction</span>
          <Link to="/transactions">
            <li className={activeMenuItem === 1 ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuItemClick(0)}>
                <i className="bx bx-history"></i>
                <span className="text">History</span>
              </a>
            </li>
          </Link>
        </ul>
      </section>
      {/* SIDEBAR */}

      <section id="content">
        {/* NAVBAR */}
        <nav>
          <i className="bx bx-menu" onClick={handleToggleSidebar}></i>
          <form action="#">
            <div className="form-input">
              <input type="search" placeholder="Search..." />
              <button type="submit" className="search-btn">
                <i className="bx bx-search"></i>
              </button>
            </div>
          </form>
          <div className="container-logut-drop-down" onClick={toggleDropdown}>
            <div className="profile-name">
              <div className="profile-content-icon">
                {account && account.profile && account.profile.photos && account.profile.photos.length > 0 ? (
                  <img src={account.profile.photos[0].value} width={35} height={35} />
                ) : (
                  <i id='icon' className='bx bx-user'></i>
                )}
              </div>
              <div className="profile-content-name">
                {loggedInAccount && loggedInAccount.account_username ? loggedInAccount.account_username : (account && account.profile && account.profile.displayName ? account.profile.displayName : '')}
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
          <div className="app-content">
            <div className="app-content-header"></div>
            <div className="product-table">
              <table>
                <thead>
                  <tr>
                    <th>Account No</th>
                    <th>OrderID</th>
                    <th>Full Name</th>
                    <th>Total Price</th>
                    <th>CreateDate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.accountId}</td>
                        <td>{order.transactionId}</td>
                        <td>{order.fullName}</td>
                        <td>{order.overallTotal}</td>
                        <td>{formatDate(order.createdDate)}</td>
                        <td>
                          <Link to={`/receipt/${order.transactionId}`}>
                            <i className="bx bx-receipt"></i>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No transaction found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        {/* MAIN */}
      </section>
    </>
  );
};

export default Transaction;
