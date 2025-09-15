import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { ordersAPI } from '../../api/api';
import { clearCartItems } from '../../store/slices/cartSlice';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  const [paymentMethod] = useState('Razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrderMutation = useMutation(ordersAPI.createOrder);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (orderData) => {
    try {
      setIsProcessing(true);
      
      // Simulate payment processing (Demo mode)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order with payment result
      const orderResponse = await createOrderMutation.mutateAsync({
        ...orderData,
        paymentResult: {
          id: `pay_demo_${Date.now()}`,
          status: 'completed',
          update_time: new Date().toISOString(),
        },
      });

      dispatch(clearCartItems());
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${orderResponse.data._id}`);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      toast.error('Please fill in all required shipping address fields');
      return;
    }

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        size: item.size,
        product: item.product,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shipping,
      totalPrice: total,
    };

    await handlePayment(orderData);
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className="step active">1. Shipping</div>
            <div className="step active">2. Payment</div>
            <div className="step">3. Review</div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={placeOrderHandler}>
              <div className="form-section">
                <div className="section-header">
                  <h2>🚚 Shipping Information</h2>
                  <p>Where should we deliver your order?</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <select
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <h2>💳 Payment Method</h2>
                  <p>Choose your payment option</p>
                </div>
                
                <div className="payment-methods">
                  <div className="payment-method selected">
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="razorpay"
                        name="paymentMethod"
                        value="Razorpay"
                        checked={paymentMethod === 'Razorpay'}
                        readOnly
                      />
                      <label htmlFor="razorpay">
                        <div className="payment-info">
                          <strong>💳 Razorpay</strong>
                          <span>Secure payment processing (Demo Mode)</span>
                        </div>
                      </label>
                    </div>
                    <div className="payment-note">
                      <p>🔒 Your payment information is secure and encrypted</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn place-order-btn"
                disabled={isProcessing || createOrderMutation.isLoading}
              >
                {isProcessing || createOrderMutation.isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Processing Payment...
                  </>
                ) : (
                  `🛒 Place Order - $${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
            </div>
            
            <div className="order-items">
              <h3>Items ({cartItems.length})</h3>
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}`} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-details">
                      Size: {item.size} × {item.qty}
                    </div>
                  </div>
                  <div className="item-price">${(item.qty * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {subtotal < 100 && (
                <div className="shipping-promo">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping! 🚚
                </div>
              )}
              <div className="summary-total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="security-badges">
              <div className="badge">🔒 SSL Secure</div>
              <div className="badge">💳 Safe Payment</div>
              <div className="badge">📱 Mobile Friendly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
