import './Transaction.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../../assets/Icons/cucina-de-marquina-logo.png';
import {API_URL} from '../../config.js';

const Transaction = () => {
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
          <span className="profile-name">Argie</span>
          <a href="#" className="profile">
            <img alt='profileImage' />
          </a>
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
