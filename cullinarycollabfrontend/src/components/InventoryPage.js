import React, { useState } from 'react';
import './InventoryPage.css';

const InventoryPage = () => {
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemCategory, setItemCategory] = useState('');

    const handleItemNameChange = (e) => {
        setItemName(e.target.value);
    };

    const handleItemQuantityChange = (e) => {
        setItemQuantity(e.target.value);
    };

    const handleItemCategoryChange = (e) => {
        setItemCategory(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Here you can send the form data to your backend API or perform any other necessary action.
        // For now, let's just log the form data.
        console.log('Item Name:', itemName);
        console.log('Item Quantity:', itemQuantity);
        console.log('Item Category:', itemCategory);

        // You can also clear the form fields after submission if needed.
        setItemName('');
        setItemQuantity('');
        setItemCategory('');
    };

    return (
        <div className="inventory-page">
            <h2>Add Inventory Item</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Item Name:</label>
                    <input type="text" value={itemName} onChange={handleItemNameChange} required />
                </div>
                <div className="form-group">
                    <label>Item Quantity:</label>
                    <input type="number" value={itemQuantity} onChange={handleItemQuantityChange} required />
                </div>
                <div className="form-group">
                    <label>Item Category:</label>
                    <input type="text" value={itemCategory} onChange={handleItemCategoryChange} required />
                </div>
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
}

export default InventoryPage;

