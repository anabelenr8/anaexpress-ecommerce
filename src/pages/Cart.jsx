import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrashAlt, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { useAddress } from '../context/AddressContext';
import { useApp } from '../context/AppContext';


const Cart = () => {
  const navigate = useNavigate();
  const { shippingAddress: defaultShippingAddress } = useAddress();

  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const { refreshData } = useApp();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Set default shipping address
    setShippingAddress(defaultShippingAddress);

    // Fetch default payment method
    const fetchDefaultPayment = async () => {
      try {
        const res = await axios.get(
          "https://localhost:7234/api/PaymentMethod/default",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Format label if available
        if (res.data && res.data.cardType && res.data.last4Digits) {
          const label = `${res.data.cardType} ending in ${res.data.last4Digits}`;
          setPaymentMethod(label);
        } else {
          setPaymentMethod("Credit Card");
        }
      } catch (err) {
        console.warn("No default payment method, using fallback.");
        setPaymentMethod("Credit Card");
      }
    };

    fetchDefaultPayment();
  }, [defaultShippingAddress, navigate]);
  

  const groupedCart = cart.reduce((acc, item) => {
    const found = acc.find(p => p.id === item.id);
    if (found) {
      found.qty += 1;
    } else {
      acc.push({ ...item, qty: 1 });
    }
    return acc;
  }, []);

  const total = groupedCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleClearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

  const calculateTotal = (cart) => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    try {
      const finalBillingAddress = sameAsShipping
        ? shippingAddress
        : billingAddress;

      const orderPayload = {
        id: 0,
        orderDate: new Date().toISOString(),
        totalAmount: calculateTotal(groupedCart),
        status: "Pending",
        shippingAddress: shippingAddress,
        billingAddress: finalBillingAddress,
        paymentMethod: paymentMethod,
        items: groupedCart.map((item) => ({
          productId: item.id,
          quantity: item.qty,
          price: item.price,
        })),
      };

      const response = await axios.post(
        "https://localhost:7234/api/Order/place",
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await new Promise((resolve) => setTimeout(resolve, 300));

      const orderId = response.data.orderId; // depends on backend!

      // Create the Payment right after
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId =
        decodedToken["sub"] ||
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      const paymentPayload = {
        userId: userId,
        orderId: orderId,
        amount: calculateTotal(groupedCart),
        paymentMethod: paymentMethod,
        status: "Completed",
      };

      await axios.post("https://localhost:7234/api/Payment", paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      refreshData();

      navigate("/order-confirmation", {
        state: {
          orderId: orderId,
          amount: calculateTotal(groupedCart),
          paymentMethod: paymentMethod,
        },
      });

      handleClearCart();

      alert(`Order placed! Order ID: ${response.data.orderId || "N/A"}`);
      handleClearCart();
    } catch (err) {
      console.error("Order failed:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>
            <FaShoppingCart style={{ marginRight: "10px" }} />
            Your Cart
          </h2>

          {groupedCart.length === 0 ? (
            <p style={styles.emptyText}>Your cart is currently empty.</p>
          ) : (
            <>
              {/* SHIPPING FORM */}
              <div style={styles.form}>
                <input
                  type="text"
                  placeholder="Shipping Address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={styles.input}
                />

                <div style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                  />
                  <label style={{ marginLeft: "8px" }}>
                    Billing address same as shipping
                  </label>
                </div>

                {!sameAsShipping && (
                  <input
                    type="text"
                    placeholder="Billing Address"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    style={styles.input}
                  />
                )}

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={styles.input}
                >
                  {paymentMethod !== "Credit Card" &&
                    !["PayPal", "Bank Transfer"].includes(paymentMethod) && (
                      <option value={paymentMethod}>{paymentMethod}</option>
                    )}

                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {/* CART ITEMS */}
              <div style={styles.list}>
                {groupedCart.map((item) => (
                  <div key={item.id} style={styles.listItem}>
                    <div>
                      <strong>{item.name}</strong>{" "}
                      <span style={styles.qty}>x{item.qty}</span>
                    </div>
                    <span style={styles.price}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={styles.totalRow}>
                <span>Total:</span>
                <strong style={styles.total}>${total.toFixed(2)}</strong>
              </div>

              <div style={styles.actions}>
                <button style={styles.checkoutBtn} onClick={handleCheckout}>
                  <FaCheckCircle style={{ marginRight: "8px" }} />
                  Checkout
                </button>
                <button style={styles.clearBtn} onClick={handleClearCart}>
                  <FaTrashAlt style={{ marginRight: "8px" }} />
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ✨ ADD STYLES OBJECT ✨
const styles = {
  container: { padding: '20px', display: 'flex', justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' },
  heading: { marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center' },
  form: { marginBottom: '20px' },
  input: { width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' },
  checkboxRow: { display: 'flex', alignItems: 'center', marginBottom: '10px' },
  list: { marginBottom: '20px' },
  listItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  qty: { fontSize: '0.9rem', color: '#666' },
  price: { fontWeight: 'bold' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px' },
  total: { fontWeight: 'bold', color: '#28a745' },
  actions: { display: 'flex', flexDirection: 'column', gap: '10px' },
  checkoutBtn: { backgroundColor: '#28a745', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '16px' },
  clearBtn: { backgroundColor: '#dc3545', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '16px' },
};

export default Cart;
