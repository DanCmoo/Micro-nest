import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import './ProductList.css';

const ProductList = ({ onAddToCart, userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Error loading products: ' + err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await onAddToCart(product.id, 1);
      await loadProducts(); // Recargar productos para actualizar stock
    } catch (err) {
      // Extraer mensaje de error del backend
      const errorMessage = err.response?.data?.message || err.message || 'Error adding to cart';
      alert(errorMessage);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <span className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                  Stock: {product.stock}
                </span>
              </div>
            </div>
            <button
              className="btn-add-to-cart"
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
