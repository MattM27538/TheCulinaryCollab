import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import './WorkshopPage.css';
import { firestore } from '../firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import AddRecipeModal from './AddRecipeModal';
import ViewRecipeModal from './ViewRecipeModal';
import RecipeSearchBar from './RecipeSearchBar';
const WorkshopPage = () => {
        const [isAddModalOpen, setIsAddModalOpen] = useState(false);

        const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [filteredPublicRecipes, setFilteredPublicRecipes] = useState([]);
        const [recipes, setRecipes] = useState([]);
	const [publicRecipes, setPublicRecipes] = useState([]);
        const [selectedRecipe, setSelectedRecipe] = useState(null);

        const openAddModal = () => {
                setIsAddModalOpen(true);
        };

        const closeAddModal = () => {
                setIsAddModalOpen(false);
        };

        const openViewModal = (recipe) => {
                setSelectedRecipe(recipe);
                setIsViewModalOpen(true);
        };

        const closeViewModal = () => {
                setIsViewModalOpen(false);
                setSelectedRecipe(null);
        };

        const addRecipe = async (recipeData) => {
                try {
                        const recipesRef = collection(firestore, 'recipes');
                        await addDoc(recipesRef, recipeData);
                        console.log('Recipe saved successfully');
                        fetchRecipes();
                } catch (error) {
                        console.error('Error saving recipe: ', error);
                }
        };

        const fetchRecipes = async () => {
                const recipesCollection = collection(firestore, 'recipes');
                const querySnapshot = await getDocs(recipesCollection);
                const recipesData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setRecipes(recipesData);
        };
	    const fetchPublicRecipes = async () => {
        const publicRecipesCollection = collection(firestore, 'public-recipes');
        const querySnapshot = await getDocs(publicRecipesCollection);
        const publicRecipesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPublicRecipes(publicRecipesData);
    };
    const handleSearchResults = (filtered, filteredPublic) => {
	            setFilteredRecipes(filtered || []);
        setFilteredPublicRecipes(filteredPublic || []);
    };

        useEffect(() => {
                fetchRecipes();
		fetchPublicRecipes();
        }, []);

return (
    <div className="landing-page">
        {/* Include the search bar component */}
        <RecipeSearchBar
            recipes={recipes}
            publicRecipes={publicRecipes}
            onSearch={handleSearchResults}
            onView={openViewModal}
        />

        <button onClick={openAddModal}>Add Recipe</button>
        {/* Modal for adding new recipes */}
        <AddRecipeModal isOpen={isAddModalOpen} onClose={closeAddModal} addRecipe={addRecipe} />

        {/* Modal for viewing recipes */}
        <ViewRecipeModal isOpen={isViewModalOpen} onClose={closeViewModal} recipe={selectedRecipe} />

        {/* Render filtered or all recipes */}
        <h2>All Recipes</h2>
        <div className="recipe-list">
            <div className="recipe-scroll">
                {(filteredRecipes.length > 0 ? filteredRecipes : recipes).map((recipe) => (
                    <div key={recipe.id} className="recipe-item" onClick={() => openViewModal(recipe)}>
                        <h3>{recipe.name}</h3>
                        <p><strong>Timing:</strong> {recipe.timing}</p>
                        <p><strong>Taste:</strong> {recipe.taste}</p>
                        <p><strong>Ingredients:</strong> {recipe.ingredients.map(ingredient => `${ingredient.ingredient} (${ingredient.amount} ${ingredient.unit})`).join(', ')}</p>
                        <p><strong>Preparation:</strong> {recipe.preparation}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Render filtered or public recipes */}
        <h2>Public Recipes</h2>
        <div className="recipe-list">
            <div className="recipe-scroll">
                {(filteredPublicRecipes.length > 0 ? filteredPublicRecipes : publicRecipes).map((recipe) => (
                    <div key={recipe.id} className="recipe-item" onClick={() => openViewModal(recipe)}>
                        <h3>{recipe.name}</h3>
                        <p><strong>Timing:</strong> {recipe.timing}</p>
                        <p><strong>Taste:</strong> {recipe.taste}</p>
                        <p><strong>Ingredients:</strong> {recipe.ingredients.map(ingredient => `${ingredient.ingredient} (${ingredient.amount} ${ingredient.unit})`).join(', ')}</p>
                        <p><strong>Preparation:</strong> {recipe.preparation}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

};

export default WorkshopPage;
