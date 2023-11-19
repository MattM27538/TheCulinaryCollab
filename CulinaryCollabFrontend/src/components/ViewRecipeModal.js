import React from 'react';
import './ViewRecipeModal.css';

const ViewRecipeModal = ({ isOpen, onClose, recipe }) => {
  if (!recipe) return null; // If there's no recipe, don't display the modal

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
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

};

export default ViewRecipeModal;

