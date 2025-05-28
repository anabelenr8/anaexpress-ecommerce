import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import { useApp } from '../context/AppContext';

const PRODUCTS_PER_PAGE = 6;

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { dataVersion } = useApp();

  useEffect(() => {
    getProducts()
      .then(res => {
        console.log('Products received:', res.data);
        setProducts(res.data);
      })
      .catch(err => console.error('❌ Failed to fetch products:', err));

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(existingCart);
  }, [dataVersion]);

  const handleAddToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="container py-5">
      {localStorage.getItem("role") === "Admin" && (
        <div className="d-flex justify-content-end align-items-center mb-3">
          <button
            className="btn btn-warning fw-semibold shadow-sm"
            style={{
              padding: "8px 20px",
              fontSize: "0.95rem",
              borderRadius: "8px",
            }}
            onClick={() => navigate("/admin")}
          >
            Go to Admin Panel
          </button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Dashboard / Products</h2>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset page on search
          }}
        />
      </div>

      <div className="row">
        {paginatedProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <img
                  src={
                    product.imageUrl
                      ? `https://localhost:7234${product.imageUrl}`
                      : 'https://via.placeholder.com/500x180?text=No+Image'
                  }
                  alt={product.name}
                  className="img-fluid mb-3"
                  style={{
                    maxHeight: "180px",
                    objectFit: "cover",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                />
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted mb-2">In Stock: {product.stock}</p>
                <p className="card-text fs-5 fw-bold mb-4 text-success">${product.price.toFixed(2)}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-12">
            <p className="text-muted text-center">No products match your search.</p>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-outline-secondary me-2" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
            ← Previous
          </button>
          <span className="align-self-center fw-bold mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button className="btn btn-outline-secondary ms-2" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
