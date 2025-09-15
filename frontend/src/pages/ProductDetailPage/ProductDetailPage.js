import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { productsAPI } from '../../api/api';
import { addToCart } from '../../store/slices/cartSlice';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const {  product, isLoading, error } = useQuery(
    ['product', id],
    () => productsAPI.getProduct(id)
  );

  const addToCartHandler = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    dispatch(
      addToCart({
        product: product.data._id,
        name: product.data.name,
        image: product.data.image,
        price: product.data.price,
        size: selectedSize,
        qty: quantity,
        stock: product.data.stock,
      })
    );
    
    toast.success('Added to cart!');
  };

  const buyNowHandler = () => {
    addToCartHandler();
    navigate('/cart');
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="error">Product not found</div>;

  const productData = product.data;

  return (
    <div className="product-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="product-detail">
          <div className="product-image-section">
            <img src={productData.image} alt={productData.name} />
            {productData.featured && <span className="featured-badge">Featured</span>}
          </div>

          <div className="product-info-section">
            <h1>{productData.name}</h1>
            <div className="product-price">${productData.price.toFixed(2)}</div>
            <div className="product-category">{productData.subcategory}</div>
            
            <div className="product-description">
              <p>{productData.description}</p>
            </div>

            <div className="product-options">
              <div className="size-selector">
                <h4>Size:</h4>
                <div className="size-options">
                  {productData.sizes?.map((size) => (
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

              <div className="quantity-selector">
                <h4>Quantity:</h4>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                    disabled={quantity >= productData.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="product-actions">
              <button
                className="btn add-to-cart-btn"
                onClick={addToCartHandler}
                disabled={productData.stock === 0}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-success buy-now-btn"
                onClick={buyNowHandler}
                disabled={productData.stock === 0}
              >
                Buy Now
              </button>
            </div>

            <div className="product-stock">
              {productData.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({productData.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            {productData.colors && productData.colors.length > 0 && (
              <div className="product-colors">
                <h4>Available Colors:</h4>
                <div className="color-list">
                  {productData.colors.map((color) => (
                    <span key={color} className="color-tag">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
