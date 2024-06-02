import './Product.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Logo from '../../assets/Icons/cucina-de-marquina-logo.png';
import { API_URL } from '../../config.js';

const Product = ({normalAccount, account}) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loggedInAccount, setLoggedInAccount] = useState(null);
  
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
    if (role && role !== 'Admin') {
      navigate('/forbidden');
    } else {
      console.log('Role:', role || 'not defined yet');
    }
  }, [role, navigate]);

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

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [outOfStock, setOutOfStock] = useState(false);
  const [description, setDescription] = useState();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filter products when category or status changes
  useEffect(() => {
    document.title = 'Products';
    filterProducts(selectedCategory, selectedStatus);
  }, [selectedCategory, selectedStatus]);

  // Function to filter products based on category and status
  const filterProducts = (category, status) => {
    let filtered = [...products];

    if (category !== 'All Categories') {
      filtered = filtered.filter(product => product.category === category);
    }

    if (status !== 'All Status') {
      filtered = filtered.filter(
        product => product.outOfStock === (status === 'Disabled'),
      );
    }

    setFilteredProducts(filtered);
  };

  // Handler for category change in filter
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
  };

  // Handler for status change in filter
  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [isChecked, setIsChecked] = useState(false);

  // Function to handle checkbox change for product status
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setOutOfStock(!isChecked ? 1 : 0);
  };

  // Function to load the selected image for the product
  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  // Function to toggle the create product modal
  const toggleModalCreate = () => {
    setName('');
    setPrice('');
    setQuantity('');
    setCategory('');
    setOutOfStock(false);
    setDescription('');
    setFile(null);
    setModalCreate(!modalCreate);
  };

  // Function to toggle the update product modal
  const toggleModalUpdate = async (productId) => {
    setSelectedProductId(productId);
    if (productId) {
      await getProductById(productId);
    }
    setModalUpdate(!modalUpdate);
  };

  // Fetch all products on component mount
  useEffect(() => {
    getProducts();
    getAllCategory();
  }, []);

  // Function to fetch all products from the server
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      const productsData = response.data.map((product) => {
        // Check if the quantity of the product is 0
        return { ...product, outOfStock: product.quantity === 0 };
      });
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching the products', error);
    }
  };

  const getAllCategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.log('Error fetching the category', error);
    }
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

  // Function to save a new product
  const saveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('category', category);
    formData.append('outOfStock', outOfStock);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.post(`${API_URL}/products`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
      toast.success('Product Created Successfully', toastConfig);
      getProducts();
      toggleModalCreate();
    } catch (error) {
      console.log(error);
    }
  };

  // Function to delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`h${API_URL}/products/${id}`);
      toast.success('Product Deleted Successfully', toastConfig);
      getProducts();
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete product', toastConfig);
    }
  };

  // Function to fetch a product by ID for updating
  const getProductById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      const product = response.data;
      setName(product.name);
      setPrice(product.price);
      setQuantity(product.quantity);
      setCategory(product.category);
      setOutOfStock(product.outOfStock);
      setIsChecked(product.outOfStock);
      setDescription(product.description);
      setFile(product.image);
      setPreview(product.url);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to update an existing product
  const updateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('category', category);
    formData.append('outOfStock', outOfStock);
    formData.append('description', description);

    // Check if a new file is selected
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.patch(
        `${API_URL}/products/${selectedProductId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Product updated successfully');
      toast.success('Product Updated Successfully', toastConfig);

      console.log('Response:', response.data);
      getProducts();
      toggleModalUpdate(null);
    } catch (error) {
      console.log('Update error:', error);
    }
  };

  const [activeMenuItem, setActiveMenuItem] = useState(0);

  const handleMenuItemClick = (index) => {
    setActiveMenuItem(index); // Set active menu item index
  };

  const handleToggleSidebar = () => {
    // Toggle sidebar
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hide');
  };

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
            <div className="app-content-header">
              <button
                className="app-content-headerButton"
                onClick={toggleModalCreate}
              >
                Add Product
              </button>
            </div>
            <div className="app-content-actions-wrapper">
              <div className="filter-button-wrapper">
                <div className="filter-container">
                  <button className="action-button" onClick={toggleMenu}>
                    <span>Filter</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-filter"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="filter-menu active">
                      <label>Category</label>
                      <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        <option value="All Categories">All Categories</option>
                        {categories && categories.length > 0 ? (
                          categories.map((category, index) => (
                            <option key={index} value={category.name}>
                              {category.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No categories found</option>
                        )}
                      </select>
                      <label>Status</label>
                      <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                      >
                        <option value="All Status">All Status</option>
                        <option value="Active">Available</option>
                        <option value="Disabled">Out of Stock</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="product-table">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>CreateDate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="product-item">
                          <img
                            src={product.url}
                            alt="product"
                            width={50}
                            height={50}
                          />
                          <p className="text-paragraph">{product.name}</p>
                        </td>
                        <td className={`container-status ${product.outOfStock ? 'outStock' : 'onstock'}`}>
                          <p>{product.outOfStock ? 'Disabled' : 'Available'}</p>
                        </td>
                        <td>{product.category}</td>
                        <td>{product.price}</td>
                        <td>{product.quantity}</td>
                        <td>{formatDate(product.createdAt)}</td>
                        <td>
                          <i
                            id="bx-edit"
                            onClick={() => toggleModalUpdate(product.id)}
                            className="bx bx-edit"
                          ></i>
                          <i
                            id="bx-trash"
                            onClick={() => deleteProduct(product.id)}
                            className="bx bx-trash"
                          ></i>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        {/* MAIN */}
      </section>
      {/* CONTENT */}
      {modalCreate && (
        <div className="modal">
          <div onClick={toggleModalCreate} className="overlay"></div>
          <div className="modal-product">
            <h1>Add Product</h1>
            <hr></hr>
            <form className="form" onSubmit={saveProduct}>
              <div className="form-grid">
                <div className="product-name-price">
                  <label>
                    Product Name<span>*</span>
                  </label>{' '}
                  <br></br>
                  <input
                    className="input"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex. Big Mac"
                    required
                  />
                  <br />
                  <br />
                  {/* <h5 >Validation Text</h5> */}
                  <label>
                    Price<span>*</span>
                  </label>{' '}
                  <br></br>
                  <input
                    className="input"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="₱0 - 9999"
                    required
                  />
                  <br />
                  <br />
                  {/* <h5 >Validation Text</h5> */}
                </div>
                <div>
                  <label>
                    Category<span>*</span>
                  </label>
                  <select
                    name="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories && categories.length > 0 ? (
                      categories.map((category, index) => (
                        <option key={index} value={category.name}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No categories found</option>
                    )}
                  </select>
                  <br />
                  <br />
                  {/* <h5 >Validation Text</h5> */}
                  <label>
                    Stock<span>*</span>
                  </label>{' '}
                  <br></br>
                  <input
                    className="input"
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder="Ex. 0 - 999"
                    required
                  />
                  <br />
                  <br />
                  {/* <h5 >Validation Text</h5> */}
                </div>
              </div>
              <div className="product-description">
                <label>
                  Description<span>*</span>
                </label>{' '}
                <br></br>
                <textarea
                  className="input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  cols={70}
                  placeholder="Enter the description"
                  required
                />
              </div>
              <div className="product-image">
                <label>Attachment</label>
                <span>*</span> <br />
                <input
                  type="file"
                  className="attachment-input"
                  onChange={loadImage}
                  required
                />
              </div>
              <br></br>
              <div className="btn-container">
                <button
                  type="button"
                  className="product-btn-cancel"
                  onClick={toggleModalCreate}
                >
                  Cancel
                </button>
                <button type="submit" className="product-btn-submit">
                  Submit
                </button>
              </div>
            </form>
            <button className="close-modal" onClick={toggleModalCreate}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
      {modalUpdate && (
        <div className="modal">
          <div onClick={toggleModalUpdate} className="overlay"></div>
          <div className="modal-product">
            <h1>Update Product</h1>
            <hr></hr>
            <form className="form" onSubmit={updateProduct}>
              <div>
                <label>
                  Product Name<span>*</span>
                </label>{' '}
                <br></br>
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Type product name"
                  required
                />
                <h5>Validation Text</h5>
                <label>
                  Price<span>*</span>
                </label>{' '}
                <br></br>
                <input
                  className="input"
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="₱500"
                  required
                />
                <h5>Validation Text</h5>
              </div>
              <div>
                <label>
                  Category<span>*</span>
                </label>
                <select
                  name="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories && categories.length > 0 ? (
                    categories.map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories found</option>
                  )}
                </select>
                <h5>Validation Text</h5>
                <label>
                  Quantity<span>*</span>
                </label>{' '}
                <br></br>
                <input
                  className="input"
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="Type product quantity"
                  required
                />
                <h5>Validation Text</h5>
              </div>
              <div>
                <label>
                  Description<span>*</span>
                </label>{' '}
                <br></br>
                <textarea
                  className="input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  cols={50}
                  maxLength={35}
                  minLength={25}
                  placeholder="Enter the description"
                  required
                />
              </div>
              <div
                className={`product-cell status-cell ${
                  isChecked ? 'disabled' : 'active'
                }`}
              >
                <label>Product Status</label>
                <br />
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="productOutStock"
                  id="productOutStock"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label
                  className="form-check-label"
                  htmlFor="productOutStock"
                ></label>
                <input
                  type="hidden"
                  name="outOfStock"
                  value={isChecked ? 1 : 0}
                />
                <p>
                  Status: {!isChecked ? '0 (In Stock)' : '1 (Out of Stock)'}
                </p>
              </div>
              <div className="update_img">
                <label>Product Image</label> <br />
                <input type="file" className="input" onChange={loadImage} />
                <div className="saved_img">
                  {preview ? (
                    <img src={preview} alt={name} width={120} height={120} />
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <br></br>
              <br></br>
              <div className="product-btn-container">
                <button
                  type="button"
                  className="product-btn-cancel"
                  onClick={toggleModalUpdate}
                >
                  Cancel
                </button>
                <button type="submit" className="product-btn-submit">
                  Update
                </button>
              </div>
            </form>
            <button className="close-modal" onClick={toggleModalUpdate}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Product;
