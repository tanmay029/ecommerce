import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { authAPI } from '../../api/api';
import { setCredentials } from '../../store/slices/authSlice';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo } = useSelector((state) => state.auth);

  const redirect = searchParams.get('redirect') || '/';

  const registerMutation = useMutation(authAPI.register, {
    onSuccess: (data) => {
      dispatch(setCredentials(data.data));
      navigate(redirect);
      toast.success(`Welcome to FashionStore, ${data.data.name}!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    const { password } = formData;
    setPasswordValidation({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    });
  }, [formData.password]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    registerMutation.mutate({ name, email, password });
  };

  const isPasswordMatch = formData.password && formData.confirmPassword && 
                         formData.password === formData.confirmPassword;
  const isPasswordMismatch = formData.confirmPassword && 
                           formData.password !== formData.confirmPassword;

  return (
    <div className="register-page">
      <div className="register-background">
        <div className="background-overlay"></div>
      </div>
      
      <div className="container">
        <div className="register-container">
          <div className="register-form-wrapper">
            <div className="register-header">
              <h1>Create Account</h1>
              <p>Join FashionStore and discover amazing deals</p>
            </div>
            
            <form onSubmit={submitHandler} className="register-form">
              <div className="form-group">
                <label htmlFor="name">
                  <FiUser className="label-icon" />
                  Full Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FiMail className="label-icon" />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
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
                
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-indicators">
                      <div className={`strength-item ${passwordValidation.length ? 'valid' : ''}`}>
                        {passwordValidation.length ? <FiCheck /> : <FiX />}
                        <span>At least 6 characters</span>
                      </div>
                      <div className={`strength-item ${passwordValidation.uppercase ? 'valid' : ''}`}>
                        {passwordValidation.uppercase ? <FiCheck /> : <FiX />}
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`strength-item ${passwordValidation.lowercase ? 'valid' : ''}`}>
                        {passwordValidation.lowercase ? <FiCheck /> : <FiX />}
                        <span>One lowercase letter</span>
                      </div>
                      <div className={`strength-item ${passwordValidation.number ? 'valid' : ''}`}>
                        {passwordValidation.number ? <FiCheck /> : <FiX />}
                        <span>One number</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FiLock className="label-icon" />
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className={isPasswordMismatch ? 'error' : isPasswordMatch ? 'success' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                
                {isPasswordMismatch && (
                  <div className="password-match error">
                    <FiX /> Passwords do not match
                  </div>
                )}
                
                {isPasswordMatch && (
                  <div className="password-match success">
                    <FiCheck /> Passwords match
                  </div>
                )}
              </div>

              <div className="terms-checkbox">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                className="btn register-btn"
                disabled={registerMutation.isLoading || isPasswordMismatch}
              >
                {registerMutation.isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="register-footer">
              <p>
                Already have an account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
          
          <div className="register-sidebar">
            <div className="sidebar-content">
              <h2>Why Join FashionStore?</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">🎁</div>
                  <div className="benefit-text">
                    <h4>Exclusive Member Deals</h4>
                    <p>Get access to member-only discounts and early sale notifications</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">📦</div>
                  <div className="benefit-text">
                    <h4>Order Tracking</h4>
                    <p>Track your orders and manage your purchase history easily</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">❤️</div>
                  <div className="benefit-text">
                    <h4>Wishlist & Favorites</h4>
                    <p>Save items for later and get notified when they go on sale</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🏆</div>
                  <div className="benefit-text">
                    <h4>Loyalty Rewards</h4>
                    <p>Earn points with every purchase and unlock special rewards</p>
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

export default RegisterPage;
