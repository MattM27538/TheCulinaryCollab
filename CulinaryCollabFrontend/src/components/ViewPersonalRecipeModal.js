import React from 'react';
import './ViewRecipeModal.css';

const PersonalRecipeViewModal = ({ isOpen, onClose, recipe, onEdit }) => {
	if (!recipe) return null;
	const handleEditClick = () => {
		onEdit();
		onClose();
	}
	return (
		<div className={`modal ${isOpen ? 'open' : ''}`}>
		<div className="modal-content">
		<button className="edit-button" onClick={handleEditClick}>Edit</button>
		<h2>{recipe.name}</h2>
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
		<button onClick={onClose}>Close</button>
		</div>
		</div>
	);
};

export default PersonalRecipeViewModal;

