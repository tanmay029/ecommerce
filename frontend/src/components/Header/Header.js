import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiSettings, FiChevronDown } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Close dropdown when clicking outside
  const handleMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Safe function to get user initials
  const getUserInitials = (user) => {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  // Safe function to get user name
  const getUserName = (user) => {
    if (!user || !user.name) return 'User';
    return user.name;
  };

  // Safe function to get user email
  const getUserEmail = (user) => {
    if (!user || !user.email) return '';
    return user.email;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>FashionStore</h1>
          </Link>

          <nav className="nav">
            <ul className="nav-links">
              <li>
                <Link to="/products?category=men">Men</Link>
              </li>
              <li>
                <Link to="/products?category=women">Women</Link>
              </li>
              <li>
                <Link to="/products?category=kids">Kids</Link>
              </li>
              <li>
                <Link to="/products">All Products</Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-link">
              <FiShoppingCart />
              {cartItemsCount > 0 && (
                <span className="cart-count">{cartItemsCount}</span>
              )}
            </Link>

            {userInfo ? (
              <div className="user-menu">
                <button 
                  className="user-menu-trigger"
                  onClick={handleMenuToggle}
                >
                  <div className="user-avatar">
                    {getUserInitials(userInfo)}
                  </div>
                  <span className="username">{getUserName(userInfo)}</span>
                  <FiChevronDown className={`chevron ${isUserMenuOpen ? 'open' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="user-info">
                        <div className="user-avatar-large">
                          {getUserInitials(userInfo)}
                        </div>
                        <div>
                          <div className="user-name">{getUserName(userInfo)}</div>
                          {getUserEmail(userInfo) && (
                            <div className="user-email">{getUserEmail(userInfo)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-links">
                      <Link 
                        to="/profile" 
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiUser />
                        <span>My Profile</span>
                      </Link>
                      
                      <Link 
                        to="/orders" 
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiPackage />
                        <span>Order History</span>
                      </Link>
                      
                      <Link 
                        to="/profile" 
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiSettings />
                        <span>Account Settings</span>
                      </Link>
                      
                      {userInfo && userInfo.role === 'admin' && (
                        <>
                          <div className="dropdown-divider"></div>
                          <Link 
                            to="/admin" 
                            className="dropdown-item admin-link"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiSettings />
                            <span>Admin Dashboard</span>
                          </Link>
                        </>
                      )}
                      
                      <div className="dropdown-divider"></div>
                      
                      <button 
                        onClick={logoutHandler}
                        className="dropdown-item logout-item"
                      >
                        <FiLogOut />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Backdrop to close menu */}
                {isUserMenuOpen && (
                  <div 
                    className="dropdown-backdrop"
                    onClick={() => setIsUserMenuOpen(false)}
                  ></div>
                )}
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="auth-link">Login</Link>
                <Link to="/register" className="auth-link register-btn">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
