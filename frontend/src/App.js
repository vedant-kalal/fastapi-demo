import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        price: '',
        quantity: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Fetch all products on load
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!formData.id || !formData.name || !formData.price || !formData.quantity) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            if (isEditing) {
                await axios.put(`http://127.0.0.1:8000/product/${formData.id}`, formData);
                alert('Product updated successfully');
                setIsEditing(false);
            } else {
                await axios.post('http://127.0.0.1:8000/product', formData);
                alert('Product added successfully');
            }
            setFormData({ id: '', name: '', description: '', price: '', quantity: '' });
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product. Check console for details.');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/product/${id}`);
                alert('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product');
            }
        }
    };

    const handleEditClick = (product) => {
        setFormData(product);
        setIsEditing(true);
    };

    const handleFetchById = async () => {
        const id = prompt("Enter Product ID to fetch:");
        if (id) {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/products/${id}`);
                if (response.data && response.data !== "product not found") {
                    alert(`Product Found:\nName: ${response.data.name}\nPrice: ${response.data.price}`);
                } else {
                    alert("Product not found");
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                alert('Error fetching product');
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(product.id).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Hospital Management System</h1>
                <button className="fetch-btn" onClick={handleFetchById}>🔍 Fetch by ID</button>
            </header>

            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <p>{products.length}</p>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="panel add-product-panel">
                    <h2>{isEditing ? 'Update Product' : 'Add Product'}</h2>
                    <form onSubmit={handleAddProduct}>
                        <div className="form-group">
                            <label>ID</label>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleInputChange}
                                placeholder="Enter Product ID"
                                disabled={isEditing} // ID usually shouldn't change during update
                            />
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter Product Name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter Description"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <button type="submit" className={`add-btn ${isEditing ? 'update-btn' : ''}`}>
                            {isEditing ? 'Update Product' : 'Add Product'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ id: '', name: '', description: '', price: '', quantity: '' });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                <div className="panel product-list-panel">
                    <div className="panel-header">
                        <h2>Product List</h2>
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="product-list-scroll">
                        {filteredProducts.length === 0 ? (
                            <p className="no-products">No products found.</p>
                        ) : (
                            filteredProducts.map((product, index) => (
                                <div key={index} className="product-card">
                                    <div className="product-header">
                                        <span className="product-id">#{product.id}</span>
                                        <span className="product-price">${product.price}</span>
                                    </div>
                                    <h3>{product.name}</h3>
                                    <p className="product-desc">{product.description}</p>
                                    <div className="product-footer">
                                        <span className="product-qty">Qty: {product.quantity}</span>
                                        <div className="card-actions">
                                            <button className="edit-btn" onClick={() => handleEditClick(product)}>✏️</button>
                                            <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
