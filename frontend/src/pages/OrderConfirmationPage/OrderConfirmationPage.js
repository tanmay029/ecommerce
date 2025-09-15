import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ordersAPI } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const { id } = useParams();

  const {  order, isLoading, error } = useQuery(
    ['order', id],
    () => ordersAPI.getOrder(id)
  );

  if (isLoading) return <LoadingSpinner message="Loading order details..." />;
  if (error) return (
    <div className="error-page">
      <div className="container">
        <h1>Order Not Found</h1>
        <p>We couldn't find the order you're looking for.</p>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );

  const orderData = order.data;

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-header">
          <div className="success-animation">
            <div className="success-icon">
              <div className="checkmark">✓</div>
            </div>
          </div>
          <h1>Order Confirmed! 🎉</h1>
          <p className="success-message">
            Thank you for your purchase! Your order has been successfully placed and is being processed.
          </p>
          <div className="order-number">
            Order #{orderData.orderId}
          </div>
        </div>

        <div className="confirmation-content">
          <div className="order-details">
            <div className="details-section">
              <div className="section-header">
                <h2>📋 Order Information</h2>
              </div>
              <div className="order-info-grid">
                <div className="info-item">
                  <span className="info-label">Order ID:</span>
                  <span className="info-value">{orderData.orderId}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Order Date:</span>
                  <span className="info-value">
                    {new Date(orderData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment Status:</span>
                  <span className={`status-badge ${orderData.isPaid ? 'paid' : 'pending'}`}>
                    {orderData.isPaid ? '✓ Paid' : '⏳ Pending'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Total Amount:</span>
                  <span className="info-value total-amount">${orderData.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <div className="section-header">
                <h2>🚚 Shipping Address</h2>
              </div>
              <div className="shipping-card">
                <div className="address-info">
                  <div className="address-line">{orderData.shippingAddress.address}</div>
                  <div className="address-line">
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.postalCode}
                  </div>
                  <div className="address-line">{orderData.shippingAddress.country}</div>
                </div>
                <div className="delivery-estimate">
                  <div className="estimate-label">Estimated Delivery:</div>
                  <div className="estimate-date">
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <div className="section-header">
                <h2>🛍️ Order Items</h2>
                <span className="items-count">({orderData.orderItems.length} items)</span>
              </div>
              <div className="order-items">
                {orderData.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <div className="item-specs">
                        <span className="item-size">Size: {item.size}</span>
                        <span className="item-quantity">Qty: {item.qty}</span>
                      </div>
                    </div>
                    <div className="item-price">${(item.qty * item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-header">
              <h2>💰 Payment Summary</h2>
            </div>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>${(orderData.totalPrice - orderData.taxPrice - orderData.shippingPrice).toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Tax:</span>
                <span>${orderData.taxPrice.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Shipping:</span>
                <span>
                  {orderData.shippingPrice === 0 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    `$${orderData.shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="price-total">
                <span>Total Paid:</span>
                <span>${orderData.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="next-steps">
              <h3>What's Next?</h3>
              <div className="steps-list">
                <div className="step-item completed">
                  <span className="step-icon">✓</span>
                  <span>Order confirmed</span>
                </div>
                <div className="step-item">
                  <span className="step-icon">📦</span>
                  <span>Preparing your items</span>
                </div>
                <div className="step-item">
                  <span className="step-icon">🚚</span>
                  <span>Shipped & on the way</span>
                </div>
                <div className="step-item">
                  <span className="step-icon">📍</span>
                  <span>Delivered to your door</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <div className="action-buttons">
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
          
          <div className="help-section">
            <h3>Need Help?</h3>
            <p>
              Have questions about your order? Contact our customer support team.
            </p>
            <div className="contact-options">
              <span>📧 support@fashionstore.com</span>
              <span>📞 1-800-FASHION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
