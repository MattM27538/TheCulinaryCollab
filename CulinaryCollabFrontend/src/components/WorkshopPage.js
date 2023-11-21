import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import './WorkshopPage.css';
import { firestore, auth } from '../firebase';
import { addDoc, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import AddRecipeModal from './AddRecipeModal';
import ViewRecipeModal from './ViewRecipeModal';
import RecipeSearchBar from './RecipeSearchBar';
import EditRecipeModal from './EditRecipeModal';
import ViewPersonalRecipeModal from './ViewPersonalRecipeModal';
const WorkshopPage = () => {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [filteredRecipes, setFilteredRecipes] = useState([]);
	const [filteredPublicRecipes, setFilteredPublicRecipes] = useState([]);
	const [recipes, setRecipes] = useState([]);
	const [publicRecipes, setPublicRecipes] = useState([]);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [personalRecipes, setPersonalRecipes] = useState([]);
	const [savedRecipes, setSavedRecipes] = useState([]);
	const [originalUsername, setOriginalUsername] = useState('');
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isPersonalViewModalOpen, setIsPersonalViewModalOpen] = useState(false);
	const [selectedRecipeForEdit, setSelectedRecipeForEdit] = useState(null);
	const openAddModal = () => setIsAddModalOpen(true);
	const closeAddModal = () => setIsAddModalOpen(false);
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
			if (auth.currentUser) {
				const personalRecipesRef = collection(firestore, `users/${auth.currentUser.uid}/personalRecipes`);
				await addDoc(personalRecipesRef, recipeData);
				console.log('Personal recipe saved successfully');
				fetchPersonalRecipes();
			}
		} catch (error) {
			console.error('Error saving personal recipe: ', error);
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
	const fetchPersonalRecipes = async () => {
		const personalRecipesCol = collection(firestore, `users/${auth.currentUser.uid}/personalRecipes`);
		const personalRecipesSnap = await getDocs(personalRecipesCol);
		setPersonalRecipes(personalRecipesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
	};

	const openEditModal = (recipe) => {
		console.log("Opening edit modal for recipe: ", recipe);
		setSelectedRecipeForEdit(recipe);
		setIsEditModalOpen(true);
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
		setSelectedRecipeForEdit(null);
	};
	const openPersonalViewModal = (recipe) => {
		setSelectedRecipe(recipe);
		setIsPersonalViewModalOpen(true);
	};

	const closePersonalViewModal = () => {
		setIsPersonalViewModalOpen(false);
		setSelectedRecipe(null);
	};
	const updateRecipe = async (updatedRecipeData) => {
		try {

			const recipeRef = doc(firestore, `users/${auth.currentUser.uid}/personalRecipes`, selectedRecipeForEdit.id);
			await setDoc(recipeRef, updatedRecipeData);
			console.log('Recipe updated successfully');

			fetchPersonalRecipes();
		} catch (error) {
			console.error('Error updating recipe: ', error);
		}
	};
	const handleSearchResults = (filtered, filteredPublic) => {
		setFilteredRecipes(filtered || []);
		setFilteredPublicRecipes(filteredPublic || []);
	};

	useEffect(() => {
		fetchRecipes();
		fetchPublicRecipes();
	}, []);

	useEffect(() => {
		const fetchUserData = async () => {
			if (auth.currentUser) {
				const userRef = doc(firestore, 'users', auth.currentUser.uid);
				const userSnap = await getDoc(userRef);

				if (userSnap.exists()) {

					setOriginalUsername(userSnap.data().originalUsername);
				}

				const personalRecipesCol = collection(firestore, `users/${auth.currentUser.uid}/personalRecipes`);
				const personalRecipesSnap = await getDocs(personalRecipesCol);
				setPersonalRecipes(personalRecipesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));

				const savedRecipesCol = collection(firestore, `users/${auth.currentUser.uid}/savedRecipes`);
				const savedRecipesSnap = await getDocs(savedRecipesCol);
				setSavedRecipes(savedRecipesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
			}
		};

		fetchUserData();
	}, []);

	return (
		<div className="landing-page">
		<h1>Welcome {originalUsername}</h1>
		<RecipeSearchBar
		recipes={recipes}
		publicRecipes={publicRecipes}
		onSearch={handleSearchResults}
		onView={openViewModal}

		/>

		<button onClick={openAddModal}>Add Recipe</button>
		<AddRecipeModal isOpen={isAddModalOpen} onClose={closeAddModal} addRecipe={addRecipe} />
		<ViewRecipeModal isOpen={isViewModalOpen} onClose={closeViewModal} recipe={selectedRecipe} />
		<EditRecipeModal isOpen={isEditModalOpen} onClose={closeEditModal} updateRecipe={updateRecipe} recipe={selectedRecipe} />
		<ViewPersonalRecipeModal isOpen={isPersonalViewModalOpen} onClose={closePersonalViewModal} recipe={selectedRecipe} onEdit={() => openEditModal(selectedRecipe)}/>	
		{/* Test set recipes */}
		<h2>All Recipes</h2>
		<div className="recipe-list">
		<div className="recipe-scroll">
		{(filteredRecipes.length > 0 ? filteredRecipes : recipes).map((recipe) => (
			<div key={recipe.id} className="recipe-item" onClick={() => openViewModal(recipe)}>
			<h3>{recipe.name}</h3>
			{}
			</div>
		))}
		</div>
		</div>

		{/* Public recipes */}
		<h2>Public Recipes</h2>
		<div className="recipe-list">
		<div className="recipe-scroll">
		{(filteredPublicRecipes.length > 0 ? filteredPublicRecipes : publicRecipes).map((recipe) => (
			<div key={recipe.id} className="recipe-item" onClick={() => openViewModal(recipe)}>
			<h3>{recipe.name}</h3>
			{}
			</div>
		))}
		</div>
		</div>

		<h2>My Personal Recipes</h2>
		<div className="recipe-list">
		<div className="recipe-scroll">
		{personalRecipes.filter(recipe => recipe && recipe.name).map(recipe => (
			<div key={recipe.id} className="recipe-item" onClick={() => openPersonalViewModal(recipe)}>
			<h3>{recipe.name}</h3>
			{}
			</div>
		))}
		</div>
		</div>	

		{/* Saved Recipes */}
		<h2>My Saved Recipes</h2>
		<div className="recipe-list">
		<div className="recipe-scroll">
		{savedRecipes.filter(recipe => recipe && recipe.name).map(recipe => (
			<div key={recipe.id} className="recipe-item" onClick={() => openViewModal(recipe)}>
			<h3>{recipe.name}</h3>
			{}
			</div>
		))}
		</div>
		</div>
		</div>
	);
};

export default WorkshopPage;

