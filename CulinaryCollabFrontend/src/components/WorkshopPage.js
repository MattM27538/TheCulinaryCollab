import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import './WorkshopPage.css';
import { firestore, auth } from '../firebase';
import { addDoc, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddRecipeModal from './AddRecipeModal';
import ViewRecipeModal from './ViewRecipeModal';
import RecipeSearchBar from './RecipeSearchBar';
import EditRecipeModal from './EditRecipeModal';
import ViewPersonalRecipeModal from './ViewPersonalRecipeModal';
import ViewSavedRecipeModal from './ViewSavedRecipeModal';
import RecipeItem from './RecipeItem';
const WorkshopPage = () => {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isSavedRecipeModalOpen, setIsSavedRecipeModalOpen] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [personalRecipes, setPersonalRecipes] = useState([]);
	const [savedRecipes, setSavedRecipes] = useState([]);
	const [publicRecipes, setPublicRecipes] = useState([]);
	const [allUserRecipes, setAllUserRecipes] = useState([]);
	const [originalUsername, setOriginalUsername] = useState('');
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isPersonalViewModalOpen, setIsPersonalViewModalOpen] = useState(false);
	const [selectedRecipeForEdit, setSelectedRecipeForEdit] = useState(null);
	const user = auth.currentUser;
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
				fetchUserData();
				const user = auth.currentUser;
				const username = originalUsername;
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
				await addDoc(personalRecipesRef, extendedRecipeData);

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
		if (user) {
			fetchPersonalRecipes();
			fetchSavedRecipes();
		} else {
			console.log("Not logged in");
		}
		fetchAllUserRecipes();
		fetchUserData();
	}, [user]);


	const fetchUserData = async () => {
		if (auth.currentUser) {
			const userRef = doc(firestore, 'users', auth.currentUser.uid);
			const userSnap = await getDoc(userRef);

			if (userSnap.exists()) {
				const userData = userSnap.data();
				setOriginalUsername(userData.originalUsername);
			}

			const personalRecipesCol = collection(firestore, `users/${auth.currentUser.uid}/personalRecipes`);
			const personalRecipesSnap = await getDocs(personalRecipesCol);
			setPersonalRecipes(personalRecipesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));

			const savedRecipesCol = collection(firestore, `users/${auth.currentUser.uid}/savedRecipes`);
			const savedRecipesSnap = await getDocs(savedRecipesCol);
			setSavedRecipes(savedRecipesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
		}
	};
	const handleDrop = async (item, collectionName) => {
		if (item.type === 'public' && collectionName !== 'public') {
			
			const newRecipeData = { ...item.recipe, visibility: collectionName };
			await addDoc(collection(firestore, `users/${auth.currentUser.uid}/${collectionName}Recipes`), newRecipeData);
		} else if (item.type !== collectionName) {
			
			await deleteDoc(doc(firestore, `users/${auth.currentUser.uid}/${item.type}Recipes`, item.id));
			await setDoc(doc(firestore, `users/${auth.currentUser.uid}/${collectionName}Recipes`, item.id), item.recipe);
		}
		
		fetchPersonalRecipes();
		fetchSavedRecipes();
	};

	const Collection = ({ recipes, type }) => {
		const [, drop] = useDrop(() => ({
			accept: 'recipe',
			drop: (item) => handleDrop(item, type),
			canDrop: (item, monitor) => type !== 'public',
			collect: (monitor) => ({
				isOver: monitor.isOver(),
				canDrop: monitor.canDrop(),
			}),
		}));

		return (
			<div ref={drop} className={`recipe-list ${type}`}>
			<div className="recipe-scroll">
			{recipes.map((recipe) => (
				<RecipeItem key={recipe.id} recipe={recipe} type={type} onOpenModal={type === 'public' ? openViewModal : type === 'personal' ? openPersonalViewModal : openSavedRecipeModal} />
			))}
			</div>
			</div>
		);
	};

if (!user) {
	return <div>Please log in to view this page. </div>;
}

	return (
		<DndProvider backend={HTML5Backend}>
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
		<ViewRecipeModal isOpen={isViewModalOpen} onClose={closeViewModal} recipe={selectedRecipe} onSave={() => saveRecipe(selectedRecipe)} showSaveOption={selectedRecipe}/>
		<EditRecipeModal isOpen={isEditModalOpen} onClose={closeEditModal} updateRecipe={updateRecipe} recipe={selectedRecipe} />
		<ViewPersonalRecipeModal isOpen={isPersonalViewModalOpen} onClose={closePersonalViewModal} recipe={selectedRecipe} onEdit={() => openEditModal(selectedRecipe)}/>
		<ViewSavedRecipeModal isOpen={isSavedRecipeModalOpen} onClose={closeSavedRecipeModal} recipe={selectedRecipe} onRemove={() => removeSavedRecipe(selectedRecipe.id)}/>

		{/* Universal Recipes */}
		<h2>All User Recipes</h2>
		<div className="recipe-list">
		<div className="recipe-scroll">
		{allUserRecipes.map(recipe => (
			<RecipeItem key={recipe.id} recipe={recipe} type="universal" onOpenModal={openViewModal} />
		))}
		</div>
		</div>
		{/* Public recipes */}
		<h2>Public Recipes</h2>
		<Collection recipes={publicRecipes.filter(recipe => recipe.id !== 'initial')} type="public" handleDrop={handleDrop} />

		{/* Personal Recipes */}
		<h2>My Personal Recipes</h2>
		<Collection recipes={personalRecipes.filter(recipe => recipe.id !== 'initial')} type="personal" handleDrop={handleDrop} />

		{/* Saved Recipes */}
		<h2>My Saved Recipes</h2>
		<Collection recipes={savedRecipes.filter(recipe => recipe.id !== 'initial')} type="saved" handleDrop={handleDrop} />
		</div>
		</DndProvider>
	);
};

export default WorkshopPage;
