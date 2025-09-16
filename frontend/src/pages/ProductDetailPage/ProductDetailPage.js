import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../../store/slices/cartSlice';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('🔍 Fetching product ID:', id);
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 Full API response:', data);
        
        // ✅ FIXED: Handle both "data" and "product" formats
        let productData = null;
        if (data.success) {
          if (data.data) {
            productData = data.data;           // New format: { success: true,  {...} }
          } else if (data.product) {
            productData = data.product;        // Current format: { success: true, product: {...} }
          }
        }
        
        if (productData) {
          setProduct(productData);
          console.log('✅ Product set successfully:', productData.name);
        } else {
          throw new Error('No product data found in API response');
        }
        
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
  }, [id]);

  const addToCartHandler = () => {
    if (!product) {
      toast.error('Product data not available');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        size: selectedSize || 'One Size',
        qty: quantity,
        stock: product.stock,
      })
    );
    
    toast.success('Added to cart!');
  };

  const buyNowHandler = () => {
    addToCartHandler();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="loading-spinner">Loading...</div>
            <h2>Loading Product Details</h2>
            <p>Product ID: {id}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Unable to Load Product</h2>
            <p>{error}</p>
            <p><strong>Product ID:</strong> {id}</p>
            <div style={{ marginTop: '2rem' }}>
              <button className="btn" onClick={() => navigate(-1)}>
                ← Go Back
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/products')} style={{ marginLeft: '1rem' }}>
                Browse All Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Product Not Found</h2>
            <p>The requested product could not be found.</p>
            <button className="btn" onClick={() => navigate(-1)}>
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Products
        </button>

        <div className="product-detail">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} />
            {product.featured && <span className="featured-badge">✨ Featured</span>}
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            <div className="product-price">${product.price?.toFixed(2) || '0.00'}</div>
            <div className="product-category">{product.subcategory || product.category}</div>
            
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="product-options">
                <div className="size-selector">
                  <h4>Select Size:</h4>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="quantity-selector">
              <h4>Quantity:</h4>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                  disabled={quantity >= (product.stock || 999)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-actions">
              <button
                className="btn add-to-cart-btn"
                onClick={addToCartHandler}
                disabled={(product.stock || 0) === 0}
              >
                🛒 Add to Cart
              </button>
              <button
                className="btn btn-success buy-now-btn"
                onClick={buyNowHandler}
                disabled={(product.stock || 0) === 0}
              >
                ⚡ Buy Now
              </button>
            </div>

            <div className="product-stock">
              {(product.stock || 0) > 0 ? (
                <span className="in-stock">
                  ✅ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="out-of-stock">❌ Out of Stock</span>
              )}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="product-colors">
                <h4>Available Colors:</h4>
                <div className="color-list">
                  {product.colors.map((color) => (
                    <span key={color} className="color-tag">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="product-details">
              {product.brand && (
                <div className="detail-item">
                  <strong>Brand:</strong> {product.brand}
                </div>
              )}
              
              {product.rating && (
                <div className="detail-item">
                  <strong>Rating:</strong> 
                  <span className="rating">
                    {'⭐'.repeat(Math.floor(product.rating))} 
                    {product.rating}/5 ({product.numReviews || 0} reviews)
                  </span>
                </div>
              )}
              
              <div className="detail-item">
                <strong>Category:</strong> {product.category} → {product.subcategory}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
