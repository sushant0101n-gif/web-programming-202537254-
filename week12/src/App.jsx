
import { useState } from 'react';
import './App.css';

function App() {
  const products = [
    { id: 1, name: 'Wireless Headphones', price: 45000, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { id: 2, name: 'Smart Watch', price: 65000, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    { id: 3, name: 'Sneakers', price: 55000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { id: 4, name: 'Backpack', price: 35000, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
    { id: 5, name: 'Camera', price: 120000, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' }
  ];

  const [cart, setCart] = useState([]);

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function updateQuantity(id, amount) {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + amount }
        : item
    ).filter(item => item.quantity > 0));
  }

  function removeItem(id) {
    setCart(cart.filter(item => item.id !== id));
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  return (
    <div className="app">
      <h1>Interactive Shopping Cart</h1>

      <div className="shopping-container">
        <div className="product-list">
          {products.map(product => (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₩{product.price.toLocaleString()}</p>
              <button onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="cart-panel">
          <h2>Shopping Cart 🛒</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <h4>{item.name}</h4>
                <p>₩{item.price.toLocaleString()}</p>

                <div className="quantity">
                  <button onClick={() => updateQuantity(item.id, -1)}>
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => updateQuantity(item.id, 1)}>
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}

          <div className="total">
            <h3>Total: ₩{total.toLocaleString()}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
