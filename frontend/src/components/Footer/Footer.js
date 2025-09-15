import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FashionStore</h3>
            <p>Your one-stop destination for trendy fashion and stylish clothing.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/products?category=men">Men's Collection</a></li>
              <li><a href="/products?category=women">Women's Collection</a></li>
              <li><a href="/products?category=kids">Kids' Collection</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#returns">Returns & Exchanges</a></li>
              <li><a href="#shipping">Shipping Information</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#facebook" aria-label="Facebook">Facebook</a>
              <a href="#instagram" aria-label="Instagram">Instagram</a>
              <a href="#twitter" aria-label="Twitter">Twitter</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 FashionStore. All rights reserved. | Built with React & Node.js</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;