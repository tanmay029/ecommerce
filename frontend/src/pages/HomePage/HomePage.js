import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productsAPI } from '../../api/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './HomePage.css';

const HomePage = () => {
  // Fetch featured products
  const {  featuredProducts, isLoading } = useQuery(
    'featuredProducts',
    () => productsAPI.getProducts({ featured: true, pageSize: 8 })
  );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-badge">🌟 New Collection 2025</span>
              <h1>Fashion That Speaks Your Style</h1>
              <p>
                Discover the latest trends in fashion with our premium collection. 
                From casual wear to elegant outfits, find everything you need to express your unique style.
              </p>
              <div className="hero-buttons">
                <Link to="/products" className="btn btn-primary hero-btn">
                  Shop Now
                </Link>
                <Link to="/products?category=featured" className="btn btn-secondary hero-btn">
                  View Collection
                </Link>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h3>10K+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="stat-item">
                <h3>500+</h3>
                <p>Premium Products</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Top Brands</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>Free delivery on orders over $100. Fast and reliable shipping worldwide.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>30-day hassle-free return policy. Not satisfied? Get your money back.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Payment</h3>
              <p>Your payment information is secure with our encrypted checkout process.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Quality Guaranteed</h3>
              <p>Premium quality products from trusted brands. 100% authentic guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Find exactly what you're looking for</p>
          </div>
          <div className="categories-grid">
            <Link to="/products?category=men" className="category-card men">
              <div className="category-overlay"></div>
              <div className="category-content">
                <h3>Men's Fashion</h3>
                <p>Stylish & Comfortable</p>
                <span className="category-btn">Shop Now →</span>
              </div>
            </Link>
            <Link to="/products?category=women" className="category-card women">
              <div className="category-overlay"></div>
              <div className="category-content">
                <h3>Women's Fashion</h3>
                <p>Elegant & Trendy</p>
                <span className="category-btn">Shop Now →</span>
              </div>
            </Link>
            <Link to="/products?category=kids" className="category-card kids">
              <div className="category-overlay"></div>
              <div className="category-content">
                <h3>Kids Fashion</h3>
                <p>Fun & Playful</p>
                <span className="category-btn">Shop Now →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked items just for you</p>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <LoadingSpinner message="Loading featured products..." />
            </div>
          ) : (
            <>
              <div className="products-grid">
                {featuredProducts?.data?.products?.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="section-footer">
                <Link to="/products" className="btn btn-outline">
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Stay Updated with Latest Trends</h2>
              <p>Subscribe to our newsletter and get 10% off your first order!</p>
            </div>
            <div className="newsletter-form">
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="newsletter-input"
                />
                <button className="btn btn-primary newsletter-btn">
                  Subscribe
                </button>
              </div>
              <p className="newsletter-note">
                🎁 Get exclusive deals and early access to new collections
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from real customers</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                ⭐⭐⭐⭐⭐
              </div>
              <p>
                "Amazing quality and fast shipping! I love shopping here. 
                The clothes fit perfectly and the customer service is excellent."
              </p>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>Verified Customer</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">
                ⭐⭐⭐⭐⭐
              </div>
              <p>
                "Great selection of trendy clothes at reasonable prices. 
                The return process was super easy too. Highly recommended!"
              </p>
              <div className="testimonial-author">
                <strong>Mike Chen</strong>
                <span>Verified Customer</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">
                ⭐⭐⭐⭐⭐
              </div>
              <p>
                "I've been shopping here for months and never disappointed. 
                Quality is top-notch and delivery is always on time."
              </p>
              <div className="testimonial-author">
                <strong>Emma Davis</strong>
                <span>Verified Customer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
