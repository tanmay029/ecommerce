import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { authAPI } from '../../api/api';
import { logout } from '../../store/slices/authSlice';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States'
  });

  // Initialize form with user data
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        city: userInfo.city || '',
        postalCode: userInfo.postalCode || '',
        country: userInfo.country || 'United States'
      });
    }
  }, [userInfo]);

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, you'd call an API to update profile
      console.log('Updating profile:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, call delete API
      toast.success('Account deletion requested');
      dispatch(logout());
      navigate('/');
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {formData.name.charAt(0).toUpperCase()}
              </div>
              <h3>{formData.name}</h3>
              <p>{formData.email}</p>
            </div>

            <nav className="profile-nav">
              <button className="nav-item active">
                👤 Personal Information
              </button>
              <button 
                className="nav-item"
                onClick={() => navigate('/orders')}
              >
                📦 Order History
              </button>
              <button className="nav-item">
                💳 Payment Methods
              </button>
              <button className="nav-item">
                📍 Addresses
              </button>
              <button className="nav-item">
                🔔 Notifications
              </button>
            </nav>

            <div className="profile-actions">
              <button className="btn btn-outline" onClick={handleLogout}>
                🚪 Logout
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteAccount}
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>

          <div className="profile-main">
            <div className="profile-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                <button 
                  className="btn btn-outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : '✏️ Edit'}
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="New York"
                    />
                  </div>

                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="10001"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="profile-stats">
              <h3>Account Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Total Orders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">$1,234</span>
                  <span className="stat-label">Total Spent</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">8</span>
                  <span className="stat-label">Wishlist Items</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">4.8</span>
                  <span className="stat-label">Avg Rating Given</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
