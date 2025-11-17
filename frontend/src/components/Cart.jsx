import React, { useState, useEffect } from 'react';
import { cartService } from '../services/api';
import './Cart.css';

const Cart = ({ userId, refreshTrigger }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCart();
  }, [userId, refreshTrigger]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart(userId);
      setCart(response.data);
      setError(null);
    } catch (err) {
      setError('Error loading cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.removeFromCart(userId, itemId);
      await loadCart();
    } catch (err) {
      alert('Error removing item: ' + err.message);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartService.clearCart(userId);
        await loadCart();
      } catch (err) {
        alert('Error clearing cart: ' + err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        {cart && cart.items.length > 0 && (
          <button className="btn-clear-cart" onClick={handleClearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.productName}</h4>
                  <div className="cart-item-details">
                    <span className="item-price">${item.price.toFixed(2)}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-total">${item.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="btn-remove"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{cart.totalItems}</span>
            </div>
            <div className="summary-row total">
              <span>Total Price:</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn-checkout">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
