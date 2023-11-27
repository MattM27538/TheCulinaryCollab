import React, { useState, useEffect } from 'react';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../firebase'; 
import './InventoryPage.css';

const RecipeFinder = ({ inventory }) => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const recipesCollection = collection(firestore, 'public-recipes');
                const snapshot = await getDocs(recipesCollection);
                const recipesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRecipes(recipesData);
                setFilteredRecipes(recipesData);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    const handleIngredientsChange = (e) => {
        setIngredients(e.target.value);
    };

    const findRecipes = () => {
        const matchingRecipes = recipes.filter(recipe =>
            recipe.ingredients.some(ingredient => ingredients.includes(ingredient.ingredient))
        );

        setFilteredRecipes(matchingRecipes);
    };

    const searchRecipes = () => {
        const matchingRecipes = recipes.filter(recipe =>
            recipe.ingredients.some(ingredient => ingredients.includes(ingredient.ingredient))
        );

        setFilteredRecipes(matchingRecipes);
    };

    return (
        <div className="recipe-finder">
            <h2>Find Recipes</h2>
            <div className="form-group">
                <label>Enter Ingredients (comma-separated):</label>
                <input type="text" value={ingredients} onChange={handleIngredientsChange} />
            </div>
            <button type="button" onClick={findRecipes}>Find Recipes</button>
            <button type="button" onClick={searchRecipes}>Search Recipes</button>

            <h3>Matching Recipes:</h3>
            <ul>
                {filteredRecipes.map((recipe, index) => (
                    <li key={index}>{recipe.name}</li>
                ))}
            </ul>
        </div>
    );
};

const AddItemModal = ({ addItem, closeModal }) => {
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
        addItem({
            name: itemName,
            quantity: itemQuantity,
            category: itemCategory,
        });
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="add-item-modal">
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
                <button className="close-modal-button" onClick={closeModal}>
                    Close
                </button>
            </div>
        </div>
    );
};

const SampleInventory = [
    { name: 'Vodka', quantity: '1 bottle', category: 'Spirits' },
    { name: 'Gin', quantity: '1 bottle', category: 'Spirits' },
    { name: 'Lime Juice', quantity: '1 bottle', category: 'Juices' },
];

const InventoryPage = ({ location }) => {
    const [inventory, setInventory] = useState(SampleInventory);
    const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);

    const userId = location.state?.userId || 'default-user-id';
    		
    const addItem = async (item) => {
        try {
            const inventoryRef = collection(firestore, `users/${userId}/inventory`);

            // Add the item to the "inventory" collection
            await setDoc(doc(inventoryRef, item.name), item);

            // Update the local state with the new item
            setInventory([...inventory, item]);
        } catch (error) {
            console.error('Error adding item to inventory:', error);
        }
    };

    const openAddItemModal = () => {
        setAddItemModalOpen(true);
    };

    const closeAddItemModal = () => {
        setAddItemModalOpen(false);
    };

    return (
        <div className="inventory-page">
            <h2>Inventory</h2>
            <button onClick={openAddItemModal}>Add Item</button>
            <ul>
                {inventory.map((item, index) => (
                    <li key={index}>{item.name} - {item.quantity} - {item.category}</li>
                ))}
            </ul>
            <RecipeFinder inventory={inventory} />
            {isAddItemModalOpen && (
                <AddItemModal addItem={addItem} closeModal={closeAddItemModal} />
            )}
        </div>
    );
};

export default InventoryPage;
