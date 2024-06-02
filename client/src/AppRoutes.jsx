import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as jose from 'jose';
import OrderPage from '../src/Pages/Order/Order.jsx';
import Product from '../src/Pages/Product/Product.jsx';
import Category from '../src/Pages/Category/Category.jsx';
import Transaction from '../src/Pages/Transaction/Transaction.jsx';
import Receipt from '../src/components/Receipt/Receipt.jsx';
import Login from '../src/Pages/Login/Login.jsx';
import Register from '../src/Pages/Register/Register.jsx';
import Profile from '../src/Pages/Profile/Profile.jsx';
import Forbidden from './Pages/Unauthorize/Forbidden.jsx';
import Maintenance from './Pages/Maintenance/Maintenance.jsx';
import { API_URL } from './config.js';

function AppRoutes() {
  const [user, setUser] = useState({});
  const [normalAccount, setNormalAccount] = useState({});
  const isManager = true;
  const isMaintenance = true;

  const getNormalAccount = () => {
    try {
      const storedTokenAccount = localStorage.getItem('token');
      
      if (!storedTokenAccount) {
        console.log('Token not found in localStorage');
        return;
      }
      
      const decode = jose.decodeJwt(storedTokenAccount);
      
      if (!decode) {
        console.log('Decoding JWT returned undefined');
        return;
      }

      console.log('Decoded JWT:', decode);
      
      setNormalAccount(decode);
    } catch (error) {
      console.log('Error decoding JWT Token', error);
    }
  };

  async function getGoogleInfo() {
    try {
      const response = await fetch(`${API_URL}/auth/login/success`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        console.log('A data of the google has been authorized fetch', response.status);
        const data = await response.json();
        return data.user;
      } if (response.status === 401) {
        console.log('Unauthorized Data fetch yet', response.status);
      }
      else {
        console.error('Failed to fetch google data:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching google data:', error);
      return null;
    }
  }
  
  useEffect(() => {
    async function fetchGoogleData () {
      const googleData = await getGoogleInfo();

      if(googleData) {
        setUser(googleData); 
      }
    }

    fetchGoogleData();
    getNormalAccount();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/orders"
            element={user || normalAccount ? <OrderPage account={user} normalAccount={normalAccount} /> : <Navigate to="/login" /> }
          />

          {/* Manager */}
          <Route path="/products" element={isManager ? <Product normalAccount={normalAccount} account={user} /> : <Navigate to='/forbidden' />} />
          <Route path="/categories" element={isManager ? <Category normalAccount={normalAccount} account={user} /> : <Navigate to='/forbidden' />} />
          <Route path="/transactions" element={isManager ? <Transaction normalAccount={normalAccount} account={user} /> : <Navigate to='/forbidden' />} />
          <Route path="/receipt/:id" element={isManager ? <Receipt /> : <Navigate to='/forbidden' />} />

          {/* Customer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={isMaintenance ? <Navigate to='/maintenance' /> : <Profile />} />
          
          {/* VALIDATION */}
          <Route path='/forbidden' element={<Forbidden />} />
          <Route path='/maintenance' element={<Maintenance />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRoutes;