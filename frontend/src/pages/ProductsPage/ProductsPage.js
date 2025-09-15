import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../../api/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './ProductsPage.css';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const { data, isLoading, error } = useQuery(
    ['products', filters],
    () => productsAPI.getProducts(filters),
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      maxPrice: '',
    });
  };

  if (isLoading) return <LoadingSpinner message="Loading products..." />;
  if (error) return <div className="error">Error loading products</div>;

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>Products</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
          </div>
        </div>

        <div className="products-content">
          <aside className="filters-sidebar">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <h4>Category</h4>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            <div className="filter-group">
              <h4>Max Price</h4>
              <input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </aside>

          <main className="products-main">
            <div className="products-info">
              <p>{data?.data?.products?.length || 0} products found</p>
            </div>

            <div className="products-grid">
              {data?.data?.products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {data?.data?.products?.length === 0 && (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
