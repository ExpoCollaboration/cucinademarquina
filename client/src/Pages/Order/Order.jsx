import './Order.css';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import CartSidebar from '../../components/CartSideBar/CartSideBar.jsx';
import Logo from '../../assets/Icons/cucina-de-marquina-logo.png';
import { API_URL } from '../../config.js';

const Order = ({ account, normalAccount }) => {
  useEffect(() => {
    document.title = 'Ordering';
  }, []);

  const [loggedInAccount, setLoggedInAccount] = useState(null);

  const getUsernameForData = async () => {
    if(normalAccount === null) {
      console.log('Normal Account is not fetching yet, need to reload');
      location.reload();
    }

    const normalAccount_email = normalAccount.email;
    console.log('User email: ', normalAccount_email);

    try {
      const response = await axios.get(`${API_URL}/account/${normalAccount_email}`);
      setLoggedInAccount(response.data);
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

  useEffect(() => {
    getUsernameForData();
  }, [normalAccount]);

  // Fetch Google Account
  try {
    if (account) {
      // Fetch the Account
      console.log('General Info - Google Account Fetch');
      console.log({account});
      if (account.profile) {
        console.log('Specific Info - Google Account Fetch');
        if (account.profile.displayName) {
          console.log('Display Name:', account.profile.displayName);
        }
        if(account.profile.photos) {
          console.log('Photo: ', account.profile.photos[0].value);
        }
        if (account.profile.id) {
          console.log('ID:', account.profile.id);
        }
        if (account.profile.emails && account.profile.emails.length > 0) {
          console.log('Email:', account.profile.emails[0].value);
          console.log('Email Verified:', account.profile.emails[0].verified);
        }
      } else {
        console.log('Specific Info on google account Information is not available yet');
      }
    } else {
      console.log('Google Account not available yet.');
    }
    
  } catch (error) {
    console.log('Error', error);
  }

  const navigate = useNavigate();

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

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filterProducts = (category) => {
    const filtered = products.filter(
      product =>
        product.category === category &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProducts(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // setFilteredProducts(
    //   products.filter((product) =>
    //     product.name.toLowerCase().includes(event.target.value.toLowerCase())
    //   )
    // );
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products');
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories');
    }
  };

  // Function to remove a product from the cart
  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  const toastConfig = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  };

  const updateQuantity = (index, quantity) => {
    setIsCartOpen(true);
    if (quantity >= 0 && index >= 0 && index < cartItems.length) {
      const updatedCartItems = cartItems.map((item, idx) => {
        if (idx === index) {
          return { ...item, quantity };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    }
  };

  const addToCart = (product) => {
    if (product.outOfStock) {
      toast.error(
        'This product is currently disabled and cannot be added to the cart.',
        toastConfig,
      );
      return;
    }
  
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id,
    );
  
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      // Check if adding another unit exceeds the product's limit
      if (updatedCartItems[existingItemIndex].quantity < product.quantity) {
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        toast.warning(
          `You have reached the maximum quantity (${product.quantity}) for this product.`,
          toastConfig,
        );
      }
    } else {
      const initialQuantity = 1; 
      if (initialQuantity <= product.quantity) {
        setCartItems(prevCartItems => [
          ...prevCartItems,
          { ...product, quantity: initialQuantity },
        ]);
      } else {
        toast.error(
          'This product is currently disabled and cannot be added to the cart.',
          toastConfig,
        );
        return;
      }
    }
  
    setIsCartOpen(true);
  };

  // Modify decrementQuantity function to accept productID
  const decrementQuantity = (productID) => {
    setIsCartOpen(true);
    // Find the product index in cartItems array
    const productIndex = cartItems.findIndex(item => item.id === productID);
    if (productIndex !== -1 && cartItems[productIndex].quantity > 1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[productIndex].quantity -= 1;
      setCartItems(updatedCartItems);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.open(`${API_URL}/auth/logout`, '_self');
    navigate('/login');
  };

  return (
    <>
      <section id="order-content">
        {/* NAVBAR */}
        <nav>
          <div className="brand">
            <Link to={'/orders'} className="logo">
              <img src={Logo} width={35} height={35} />
              <h1>Cucina De Marquina</h1>
            </Link>
          </div>
          <form className='form-submit-query' action="#" onSubmit={handleSearchSubmit}>
            <div className="form-input">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
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
          <div className="header-order-category">
            <h1 className="category-menu">Menu</h1>
            <i
              id="category-cart-icon"
              className="bx bx-cart"
              onClick={() => setIsCartOpen(true)}
            ></i>
          </div>
          <div className="header-hero">
            <h1>
              Welcome {loggedInAccount && loggedInAccount.account_username ? loggedInAccount.account_username : (account && account.profile && account.profile.displayName ? account.profile.displayName : '')},
              to Cucina De Marquina!
            </h1>
            <h3>Please feel free to place your orders conveniently online.</h3>
          </div>
          <div className="category-order-container">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={index}
                  className="category-order-row"
                  onClick={() => filterProducts(category.name)}
                >
                  <img
                    src={category.url}
                    alt={category.name}
                    width={25}
                    height={25}
                  />
                  <p className="category-text-name">{category.name}</p>
                </div>
              ))
            ) : (
              <div className="category-order-row">No category found</div>
            )}
          </div>

          <div className="order-container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div key={index} className="product-row">
                  <div className="product-info">
                    <img
                      src={product.url}
                      alt="product"
                    />
                    <div className="info">
                      <h2 className="product-text-name">{product.name}</h2>
                      <h3 className="product-text-price">₱{product.price}</h3>
                      <div className="order-quantity-controls">
                        <button onClick={() => decrementQuantity(product.id)}>
                          {' '}
                          -{' '}
                        </button>
                        <span className="quantity">
                          {cartItems.find(item => item.id === product.id)
                            ?.quantity ?? 0}
                        </span>
                        <button
                          onClick={() => {
                            addToCart(product);
                          }}
                        >
                          {' '}
                          +{' '}
                        </button>
                      </div>
                      <div
                        className="add-cart-container"
                        onClick={() => addToCart(product)}
                      >
                        <button className="add-cart-btn">
                          <i className="bx bx-cart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="product-row">
                <span>No products found.</span>
              </div>
            )}
          </div>
        </main>
        {/* MAIN */}
      </section>
      {/* CONTENT */}
      {isCartOpen && (
        <CartSidebar
          googleAccount={{
            googleAccountEmail: account && account.profile ? account.profile.emails[0].value : '',
            googleAccountID: account && account.profile ? account.profile.id : '',
            googleAccountName: account && account.profile ? account.profile.displayName : '',
          }}
          accounts={{
            accountEmail: loggedInAccount ? loggedInAccount.account_email : '',
            accountNo: loggedInAccount ? loggedInAccount.account_id : '',
            fullName: loggedInAccount ? loggedInAccount.account_firstName + ' ' + loggedInAccount.account_lastName : '',
          }}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default Order;
