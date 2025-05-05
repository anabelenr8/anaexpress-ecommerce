import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res.slice(0, 6)); // take first 6
    });
  }, []);

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>Featured Deals</h2>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem' }}>
        {products.map((p) => (
          <div key={p.id} style={{ flex: '0 0 auto', width: '250px', border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
            <img src={`https://localhost:7342${p.imageUrl}`} alt={p.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <h4>{p.name}</h4>
            <p style={{ fontWeight: 'bold', color: '#27ae60' }}>${p.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
