import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

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
                <span className="username">
                  <FiUser /> {userInfo.name}
                </span>
                {userInfo.isAdmin && (
                  <Link to="/admin" className="admin-link">
                    Admin
                  </Link>
                )}
                <button onClick={logoutHandler} className="logout-btn">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;