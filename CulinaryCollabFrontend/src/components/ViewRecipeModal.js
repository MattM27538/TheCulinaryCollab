import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import './ViewRecipeModal.css';
import { auth, firestore } from '../firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

const ViewRecipeModal = ({ isOpen, onClose, recipe, onSave, showSaveOption }) => {
	const [userRating, setUserRating] = useState(null);
	const [averageRating, setAverageRating] = useState(null);
	const user = auth.currentUser;
	const isLoggedIn = auth.currentUser != null;
	const fetchRatings = async () => {
		if (!recipe) return;

		const ratingsRef = collection(firestore, `recipes/${recipe.id}/ratings`);
		const ratingsSnap = await getDocs(ratingsRef);
		let total = 0;
		let count = 0;
		let currentUserRating = null;

		ratingsSnap.forEach((doc) => {
			total += doc.data().rating;
			count++;
			if (doc.id === user.uid) {
				currentUserRating = doc.data().rating;
			}
		});

		setAverageRating(count === 0 ? 0 : total / count);
		setUserRating(currentUserRating);
	};

	useEffect(() => {
		if (recipe && isOpen) {
			fetchRatings();
		}
	}, [recipe, isOpen]);

	const handleRating = async (newRating) => {
		if (user) {
			const ratingRef = doc(firestore, `recipes/${recipe.id}/ratings`, user.uid);
			await setDoc(ratingRef, { rating: newRating });
			setUserRating(newRating);
			fetchRatings();
		}
	};

	if (!recipe) return null;

	return (
		<div className={`modal ${isOpen ? 'open' : ''}`}>
		<div className="modal-content">
		<h2>{recipe.name}</h2>

		<div>
		<p>Your Rating:</p>
		<RatingStars value={userRating || 0} onChange={handleRating} />
		</div>

		{averageRating !== null && (
			<div>
			<p>Average Rating:</p>
			<RatingStars value={averageRating} readOnly />
			</div>
		)}
		<p><strong>Timing:</strong> {recipe.timing}</p>
		<p><strong>Taste:</strong> {recipe.taste}</p>
		<p><strong>Ingredients:</strong></p>
		<ul>
		{recipe.ingredients.map((ingredient, index) => (
			<li key={index}>
			{ingredient.ingredient} ({ingredient.amount} {ingredient.unit})
			</li>
		))}
		</ul>
		<p><strong>Preparation:</strong> {recipe.preparation}</p>
		{recipe.cost && <p><strong>Cost:</strong> {recipe.cost}</p>}
		{recipe.timeToMake && <p><strong>Time to Make:</strong> {recipe.timeToMake}</p>}
		{showSaveOption && isLoggedIn && <button onClick={onSave}>Save Recipe</button>}
		<button onClick={onClose}>Close</button>
		</div>
		</div>
	);
};

export default ViewRecipeModal;

