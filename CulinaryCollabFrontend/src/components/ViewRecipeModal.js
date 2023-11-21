import React from 'react';
import './ViewRecipeModal.css';

const ViewRecipeModal = ({ isOpen, onClose, recipe, onSave, showSaveOption }) => {
	if (!recipe) return null;

	return (
		<div className={`modal ${isOpen ? 'open' : ''}`}>
		<div className="modal-content">
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
		<p><strong>Visibility:</strong> {recipe.visibility}</p>
		{}
		{showSaveOption && <button onClick={onSave}>Save Recipe</button>}
		<button onClick={onClose}>Close</button>
		</div>
		</div>
	);

};

export default ViewRecipeModal;

