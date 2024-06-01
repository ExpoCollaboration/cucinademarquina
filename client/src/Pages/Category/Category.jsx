import './Category.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Logo from '../../assets/Icons/cucina-de-marquina-logo.png';
import { API_URL } from '../../config.js';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(0);
  const [setSelectedCategoryId] = useState(null);

  const [isChecked, setIsChecked] = useState(false);

  // Function to handle checkbox change for product status
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setStatus(!isChecked ? 1 : 0);
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

  // Function to load the selected image for the product
  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const toggleModalCreate = () => {
    setName('');
    setStatus(false);
    setFile(null);
    setModalCreate(!modalCreate);
  };

  const handleMenuItemClick = (index) => {
    setActiveMenuItem(index); // Set active menu item index
  };

  const handleToggleSidebar = () => {
    // Toggle sidebar
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hide');
  };

  // Function to fetch a product by ID for updating
  const getCategoryById = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/categories/${id}`,
      );
      const product = response.data;
      setName(product.name);
      setStatus(product.outOfStock);
      setIsChecked(product.outOfStock);
      setFile(product.image);
      setPreview(product.url);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = 'Categories';
    getAllCategory();
  }, []);

  const getAllCategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.log('Error fetching the category', error);
    }
  };

  // Function to toggle the update product modal
  const toggleModalUpdate = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    if (categoryId) {
      await getCategoryById(categoryId);
    }
    setModalUpdate(!modalUpdate);
  };

  // Function to save a new product
  const saveCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('status', status);
    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.post(`${API_URL}/categories`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
      toast.success('Category Created Successfully', toastConfig);
      getAllCategory();
      toggleModalCreate();
    } catch (error) {
      console.log(error);
    }
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
            <img src={profileImage} />
          </a>
        </nav>
        {/* NAVBAR */}

        {/* MAIN */}
        <main>
          <div className="category-container">
            {categories && categories.length > 0 ? (
              categories.map((category, index) => (
                <div key={index} className="category-row">
                  <img
                    src={category.url}
                    alt="product"
                    width={50}
                    height={50}
                  />
                  <h1>{category.name}</h1>
                </div>
              ))
            ) : (
              <div className="category-row">
                <span>No category found.</span>
              </div>
            )}
            <div className="add-Option" onClick={toggleModalCreate}>
              <i className="bx bx-plus"></i>
            </div>
          </div>
        </main>
        {/* MAIN */}
      </section>
      {/* CONTENT */}
      {modalCreate && (
        <div className="modal-cateogory">
          <div onClick={toggleModalCreate} className="overlay"></div>
          <div className="modal-content-category">
            <h1>Add Category</h1>
            <hr></hr>
            <form className="form" onSubmit={saveCategory}>
              <div>
                <label>
                  Name<span>*</span>
                </label>{' '}
                <br></br>
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Type category name"
                  required
                />
                {/* <h5>Validation Text</h5> */}
                <br />
                <br />
              </div>
              <div>{/* Empty Div */}</div>
              <div>
                <label>Product Image</label> <br />
                <input
                  type="file"
                  className="input"
                  onChange={loadImage}
                  required
                />
              </div>
              <br></br>
              <div className="category-btn-container">
                <button
                  type="button"
                  className="category-btn-cancel"
                  onClick={toggleModalCreate}
                >
                  Cancel
                </button>
                <button type="submit" className="category-btn-submit">
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
        <div className="modal-cateogory">
          <div onClick={toggleModalUpdate} className="overlay"></div>
          <div className="modal-content-category">
            <h1>Add Category</h1>
            <hr></hr>
            <form className="form">
              <div>
                <label>
                  Name<span>*</span>
                </label>{' '}
                <br></br>
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Type category name"
                  required
                />
                <h5>Validation Text</h5>
              </div>
              <div
                className={`product-cell status-cell ${
                  isChecked ? 'disabled' : 'active'
                }`}
              >
                <label>Category Status</label>
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
                <input type="hidden" name="status" value={isChecked ? 1 : 0} />
                <p>
                  Status: {!isChecked ? '0 (In Stock)' : '1 (Out of Stock)'}
                </p>
              </div>
              <div className="update_img">
                <label>Category Image</label> <br />
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
              <div className="category-btn-container">
                <button
                  type="button"
                  className="category-btn-cancel"
                  onClick={toggleModalCreate}
                >
                  Cancel
                </button>
                <button type="submit" className="category-btn-submit">
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
      <ToastContainer />
    </>
  );
};

export default Category;
