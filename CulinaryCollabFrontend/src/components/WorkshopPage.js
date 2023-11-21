import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import './WorkshopPage.css';
import { firestore, auth } from '../firebase';
import { addDoc, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import AddRecipeModal from './AddRecipeModal';
import ViewRecipeModal from './ViewRecipeModal';
import RecipeSearchBar from './RecipeSearchBar';
import EditRecipeModal from './EditRecipeModal';
import ViewPersonalRecipeModal from './ViewPersonalRecipeModal';
import ViewSavedRecipeModal from './ViewSavedRecipeModal';

const WorkshopPage = () => {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isSavedRecipeModalOpen, setIsSavedRecipeModalOpen] = useState(false);
	const [recipes, setRecipes] = useState([]);
	const [publicRecipes, setPublicRecipes] = useState([]);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [personalRecipes, setPersonalRecipes] = useState([]);
	const [savedRecipes, setSavedRecipes] = useState([]);
	const [allUserRecipes, setAllUserRecipes] = useState([]);
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

	const openSavedRecipeModal = (recipe) => {
		setSelectedRecipe(recipe);
		setIsSavedRecipeModalOpen(true);
	};

	const closeSavedRecipeModal = () => {
		setIsSavedRecipeModalOpen(false);
		setSelectedRecipe(null);
	};
	const addRecipe = async (recipeData) => {
		try {
			if (auth.currentUser) {
				const user = auth.currentUser;
				const username = user.displayName;
				const email = user.email;

				const extendedRecipeData = {
					...recipeData,
					createdBy: {
						uid: user.uid,
						username: username,	
						email: email
					}
				};
				const personalRecipesRef = collection(firestore, `users/${auth.currentUser.uid}/personalRecipes`);
				await addDoc(personalRecipesRef, recipeData);

				const allUserRecipesRef = collection(firestore, `allUserRecipes`);
				await addDoc(allUserRecipesRef, extendedRecipeData);

				console.log('Personal recipe saved successfully');
				fetchPersonalRecipes();
				fetchAllUserRecipes();
			}
		} catch (error) {
			console.error('Error saving personal recipe: ', error);
		}
	};
	const removeSavedRecipe = async (recipeId) => {
		try {
			if (auth.currentUser && recipeId) {
				const recipeRef = doc(firestore, `users/${auth.currentUser.uid}/savedRecipes`, recipeId);
				await deleteDoc(recipeRef);
				console.log('Recipe removed successfully');
				fetchSavedRecipes();
			}
		} catch (error) {
			console.error('Error removing saved recipe: ', error);
		}
	};
	const saveRecipe = async (recipe) => {
		try {
			if (auth.currentUser) {
				const savedRecipesRef = collection(firestore, `users/${auth.currentUser.uid}/savedRecipes`);
				await addDoc(savedRecipesRef, recipe);
				console.log('Recipe saved successfully');
				fetchSavedRecipes();
			}
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
	const fetchPersonalRecipes = async () => {
		const personalRecipesCol = collection(firestore, `users/${auth.currentUser.uid}/personalRecipes`);
		const personalRecipesSnap = await getDocs(personalRecipesCol);
		setPersonalRecipes(personalRecipesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
	};
	const fetchSavedRecipes = async () => {
		const savedRecipesCollection = collection(firestore, `users/${auth.currentUser.uid}/savedRecipes`);
		const savedRecipesSnap = await getDocs(savedRecipesCollection);
		setSavedRecipes(savedRecipesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
	};

	const fetchAllUserRecipes = async () => {
		const allRecipesCollection = collection(firestore, 'allUserRecipes');
		const allRecipesSnap = await getDocs(allRecipesCollection);
		setAllUserRecipes(allRecipesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
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
	useEffect(() => {
		
		fetchPublicRecipes();
		fetchPersonalRecipes();
		fetchSavedRecipes();
		fetchAllUserRecipes();
	}, []);


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



	return (
		<div className="landing-page">
		<h1>Welcome {originalUsername}</h1>
		<RecipeSearchBar
		publicRecipes={publicRecipes}
		personalRecipes={personalRecipes}
		savedRecipes={savedRecipes}	
		onView={openViewModal}
		/>

		<button onClick={openAddModal}>Add Recipe</button>
		<AddRecipeModal isOpen={isAddModalOpen} onClose={closeAddModal} addRecipe={addRecipe} />
		<ViewRecipeModal isOpen={isViewModalOpen} onClose={closeViewModal} recipe={selectedRecipe} onSave={() => saveRecipe(selectedRecipe)}/>
		<EditRecipeModal isOpen={isEditModalOpen} onClose={closeEditModal} updateRecipe={updateRecipe} recipe={selectedRecipe} />
		<ViewPersonalRecipeModal isOpen={isPersonalViewModalOpen} onClose={closePersonalViewModal} recipe={selectedRecipe} onEdit={() => openEditModal(selectedRecipe)}/>	
		<ViewSavedRecipeModal isOpen={isSavedRecipeModalOpen} onClose={closeSavedRecipeModal} recipe={selectedRecipe} onRemove={() => removeSavedRecipe(selectedRecipe.id)}/>
		{/* Universal Recipes */}
		<h2>All User Recipes</h2>
		<div className="recipe-list">
		<div className="recipe-scroll">
		{allUserRecipes.map(recipe => (
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
		{publicRecipes.map((recipe) => ( // Always render publicRecipes
			<div key={recipe.id} className="recipe-item" onClick={() => openViewModal(recipe)}>
			<h3>{recipe.name}</h3>
			{/* Additional recipe details */}
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
			<div key={recipe.id} className="recipe-item" onClick={() => openSavedRecipeModal(recipe)}>
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

