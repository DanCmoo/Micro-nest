import React, { useState } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { cartService } from './services/api';
import './App.css';

function App() {
  const [userId] = useState('user123'); // Usuario fijo para demo
  const [cartRefreshTrigger, setCartRefreshTrigger] = useState(0);

  const handleAddToCart = async (productId, quantity) => {
    try {
      await cartService.addToCart(userId, productId, quantity);
      setCartRefreshTrigger(prev => prev + 1); // Trigger cart refresh
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛒 Microservices Store</h1>
        <p className="user-info">User: {userId}</p>
      </header>

      <div className="app-container">
        <main className="main-content">
          <ProductList onAddToCart={handleAddToCart} userId={userId} />
        </main>

        <aside className="sidebar">
          <Cart userId={userId} refreshTrigger={cartRefreshTrigger} />
        </aside>
      </div>
    </div>
  );
}

export default App;
