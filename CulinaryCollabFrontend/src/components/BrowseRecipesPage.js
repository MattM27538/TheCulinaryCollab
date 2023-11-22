import React, { useState, useEffect } from 'react';
import './BrowseRecipesPage.css';
import { firestore, auth } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import RecipeSearchBarBrowse from './RecipeSearchBarBrowse';
import ViewRecipeModal from './ViewRecipeModal';

const BrowseRecipesPage = () => {
	const [recipes, setRecipes] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [currentUserEmail, setCurrentEmail] = useState(null);
	const recipesPerPage = 8;

	const fetchRecipes = async () => {
		const publicRecipesCollection = collection(firestore, 'public-recipes');
		const userRecipesCollection = collection(firestore, 'allUserRecipes');

		const [publicRecipesSnapshot, userRecipesSnapshot] = await Promise.all([
			getDocs(publicRecipesCollection),
			getDocs(userRecipesCollection)
		]);

		const publicRecipes = publicRecipesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
		const userRecipes = userRecipesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

		setRecipes([...publicRecipes, ...userRecipes]);
	};


	const canSaveRecipe = (recipe) => {
		return !recipe.createdBy || (recipe.createdBy.email !== currentUserEmail);
	};
	const displayedRecipes = recipes.slice(currentPage * recipesPerPage, (currentPage + 1) * recipesPerPage);

	const openViewModal = (recipe) => {
		setSelectedRecipe(recipe);
		setIsViewModalOpen(true);
	};

	const closeViewModal = () => {
		setIsViewModalOpen(false);
		setSelectedRecipe(null);
	};


	const saveRecipe = async (recipe) => {
		try {
			if (auth.currentUser) {
				const recipeToSave = {
					...recipe,
					originalCreator: recipe.createdBy ? (recipe.createdBy.username || recipe.createdBy.email) : 'Public',
				};
				const savedRecipesRef = collection(firestore, `users/${auth.currentUser.uid}/savedRecipes`);
				await addDoc(savedRecipesRef, recipeToSave);
				console.log('Recipe saved successfully');
				//fetchSavedRecipes();
			}
		} catch (error) {
			console.error('Error saving recipe: ', error);
		}
	};
	const goToNextPage = () => {
		setCurrentPage(currentPage + 1);
	};

	const goToPreviousPage = () => {
		setCurrentPage(currentPage - 1);
	};


	useEffect(() => {
		fetchRecipes();
		if (auth.currentUser) {
			console.log("auth.currentUser.email: ",auth.currentUser.email);
			setCurrentEmail(auth.currentUser.email);
		}
	}, []);
	return (
		<div className="browse-recipes-page">
		<h2>Browse Recipes</h2>
		<RecipeSearchBarBrowse recipes={recipes} onView={openViewModal} onSave={() => saveRecipe(selectedRecipe)}/>
		<div className="recipes-grid">
		{displayedRecipes.map(recipe => (
			<div key={recipe.id} className="recipe-item" onClick={() => openViewModal(recipe)}>
			<h3>{recipe.name}</h3>
			<p className="recipe-origin">
			{recipe.createdBy ? `From: ${recipe.createdBy.username || recipe.createdBy.email}` : 'Public Recipe'}
			</p>
			</div>
		))}
		</div>
		<div className="pagination-buttons">
		{currentPage > 0 && <button onClick={goToPreviousPage}>Previous</button>}
		{(currentPage + 1) * recipesPerPage < recipes.length && <button onClick={goToNextPage}>Next</button>}
		</div>
		<ViewRecipeModal isOpen={isViewModalOpen} onClose={closeViewModal} recipe={selectedRecipe} onSave={() => saveRecipe(selectedRecipe)} showSaveOption={selectedRecipe && canSaveRecipe(selectedRecipe)}/>
		</div>
	);
}

export default BrowseRecipesPage;

