import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { removeFromCart, updateCartQuantity } from '../../store/slices/cartSlice';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const removeFromCartHandler = (productId, size) => {
    dispatch(removeFromCart({ productId, size }));
  };

  const updateQuantityHandler = (productId, size, qty) => {
    dispatch(updateCartQuantity({ productId, size, qty }));
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/products" className="btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-header">
                <h2>Items in your cart</h2>
                <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
              </div>
              
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}`} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <Link to={`/product/${item.product}`} className="item-name">
                      {item.name}
                    </Link>
                    <div className="item-meta">
                      <span className="item-size">Size: {item.size}</span>
                      <span className="item-price">${item.price.toFixed(2)} each</span>
                    </div>
                  </div>

                  <div className="item-actions">
                    <div className="item-quantity">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantityHandler(item.product, item.size, Math.max(1, item.qty - 1))
                        }
                        disabled={item.qty <= 1}
                      >
                        <FiMinus />
                      </button>
                      <span className="qty-display">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantityHandler(item.product, item.size, Math.min(item.stock, item.qty + 1))
                        }
                        disabled={item.qty >= item.stock}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <div className="item-total">
                      ${(item.qty * item.price).toFixed(2)}
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCartHandler(item.product, item.size)}
                      title="Remove from cart"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
              </div>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items):</span>
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
                  <div className="shipping-note">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
              </div>
              
              <div className="summary-total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                className="btn checkout-btn"
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>

              <Link to="/products" className="continue-shopping">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
