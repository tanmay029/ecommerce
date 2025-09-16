import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ordersAPI } from '../../api/api';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock orders data
  const mockOrders = [
    {
      _id: 'order_001',
      orderId: 'ORD-2024-001',
      orderDate: '2024-12-15',
      status: 'Delivered',
      totalAmount: 89.99,
      items: [
        {
          name: 'Classic White T-Shirt',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
          quantity: 2,
          price: 29.99,
          size: 'M'
        },
        {
          name: 'Premium Denim Jeans',
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
          quantity: 1,
          price: 89.99,
          size: '32'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'New York',
        postalCode: '10001',
        country: 'United States'
      },
      trackingNumber: 'TRK123456789'
    },
    {
      _id: 'order_002',
      orderId: 'ORD-2024-002',
      orderDate: '2024-12-10',
      status: 'Shipped',
      totalAmount: 159.99,
      items: [
        {
          name: 'Professional Business Blazer',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          quantity: 1,
          price: 159.99,
          size: 'L'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'New York',
        postalCode: '10001',
        country: 'United States'
      },
      trackingNumber: 'TRK987654321'
    },
    {
      _id: 'order_003',
      orderId: 'ORD-2024-003',
      orderDate: '2024-12-08',
      status: 'Processing',
      totalAmount: 45.99,
      items: [
        {
          name: 'Athletic Performance Polo',
          image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=200&h=200&fit=crop',
          quantity: 1,
          price: 45.99,
          size: 'M'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'New York',
        postalCode: '10001',
        country: 'United States'
      }
    }
  ];

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    // In a real app, fetch from API
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#28a745';
      case 'shipped': return '#007bff';
      case 'processing': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'processing': return '⏳';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h2>Loading your orders...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            ← Back to Profile
          </button>
          <h1>Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your order history here!</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-content">
            <div className="orders-summary">
              <div className="summary-item">
                <span className="summary-number">{orders.length}</span>
                <span className="summary-label">Total Orders</span>
              </div>
              <div className="summary-item">
                <span className="summary-number">
                  ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </span>
                <span className="summary-label">Total Spent</span>
              </div>
              <div className="summary-item">
                <span className="summary-number">
                  {orders.filter(order => order.status === 'Delivered').length}
                </span>
                <span className="summary-label">Delivered</span>
              </div>
            </div>

            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order {order.orderId}</h3>
                      <p className="order-date">
                        Placed on {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                      <div className="order-total">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>Size: {item.size} | Qty: {item.quantity}</p>
                          <p className="item-price">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-actions">
                    {order.trackingNumber && (
                      <button className="btn btn-outline">
                        📍 Track Package: {order.trackingNumber}
                      </button>
                    )}
                    <button 
                      className="btn btn-outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      📄 View Details
                    </button>
                    {order.status === 'Delivered' && (
                      <button className="btn btn-outline">
                        ⭐ Leave Review
                      </button>
                    )}
                    <button className="btn btn-primary">
                      🔄 Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details - {selectedOrder.orderId}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="order-detail-section">
                  <h3>Shipping Address</h3>
                  <div className="address-info">
                    <p>{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                <div className="order-detail-section">
                  <h3>Order Items</h3>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="detail-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Size: {item.size}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Total Amount:</span>
                    <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
