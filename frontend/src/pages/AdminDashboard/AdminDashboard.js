import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { ordersAPI, productsAPI } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  // Fetch orders
  const {  orders, isLoading: ordersLoading } = useQuery('orders', ordersAPI.getAllOrders);

  // Fetch products
  const {  products, isLoading: productsLoading } = useQuery('adminProducts', () => 
    productsAPI.getProducts({ pageSize: 100 })
  );

  // Delete product mutation
  const deleteProductMutation = useMutation(productsAPI.deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminProducts');
      toast.success('Product deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete product');
    }
  });

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (ordersLoading || productsLoading) return <LoadingSpinner message="Loading dashboard..." />;

  const totalRevenue = orders?.data?.reduce((acc, order) => acc + order.totalPrice, 0) || 0;
  const totalCustomers = new Set(orders?.data?.map(order => order.user?._id)).size || 0;
  const paidOrders = orders?.data?.filter(order => order.isPaid).length || 0;
  const pendingOrders = orders?.data?.filter(order => !order.isPaid).length || 0;

  const OverviewTab = () => (
    <div className="overview-tab">
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <h3>${totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
            <span className="stat-trend positive">+12.5%</span>
          </div>
        </div>
        
        <div className="stat-card orders">
          <div className="stat-icon">
            <FiShoppingBag />
          </div>
          <div className="stat-content">
            <h3>{orders?.data?.length || 0}</h3>
            <p>Total Orders</p>
            <span className="stat-trend positive">+8.2%</span>
          </div>
        </div>
        
        <div className="stat-card products">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <h3>{products?.data?.products?.length || 0}</h3>
            <p>Products</p>
            <span className="stat-trend positive">+3.1%</span>
          </div>
        </div>
        
        <div className="stat-card customers">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{totalCustomers}</h3>
            <p>Customers</p>
            <span className="stat-trend positive">+15.7%</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <span className="order-status-summary">
              {paidOrders} paid • {pendingOrders} pending
            </span>
          </div>
          
          <div className="orders-list">
            {orders?.data?.slice(0, 5).map((order) => (
              <div key={order._id} className="order-item">
                <div className="order-info">
                  <div className="order-id">#{order.orderId}</div>
                  <div className="customer-name">{order.user?.name || 'Customer'}</div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="order-details">
                  <div className="order-amount">${order.totalPrice.toFixed(2)}</div>
                  <div className="order-status">
                    <span className={`status-badge ${order.isPaid ? 'paid' : 'pending'}`}>
                      {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                    </span>
                    <span className={`status-badge ${order.isDelivered ? 'delivered' : 'processing'}`}>
                      {order.isDelivered ? '📦 Delivered' : '🚚 Processing'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="top-products">
          <div className="section-header">
            <h2>Top Products</h2>
          </div>
          
          <div className="products-list">
            {products?.data?.products?.slice(0, 5).map((product) => (
              <div key={product._id} className="product-item">
                <img src={product.image} alt={product.name} className="product-thumb" />
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-meta">
                    <span className="product-price">${product.price}</span>
                    <span className="product-stock">Stock: {product.stock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const OrdersTab = () => (
    <div className="orders-tab">
      <div className="section-header">
        <h2>Orders Management</h2>
        <div className="orders-summary">
          <span className="summary-item">Total: {orders?.data?.length || 0}</span>
          <span className="summary-item">Paid: {paidOrders}</span>
          <span className="summary-item">Pending: {pendingOrders}</span>
        </div>
      </div>
      
      <div className="orders-table-container">
        <div className="orders-table">
          <div className="table-header">
            <div>Order ID</div>
            <div>Customer</div>
            <div>Date</div>
            <div>Items</div>
            <div>Total</div>
            <div>Payment</div>
            <div>Status</div>
          </div>
          {orders?.data?.map((order) => (
            <div key={order._id} className="table-row">
              <div className="order-id-cell">#{order.orderId}</div>
              <div>{order.user?.name || 'N/A'}</div>
              <div>{new Date(order.createdAt).toLocaleDateString()}</div>
              <div>{order.orderItems.length} items</div>
              <div className="amount-cell">${order.totalPrice.toFixed(2)}</div>
              <div>
                <span className={`status-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                  {order.isPaid ? '✓ Paid' : '⏳ Unpaid'}
                </span>
              </div>
              <div>
                <span className={`status-badge ${order.isDelivered ? 'delivered' : 'pending'}`}>
                  {order.isDelivered ? '📦 Delivered' : '🚚 Pending'}
                </span>
              </div>
            </div>
          ))}
          {orders?.data?.length === 0 && (
            <div className="no-data">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );

  const ProductsTab = () => (
    <div className="products-tab">
      <div className="section-header">
        <h2>Products Management</h2>
        <button 
          className="btn btn-primary add-product-btn"
          onClick={() => toast.info('Add product feature coming soon!')}
        >
          <FiPlus /> Add Product
        </button>
      </div>
      
      <div className="products-grid">
        {products?.data?.products?.map((product) => (
          <div key={product._id} className="product-admin-card">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} />
              {product.featured && <span className="featured-badge">Featured</span>}
            </div>
            
            <div className="product-admin-info">
              <h3 className="product-title">{product.name}</h3>
              <div className="product-details">
                <div className="product-price">${product.price.toFixed(2)}</div>
                <div className="product-category">{product.category}</div>
              </div>
              
              <div className="product-stats">
                <div className="stat-item">
                  <span className="stat-label">Stock:</span>
                  <span className={`stat-value ${product.stock < 10 ? 'low-stock' : ''}`}>
                    {product.stock}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Sizes:</span>
                  <span className="stat-value">{product.sizes?.length || 0}</span>
                </div>
              </div>
              
              <div className="product-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => toast.info('Edit feature coming soon!')}
                  title="Edit Product"
                >
                  <FiEdit />
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteProduct(product._id)}
                  disabled={deleteProductMutation.isLoading}
                  title="Delete Product"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products?.data?.products?.length === 0 && (
        <div className="no-data">No products found</div>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Manage your store efficiently</p>
          </div>
          <div className="header-actions">
            <div className="current-time">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiTrendingUp />
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingBag />
            Orders ({orders?.data?.length || 0})
          </button>
          <button 
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FiTrendingUp />
            Products ({products?.data?.products?.length || 0})
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'products' && <ProductsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
