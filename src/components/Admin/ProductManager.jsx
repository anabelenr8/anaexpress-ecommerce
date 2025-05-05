import React, { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/api';
import { useApp } from '../../context/AppContext'; 

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    image: ''
  });
  const [editId, setEditId] = useState(null);
  const { refreshData, dataVersion } = useApp(); 

  useEffect(() => {
    fetchProducts();
  }, [dataVersion]);

  const fetchProducts = () => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    const action = editId
      ? updateProduct(editId, data)
      : createProduct(data);

    action
      .then(() => {
        setFormData({ name: '', price: '', stock: '', image: '' });
        setEditId(null);
        refreshData();
      })
      .catch(err => console.error('Error submitting product:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
        .then(() => refreshData()) 
        .catch(err => console.error('Failed to delete product:', err));
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image || ''
    });
    setEditId(product.id);
  };

  return (
    <div className="card shadow p-4">
      <h4 className="mb-4">Manage Products</h4>
  
      <form onSubmit={handleSubmit} className="row g-3 mb-4 align-items-end">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-success">
            {editId ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
  
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Preview</th>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Stock</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={{ width: '100px' }}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="img-thumbnail"
                    style={{ maxHeight: '50px' }}
                  />
                ) : (
                  <span className="text-muted">No Image</span>
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td className="text-end">
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );  
};

export default ProductManager;
