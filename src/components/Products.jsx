import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import { addDoc, collection, db } from '../firebase'; // Import Firebase methods
import '../styles/Products.css'; // Import the CSS file

const Products = () => {
  const [products, setProducts] = useState([]); // Products fetched from API
  const [loading, setLoading] = useState(true); // Loading state
  const [cart, setCart] = useState([]); // Cart state
  const [isCartVisible, setIsCartVisible] = useState(false); // Toggle cart visibility

  // Fetch products from Fake Store API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      // If the product already exists in the cart, update the quantity
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
      toast.info(`${product.title} quantity updated in cart!`, {
        position: 'top-right',
        autoClose: 2000,
      });
    } else {
      // If the product doesn't exist, add it to the cart
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success(`${product.title} added to cart!`, {
        position: 'top-right',
        autoClose: 2000,
      });
    }

    setIsCartVisible(true); // Show the cart after adding a product
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    const product = cart.find((item) => item.id === productId);
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    toast.error(`${product.title} removed from cart!`, {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  // Update product quantity in the cart
  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId); // If quantity is 0, remove the product
    } else {
      const updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      setCart(updatedCart);
    }
  };

  // Calculate the total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Handle checkout
  const handleCheckout = async () => {
    try {
      // Save the cart data to Firebase Firestore
      const orderRef = collection(db, 'orders'); // Create a collection for orders
      const orderData = {
        items: cart,
        total: calculateTotal(),
        date: new Date(),
      };
      await addDoc(orderRef, orderData);
      toast.success('Order placed successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
      setCart([]); // Clear the cart after checkout
      setIsCartVisible(false); // Hide the cart
    } catch (error) {
      console.error('Error saving order to Firestore:', error);
      toast.error('Error placing order', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="products-container">
      <h1 className="products-title">Featured Products</h1>

      {/* Product List */}
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-info">
              <h2 className="product-title">{product.title}</h2>
              <p className="product-price">${product.price}</p>
              <p className="product-description">{product.description.substring(0, 100)}...</p>
              <p className="product-category">{product.category}</p>
              <button onClick={() => addToCart(product)} className="add-to-cart-btn">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shopping Cart */}
      {isCartVisible && (
        <div className="cart-container">
          <h2>Shopping Cart</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <div>
                  <span>{item.title.substring(0, 20)}...</span>
                  <span> - ${item.price}</span>
                  <span> x </span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                    className="cart-quantity"
                  />
                  <span> = ${item.price * item.quantity}</span>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p>Total: ${calculateTotal()}</p>
          <button onClick={handleCheckout} className="checkout-btn">
            Checkout
          </button>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Products;