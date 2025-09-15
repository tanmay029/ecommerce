import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { authAPI } from '../../api/api';
import { setCredentials } from '../../store/slices/authSlice';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo } = useSelector((state) => state.auth);

  const redirect = searchParams.get('redirect') || '/';

  const loginMutation = useMutation(authAPI.login, {
    onSuccess: (data) => {
      dispatch(setCredentials(data.data));
      navigate(redirect);
      toast.success(`Welcome back, ${data.data.name}!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@example.com');
      setPassword('admin123');
    } else {
      setEmail('john@example.com');
      setPassword('john123');
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="background-overlay"></div>
      </div>
      
      <div className="container">
        <div className="login-container">
          <div className="login-form-wrapper">
            <div className="login-header">
              <h1>Welcome Back!</h1>
              <p>Sign in to your account to continue shopping</p>
            </div>
            
            <form onSubmit={submitHandler} className="login-form">
              <div className="form-group">
                <label htmlFor="email">
                  <FiMail className="label-icon" />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <FiLock className="label-icon" />
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn login-btn"
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>
                New to FashionStore?{' '}
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                  Create an account
                </Link>
              </p>
            </div>

            <div className="demo-section">
              <div className="demo-header">
                <h3>🚀 Demo Accounts</h3>
                <p>Quick login for testing</p>
              </div>
              
              <div className="demo-buttons">
                <button
                  type="button"
                  className="demo-btn admin-demo"
                  onClick={() => fillDemoCredentials('admin')}
                >
                  👨‍💼 Admin Demo
                  <span>admin@example.com</span>
                </button>
                
                <button
                  type="button"
                  className="demo-btn user-demo"
                  onClick={() => fillDemoCredentials('user')}
                >
                  👤 User Demo
                  <span>john@example.com</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="login-sidebar">
            <div className="sidebar-content">
              <h2>Join Fashion Store</h2>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">🛍️</div>
                  <div className="feature-text">
                    <h4>Latest Fashion Trends</h4>
                    <p>Discover the newest styles and collections</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🚚</div>
                  <div className="feature-text">
                    <h4>Free Shipping</h4>
                    <p>Free delivery on orders over $100</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔄</div>
                  <div className="feature-text">
                    <h4>Easy Returns</h4>
                    <p>30-day hassle-free return policy</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⭐</div>
                  <div className="feature-text">
                    <h4>Quality Guaranteed</h4>
                    <p>Premium quality products you can trust</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
