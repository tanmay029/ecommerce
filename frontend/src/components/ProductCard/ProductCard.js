import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <div className="product-image">
          <img src={product.image} alt={product.name} loading="lazy" />
          {product.featured && <span className="featured-badge">Featured</span>}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-category">{product.subcategory}</p>
          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock})</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;