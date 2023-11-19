
// DrinkForm.js
import React, { useState } from 'react';
import axios from 'axios';

const DrinkForm = () => {
  const [drinkName, setDrinkName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000', {
        name: drinkName,
        ingredients: ingredients,
	instructions: instructions,
      });

      // Optionally, you can reset the form or show a success message
      setDrinkName('');
      setIngredients('');
      setInstructions('');
    } catch (error) {
      console.error('Error creating drink:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Drink Name:
        <input
          type="text"
          value={drinkName}
          onChange={(e) => setDrinkName(e.target.value)}
        />
      </label>
      <label>
        Ingredients:
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </label>
 	<label>
        Instructions:
        <input
          type="text"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        	/>
      	</label>

      <button type="submit">Add Drink</button>
    </form>
  );
};

export default DrinkForm;
